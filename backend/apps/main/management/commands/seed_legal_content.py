import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.main.models import ContentSection


class Command(BaseCommand):
    help = "Add missing legal page fields without replacing existing content."

    @transaction.atomic
    def handle(self, **options):
        defaults = json.loads((Path(__file__).resolve().parents[2] / "initial_site_content.json").read_text(encoding="utf-8"))["legal"]
        section, _ = ContentSection.objects.select_for_update().get_or_create(key="site", defaults={"value": {}})
        if not isinstance(section.value, dict) or not isinstance(section.value.get("legal", {}), dict):
            raise CommandError("Existing site/legal content is not an object; no changes made.")
        value = dict(section.value)
        legal = dict(value.get("legal", {}))
        for key, fields in defaults.items():
            if not isinstance(legal.get(key, {}), dict):
                raise CommandError(f"Existing legal/{key} content is not an object; no changes made.")
            legal[key] = {**fields, **legal.get(key, {})}
        value["legal"] = legal
        section.value = value
        section.save(update_fields=["value", "updated_at"])
        self.stdout.write(self.style.SUCCESS("Missing legal fields added; existing values preserved."))
