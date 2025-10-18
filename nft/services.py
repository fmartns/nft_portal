from __future__ import annotations

import json
import logging
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional, Tuple

import requests


logger = logging.getLogger(__name__)


IMMUTABLE_BASE_URL = "https://api.x.immutable.com/v3/orders"


class ImmutableAPIError(Exception):
    """Raised when Immutable API returns a non-success status code."""


def get_current_rates() -> Tuple[Decimal, Decimal]:
    """
    Fetch current conversion rates.

    Returns tuple (eth_usd, usd_brl) as Decimals.
    On failure, returns fallback values.
    """
    eth_usd: Optional[Decimal] = None
    usd_brl: Optional[Decimal] = None

    try:
        cg_resp = requests.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={"ids": "ethereum", "vs_currencies": "usd"},
            headers={"Accept": "application/json"},
            timeout=10,
        )
        if cg_resp.status_code == 200:
            data = cg_resp.json()
            val = data.get("ethereum", {}).get("usd")
            if val is not None:
                eth_usd = Decimal(str(val))
        else:
            logger.warning("CoinGecko HTTP %s", cg_resp.status_code)
    except Exception as e:  # noqa: BLE001 - network exceptions are varied
        logger.warning("CoinGecko fetch failed: %s", e)

    # AwesomeAPI USD -> BRL
    try:
        br_resp = requests.get(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL",
            headers={"Accept": "application/json"},
            timeout=10,
        )
        if br_resp.status_code == 200:
            data = br_resp.json()
            bid = data.get("USDBRL", {}).get("bid")
            if bid is not None:
                usd_brl = Decimal(str(bid))
        else:
            logger.warning("AwesomeAPI HTTP %s", br_resp.status_code)
    except Exception as e:  # noqa: BLE001
        logger.warning("AwesomeAPI fetch failed: %s", e)

    # Fallbacks if any are missing
    if eth_usd is None:
        eth_usd = Decimal("4713.59")
    if usd_brl is None:
        usd_brl = Decimal("5.42")

    return eth_usd, usd_brl


def _wei_to_eth(wei: int) -> Decimal:
    """Convert Wei to ETH using Decimal with high precision."""
    return (Decimal(wei) / Decimal("1e18")).quantize(Decimal("0.000000000000000001"))


def pick_best_bid_order(orders: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Select the order with the LOWEST effective price from the list.
    Uses sell.data.quantity_with_fees when available; otherwise falls back to sell.data.quantity.
    Attaches auxiliary field '_price_wei' (int) on the selected order.
    """
    best: Optional[Dict[str, Any]] = None
    best_price: Optional[int] = None
    for order in orders:
        try:
            buy = order.get("buy", {})
            data = buy.get("data", {})
            raw = data.get("quantity_with_fees") or data.get("quantity")
            if raw is None:
                continue
            price_wei = int(str(raw))
            if best_price is None or price_wei < best_price:
                best = order
                best_price = price_wei
        except Exception:
            continue
    if best is not None and best_price is not None:
        best["_price_wei"] = best_price
    return best


def _get_prop(root: Dict[str, Any], key: str, default: Any = "") -> Any:
    props = root.get("sell", {}).get("data", {}).get("properties", {})
    return props.get(key, default)


def map_order_to_item_fields(
    order: Optional[Dict[str, Any]],
    product_code: str,
    eth_usd: Decimal,
    usd_brl: Decimal,
) -> Dict[str, Any]:
    """
    Map Immutable order JSON to our NFTItem fields dict.
    If order is None, returns a default structure with zeroed prices.
    """
    name = _get_prop(order or {}, "name", default=product_code)
    image_url = _get_prop(order or {}, "image_url", default="")
    blueprint = _get_prop(order or {}, "blueprint", default="")
    text_type = _get_prop(order or {}, "type", default="unknown")
    rarity = _get_prop(order or {}, "rarity", default="")
    item_type = _get_prop(order or {}, "itemType", default="")
    item_sub_type = _get_prop(order or {}, "itemSubType", default="")
    product_type = _get_prop(order or {}, "productType", default="")
    material = _get_prop(order or {}, "material", default="")
    is_crafted_item = bool(_get_prop(order or {}, "isCraftedItem", default=False))
    is_craft_material = bool(_get_prop(order or {}, "isCraftMaterial", default=False))

    number_val = _get_prop(order or {}, "number", default=None)
    try:
        number = int(number_val) if number_val is not None else None
    except Exception:
        number = None

    price_eth = Decimal("0")
    if order and "_price_wei" in order:
        price_eth = _wei_to_eth(int(order["_price_wei"]))

    price_usd = (price_eth * eth_usd).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    price_brl = (price_usd * usd_brl).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    mapped = {
        "name": name or product_code,
        "type": text_type or "unknown",
        "blueprint": blueprint or "",
        "image_url": image_url or "",
        "source": "immutable_bids",
        "is_crafted_item": is_crafted_item,
        "is_craft_material": is_craft_material,
        "rarity": rarity or "",
        "item_type": item_type or "",
        "item_sub_type": item_sub_type or "",
        "number": number,
        "product_code": product_code,
        "product_type": product_type or "",
        "material": material or "",
        "last_price_eth": price_eth,
        "last_price_usd": price_usd,
        "last_price_brl": price_brl,
    }

    return mapped


def fetch_item_from_immutable(product_code: str) -> Dict[str, Any]:
    """
    Orchestrates fetching orders for the given product_code from Immutable,
    picking the best order, converting prices, and mapping to NFTItem fields.
    """
    if not product_code or not str(product_code).strip():
        raise ValueError("product_code inválido")

    params = {
        "status": "active",
        "buy_token_type": "ETH",
        "sell_metadata": json.dumps({"productCode": [product_code]}),
        "order_by": "buy_quantity_with_fees",
        "direction": "asc",
        "page_size": 200,
    }
    headers = {"Accept": "application/json", "Content-Type": "application/json"}

    try:
        resp = requests.get(
            IMMUTABLE_BASE_URL, params=params, headers=headers, timeout=30
        )
    except requests.Timeout as e:
        logger.error("Immutable timeout for %s: %s", product_code, e)
        raise ImmutableAPIError("Timeout ao consultar a Immutable") from e
    except requests.RequestException as e:
        logger.error("Immutable request error for %s: %s", product_code, e)
        raise ImmutableAPIError("Erro ao consultar a Immutable") from e

    if resp.status_code == 429:
        detail = resp.text or "Rate limit da Immutable"
        raise ValueError(f"Rate limit: {detail}")
    if resp.status_code != 200:
        logger.error(
            "Immutable non-200 for %s: %s %s", product_code, resp.status_code, resp.text
        )
        raise ImmutableAPIError(f"HTTP {resp.status_code}")

    data = resp.json()
    results = data.get("result") or []
    best = pick_best_bid_order(results)

    eth_usd, usd_brl = get_current_rates()
    mapped = map_order_to_item_fields(best, product_code, eth_usd, usd_brl)

    logger.info(
        "fetch_item: product_code=%s status=200 orders=%s eth=%s usd=%s brl=%s",
        product_code,
        len(results),
        mapped.get("last_price_eth"),
        mapped.get("last_price_usd"),
        mapped.get("last_price_brl"),
    )

    return mapped
