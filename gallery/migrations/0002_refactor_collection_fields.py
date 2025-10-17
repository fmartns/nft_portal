# Generated manually on 2025-10-12
# Refatoração do modelo NftCollection

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import gallery.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gallery', '0001_initial'),
    ]

    operations = [
        # Renomear campos de imagem existentes
        migrations.RenameField(
            model_name='nftcollection',
            old_name='icon_url',
            new_name='profile_image',
        ),
        migrations.RenameField(
            model_name='nftcollection',
            old_name='collection_image_url',
            new_name='cover_image',
        ),
        
        # Adicionar campo de criador (FK para User)
        migrations.AddField(
            model_name='nftcollection',
            name='creator',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='created_collections',
                to=settings.AUTH_USER_MODEL,
                verbose_name='Criador'
            ),
        ),
        
        # Adicionar campo de nome do criador (alternativo)
        migrations.AddField(
            model_name='nftcollection',
            name='creator_name',
            field=models.CharField(
                blank=True,
                help_text='Nome do criador (caso não seja um usuário registrado)',
                max_length=150,
                verbose_name='Nome do Criador'
            ),
        ),
        
        # Adicionar campos de estatísticas
        migrations.AddField(
            model_name='nftcollection',
            name='items_count',
            field=models.PositiveIntegerField(
                default=0,
                help_text='Total de NFTs nesta coleção',
                verbose_name='Número de Itens'
            ),
        ),
        migrations.AddField(
            model_name='nftcollection',
            name='owners_count',
            field=models.PositiveIntegerField(
                default=0,
                help_text='Total de proprietários únicos',
                verbose_name='Número de Proprietários'
            ),
        ),
        migrations.AddField(
            model_name='nftcollection',
            name='floor_price',
            field=models.DecimalField(
                decimal_places=8,
                default=0,
                help_text='Menor preço listado na coleção',
                max_digits=20,
                verbose_name='Floor Price (ETH)'
            ),
        ),
        migrations.AddField(
            model_name='nftcollection',
            name='total_volume',
            field=models.DecimalField(
                decimal_places=8,
                default=0,
                help_text='Volume total negociado',
                max_digits=30,
                verbose_name='Volume Total (ETH)'
            ),
        ),
        
        # Adicionar novos links sociais
        migrations.AddField(
            model_name='nftcollection',
            name='opensea_url',
            field=models.URLField(blank=True, verbose_name='OpenSea'),
        ),
        migrations.AddField(
            model_name='nftcollection',
            name='etherscan_url',
            field=models.URLField(blank=True, verbose_name='Etherscan'),
        ),
        
        # Atualizar verbose_names dos campos existentes
        migrations.AlterField(
            model_name='nftcollection',
            name='name',
            field=models.CharField(max_length=150, verbose_name='Nome da Coleção'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='description',
            field=models.TextField(blank=True, verbose_name='Descrição'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='address',
            field=models.CharField(
                max_length=42,
                unique=True,
                validators=[gallery.models.validate_eth_address],
                verbose_name='Endereço do Contrato'
            ),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='metadata_api_url',
            field=models.URLField(blank=True, verbose_name='URL da API de Metadados'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='website_url',
            field=models.URLField(blank=True, verbose_name='Website'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='twitter_url',
            field=models.URLField(blank=True, verbose_name='Twitter/X'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='instagram_url',
            field=models.URLField(blank=True, verbose_name='Instagram'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='discord_url',
            field=models.URLField(blank=True, verbose_name='Discord'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='telegram_url',
            field=models.URLField(blank=True, verbose_name='Telegram'),
        ),
    ]


