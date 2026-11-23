from django.urls import path
from . import views

urlpatterns = [
    path("reviews/", views.reviews, name="reviews"),
    path("reviews/admin/", views.admin_reviews, name="admin-reviews"),
    path("reviews/admin/<int:pk>/", views.admin_review_detail, name="admin-review-detail"),
]
