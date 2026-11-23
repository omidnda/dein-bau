import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.main.models import ContentSection


class Command(BaseCommand):
    help = "Add missing FAQ content and navigation without replacing existing values."

    @transaction.atomic
    def handle(self, **options):
        defaults = json.loads((Path(__file__).resolve().parents[2] / "initial_site_content.json").read_text(encoding="utf-8"))
        section, _ = ContentSection.objects.select_for_update().get_or_create(key="site", defaults={"value": {}})
        if not isinstance(section.value, dict) or not isinstance(section.value.get("faq", {}), dict):
            raise CommandError("Existing site/faq content is not an object; no changes made.")
        value = dict(section.value)
        value["faq"] = {**defaults["faq"], **value.get("faq", {})}
        nav = value.get("nav", defaults["nav"])
        if not isinstance(nav, list) or any(not isinstance(item, dict) for item in nav):
            raise CommandError("Existing navigation is not a list of objects; no changes made.")
        if not any(item.get("href") == "/faq" for item in nav):
            nav = [*nav, {"label": "FAQ", "href": "/faq"}]
        value["nav"] = nav
        section.value = value
        section.save(update_fields=["value", "updated_at"])
        self.stdout.write(self.style.SUCCESS("FAQ fields and navigation added; existing values preserved."))
