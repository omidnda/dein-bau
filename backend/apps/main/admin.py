from django.contrib import admin

from .models import ContactSubmission, ContentSection, MediaAsset


@admin.register(ContentSection)
class ContentSectionAdmin(admin.ModelAdmin):
    list_display = ("key", "is_active", "updated_at")
    list_editable = ("is_active",)
    list_filter = ("is_active",)
    search_fields = ("key",)
    readonly_fields = ("updated_at",)


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("original_name", "media_type", "category", "is_featured", "created_at")
    list_filter = ("media_type", "category", "is_featured")
    search_fields = ("original_name", "title", "alt_text", "category")
    readonly_fields = ("created_at",)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "email", "message")


from .models import GalleryProject, GalleryProjectMedia


class GalleryProjectMediaInline(admin.TabularInline):
    model = GalleryProjectMedia
    extra = 1
    autocomplete_fields = ('media', 'poster')


@admin.register(GalleryProject)
class GalleryProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'category', 'published', 'sort_order')
    list_editable = ('published', 'sort_order')
    prepopulated_fields = {'slug': ('title',)}
    autocomplete_fields = ('cover',)
    inlines = (GalleryProjectMediaInline,)
