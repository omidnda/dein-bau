from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Review(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Ausstehend"
        APPROVED = "approved", "Freigegeben"
        REJECTED = "rejected", "Abgelehnt"

    name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    message = models.TextField(max_length=2000)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-pk")

    def __str__(self):
        return f"{self.name} ({self.rating}/5)"
