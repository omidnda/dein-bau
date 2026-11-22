from django.core.validators import FileExtensionValidator, RegexValidator
from django.db import models


class ContentSection(models.Model):
    key = models.CharField(
        max_length=64,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[a-z][a-z0-9_-]*$",
                message="Use lowercase letters, numbers, hyphens, and underscores.",
            )
        ],
    )
    value = models.JSONField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("key",)

    def __str__(self):
        return self.key


class MediaAsset(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"

    file = models.FileField(
        upload_to="site/%Y/%m/",
        validators=[FileExtensionValidator(("jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"))],
    )
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100)
    media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    title = models.CharField(max_length=160, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=80, blank=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-is_featured", "sort_order", "-created_at")

    def __str__(self):
        return self.original_name


class ContactSubmission(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        READ = "read", "Read"
        DONE = "done", "Done"

    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=80, blank=True)
    service = models.CharField(max_length=120, blank=True)
    message = models.TextField(max_length=5000)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name} - {self.email}"
