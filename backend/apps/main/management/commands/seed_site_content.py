import json
from pathlib import Path

from django.core.management.base import BaseCommand

from apps.main.models import ContentSection


class Command(BaseCommand):
    help = "Create the initial site content only if no site content exists."

    def handle(self, **options):
        path = Path(__file__).resolve().parents[2] / "initial_site_content.json"
        value = json.loads(path.read_text(encoding="utf-8"))
        _, created = ContentSection.objects.get_or_create(key="site", defaults={"value": value})
        self.stdout.write("Initial site content created." if created else "Site content already exists; unchanged.")
