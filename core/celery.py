import os
from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
app = Celery("core")
app.config_from_object("django.conf:settings", namespace="CELERY")

# Configurações explícitas de timezone
app.conf.update(
    timezone=settings.TIME_ZONE,
    enable_utc=False,  # Usar timezone local
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)

app.autodiscover_tasks()
