from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

from apps.main.models import MediaAsset


class Command(BaseCommand):
    help = "Import supplied reference photos into the existing media library."

    def add_arguments(self, parser):
        parser.add_argument("directory", type=Path)

    def handle(self, directory, **options):
        if not directory.is_dir():
            raise CommandError("Reference photo directory does not exist.")
        imported = 0
        for path in sorted(directory.glob("*.jpg")):
            if path.name == "IMG_20261123_002235_850.jpg":
                continue
            if MediaAsset.objects.filter(original_name=path.name).exists():
                continue
            with path.open("rb") as source:
                asset = MediaAsset(original_name=path.name, content_type="image/jpeg", media_type="image", title="Einblick in unsere Arbeit", alt_text="Projektaufnahme von Sanierungs- und Ausbauarbeiten", category="Projektaufnahmen")
                asset.file.save(path.name, File(source), save=False)
                asset.save()
            imported += 1
        self.stdout.write(self.style.SUCCESS(f"Imported {imported} reference photos."))
