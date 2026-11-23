import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.main.models import ContentSection


class Command(BaseCommand):
    help = "Add missing homepage fields without replacing existing content."

    @transaction.atomic
    def handle(self, **options):
        path = Path(__file__).resolve().parents[2] / "initial_site_content.json"
        defaults = json.loads(path.read_text(encoding="utf-8"))["home"]
        section, _ = ContentSection.objects.select_for_update().get_or_create(key="site", defaults={"value": {}})
        if not isinstance(section.value, dict) or not isinstance(section.value.get("home", {}), dict):
            raise CommandError("Existing site/home content is not an object; no changes made.")
        value = dict(section.value)
        value["home"] = {**defaults, **value.get("home", {})}
        section.value = value
        section.save(update_fields=["value", "updated_at"])
        self.stdout.write(self.style.SUCCESS("Missing homepage fields added; existing values preserved."))
