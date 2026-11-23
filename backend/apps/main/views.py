import json
import hashlib
import ipaddress
from functools import wraps

from django.conf import settings
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ContactSubmission, ContentSection, MediaAsset


ALLOWED_IMAGE_TYPES = {
    "image/jpeg": (("jpg", "jpeg"), lambda header: header.startswith(b"\xff\xd8\xff")),
    "image/png": (("png",), lambda header: header.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/webp": (("webp",), lambda header: header.startswith(b"RIFF") and header[8:12] == b"WEBP"),
}
ALLOWED_VIDEO_TYPES = {
    "video/mp4": ("mp4",),
    "video/webm": ("webm",),
    "video/quicktime": ("mov",),
}


def serialize_section(section):
    return {
        "key": section.key,
        "value": section.value,
        "isActive": section.is_active,
        "updatedAt": section.updated_at.isoformat(),
    }


def parse_json(request):
    try:
        payload = json.loads(request.body or b"{}")
        if not isinstance(payload, dict):
            raise ValidationError("Request body must contain a JSON object.")
        return payload
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise ValidationError("Request body must contain valid JSON.") from exc


def require_admin_token(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        expected = settings.ADMIN_API_TOKEN
        if not expected:
            return JsonResponse({"detail": "ADMIN_API_TOKEN is not configured."}, status=503)
        if request.headers.get("X-Admin-Token") != expected:
            return JsonResponse({"detail": "Invalid admin token."}, status=401)
        return view(request, *args, **kwargs)

    return wrapped


@csrf_exempt
@require_http_methods(["POST"])
@require_admin_token
def verify_superuser(request):
    try:
        payload = parse_json(request)
        username = payload.get("username")
        password = payload.get("password")
        if not isinstance(username, str) or not isinstance(password, str):
            raise ValidationError("Username and password must be strings.")
    except ValidationError:
        return JsonResponse({"detail": "Benutzername oder Passwort ist falsch."}, status=401)

    user = authenticate(request=request, username=username, password=password)
    if user is None or not user.is_active or not user.is_superuser:
        return JsonResponse({"detail": "Benutzername oder Passwort ist falsch."}, status=401)
    return JsonResponse({"username": user.get_username()})


def get_client_ip(request):
    """Trust the frontend proxy's address only over a local backend connection."""
    remote_address = request.META.get("REMOTE_ADDR", "")
    forwarded_address = request.headers.get("X-Real-IP", "")
    candidate = forwarded_address if remote_address in {"127.0.0.1", "::1"} and forwarded_address else remote_address
    try:
        return str(ipaddress.ip_address(candidate))
    except ValueError:
        return "unknown"


def contact_rate_limited(request, prefix="contact-rate"):
    limit = settings.CONTACT_RATE_LIMIT
    window = settings.CONTACT_RATE_LIMIT_WINDOW
    identity = hashlib.sha256(get_client_ip(request).encode()).hexdigest()
    key = f"{prefix}:{identity}"
    if cache.add(key, 1, timeout=window):
        return False
    try:
        return cache.incr(key) > limit
    except ValueError:
        cache.set(key, 1, timeout=window)
        return False


def valid_uploaded_media(uploaded):
    extension = uploaded.name.rsplit(".", 1)[-1].lower() if "." in uploaded.name else ""
    image_type = ALLOWED_IMAGE_TYPES.get(uploaded.content_type)
    if image_type:
        if extension not in image_type[0]:
            return False
        header = uploaded.read(12)
        uploaded.seek(0)
        return image_type[1](header)
    video_extensions = ALLOWED_VIDEO_TYPES.get(uploaded.content_type)
    return bool(video_extensions and extension in video_extensions)


@require_http_methods(["GET"])
def site_content(request):
    content = {}
    for section in ContentSection.objects.all():
        value = section.value
        if section.key == "references" and isinstance(value, dict):
            value = {**value, "enabled": section.is_active}
        content[section.key] = value
    return JsonResponse({"content": content})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def section_list(request):
    if request.method == "GET":
        return JsonResponse({"results": [serialize_section(section) for section in ContentSection.objects.all()]})
    return require_admin_token(create_section)(request)


def create_section(request):
    try:
        payload = parse_json(request)
        is_active = payload.get("isActive", True)
        if not isinstance(is_active, bool):
            raise ValidationError({"isActive": "This field must be a boolean."})
        section = ContentSection(
            key=payload.get("key", ""),
            value=payload.get("value"),
            is_active=is_active,
        )
        section.full_clean()
        section.save()
    except (IntegrityError, ValidationError) as exc:
        if isinstance(exc, IntegrityError):
            return JsonResponse({"detail": "A section with this key already exists."}, status=409)
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse(serialize_section(section), status=201)


def get_section(key):
    try:
        return ContentSection.objects.get(key=key)
    except ContentSection.DoesNotExist as exc:
        raise Http404 from exc


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def section_detail(request, key):
    section = get_section(key)
    if request.method == "GET":
        return JsonResponse(serialize_section(section))
    return require_admin_token(mutate_section)(request, section)


def mutate_section(request, section):
    if request.method == "DELETE":
        section.delete()
        return HttpResponse(status=204)

    try:
        payload = parse_json(request)
        if "value" not in payload and "isActive" not in payload:
            raise ValidationError({"detail": "value or isActive is required."})
        if "value" in payload:
            section.value = payload["value"]
        if "isActive" in payload:
            if not isinstance(payload["isActive"], bool):
                raise ValidationError({"isActive": "This field must be a boolean."})
            section.is_active = payload["isActive"]
        section.full_clean()
        section.save(update_fields=("value", "is_active", "updated_at"))
    except ValidationError as exc:
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse(serialize_section(section))


def serialize_media(asset):
    return {
        "id": asset.pk,
        "name": asset.original_name,
        "contentType": asset.content_type,
        "mediaType": asset.media_type,
        "title": asset.title,
        "alt": asset.alt_text,
        "category": asset.category,
        "isFeatured": asset.is_featured,
        "sortOrder": asset.sort_order,
        "url": asset.file.url,
        "createdAt": asset.created_at.isoformat(),
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin_token
def media_list(request):
    if request.method == "GET":
        return JsonResponse({"results": [serialize_media(asset) for asset in MediaAsset.objects.all()]})

    uploaded = request.FILES.get("file")
    if not uploaded:
        return JsonResponse({"detail": "file is required."}, status=400)
    if uploaded.size > 10 * 1024 * 1024:
        return JsonResponse({"detail": "Files may not exceed 10 MB."}, status=400)
    if not valid_uploaded_media(uploaded):
        return JsonResponse({"detail": "Only valid JPG, PNG, WebP, MP4, WebM, and MOV files are allowed."}, status=400)

    try:
        sort_order = int(request.POST.get("sortOrder", "0") or 0)
        if sort_order < 0:
            raise ValueError
    except ValueError:
        return JsonResponse({"detail": "sortOrder must be a nonnegative integer."}, status=400)
    asset = MediaAsset(file=uploaded, original_name=uploaded.name,
                       content_type=uploaded.content_type,
                       media_type="video" if uploaded.content_type.startswith("video/") else "image",
                       title=str(request.POST.get("title", ""))[:160],
                       alt_text=str(request.POST.get("alt", ""))[:255],
                       category=str(request.POST.get("category", ""))[:80],
                       is_featured=request.POST.get("isFeatured") == "true",
                       sort_order=sort_order)
    try:
        asset.full_clean()
        asset.save()
    except ValidationError as exc:
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse(serialize_media(asset), status=201)


@require_http_methods(["GET"])
def public_media_list(request):
    return JsonResponse({"results": [serialize_media(asset) for asset in MediaAsset.objects.all()]})


@csrf_exempt
@require_http_methods(["PATCH", "DELETE"])
@require_admin_token
def media_detail(request, pk):
    try:
        asset = MediaAsset.objects.get(pk=pk)
    except MediaAsset.DoesNotExist as exc:
        raise Http404 from exc
    if request.method == "DELETE":
        asset.file.delete(save=False)
        asset.delete()
        return HttpResponse(status=204)
    try:
        payload = parse_json(request)
        fields = {"title": "title", "alt": "alt_text", "category": "category", "isFeatured": "is_featured", "sortOrder": "sort_order"}
        for key, field in fields.items():
            if key in payload:
                value = payload[key]
                if key in ("title", "alt", "category") and not isinstance(value, str):
                    raise ValidationError({key: "Must be a string."})
                if key == "isFeatured" and not isinstance(value, bool):
                    raise ValidationError({key: "Must be a boolean."})
                if key == "sortOrder" and (not isinstance(value, int) or isinstance(value, bool) or value < 0):
                    raise ValidationError({key: "Must be a nonnegative integer."})
                setattr(asset, field, value)
        asset.full_clean()
        asset.save()
    except ValidationError as exc:
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse(serialize_media(asset))


@require_http_methods(["GET"])
def media_file(request, file_path):
    try:
        asset = MediaAsset.objects.get(file=file_path)
    except MediaAsset.DoesNotExist as exc:
        raise Http404 from exc

    response = FileResponse(
        asset.file.open("rb"),
        as_attachment=False,
        filename=asset.original_name,
        content_type=asset.content_type,
    )
    response["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=604800"
    return response


def serialize_submission(submission):
    return {
        "id": submission.pk,
        "name": submission.name,
        "email": submission.email,
        "phone": submission.phone,
        "service": submission.service,
        "message": submission.message,
        "status": submission.status,
        "createdAt": submission.created_at.isoformat(),
    }


@csrf_exempt
@require_http_methods(["POST"])
def contact_create(request):
    if contact_rate_limited(request):
        response = JsonResponse({"detail": "Zu viele Anfragen. Bitte versuchen Sie es später erneut."}, status=429)
        response["Retry-After"] = str(settings.CONTACT_RATE_LIMIT_WINDOW)
        return response

    try:
        payload = parse_json(request)
        if payload.get("website"):
            return JsonResponse({"detail": "Message received."}, status=201)
        submission = ContactSubmission(
            name=payload.get("name", "").strip(),
            email=payload.get("email", "").strip(),
            phone=payload.get("phone", "").strip(),
            service=payload.get("service", "").strip(),
            message=payload.get("message", "").strip(),
        )
        submission.full_clean()
        submission.save()
    except (AttributeError, ValidationError) as exc:
        if isinstance(exc, AttributeError):
            return JsonResponse({"detail": "All fields must be strings."}, status=400)
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse({"id": submission.pk, "detail": "Message received."}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
@require_admin_token
def submission_list(request):
    return JsonResponse({"results": [serialize_submission(item) for item in ContactSubmission.objects.all()]})


@csrf_exempt
@require_http_methods(["PATCH", "DELETE"])
@require_admin_token
def submission_detail(request, pk):
    try:
        submission = ContactSubmission.objects.get(pk=pk)
    except ContactSubmission.DoesNotExist as exc:
        raise Http404 from exc
    if request.method == "DELETE":
        submission.delete()
        return HttpResponse(status=204)

    try:
        payload = parse_json(request)
        status = payload.get("status")
        if status not in ContactSubmission.Status.values:
            raise ValidationError({"status": "Choose new, read, or done."})
        submission.status = status
        submission.full_clean()
        submission.save(update_fields=("status",))
    except ValidationError as exc:
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse(serialize_submission(submission))
