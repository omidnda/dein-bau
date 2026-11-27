from django.urls import path

from . import views

urlpatterns = [
    path("auth/superuser/", views.verify_superuser, name="verify-superuser"),
    path("content/site/", views.site_content, name="site-content"),
    path("content/sections/", views.section_list, name="content-section-list"),
    path("content/sections/<slug:key>/", views.section_detail, name="content-section-detail"),
    path("media/", views.media_list, name="media-list"),
    path("gallery/admin/", views.gallery_admin, name="gallery-admin"),
    path("gallery/projects/", views.gallery_projects, name="gallery-projects"),
    path("media/public/", views.public_media_list, name="public-media-list"),
    path("media/<int:pk>/", views.media_detail, name="media-detail"),
    path("media/files/<path:file_path>", views.media_file, name="media-file"),
    path("contact/", views.contact_create, name="contact-create"),
    path("submissions/", views.submission_list, name="submission-list"),
    path("submissions/<int:pk>/", views.submission_detail, name="submission-detail"),
]
