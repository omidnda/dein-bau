from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Avg, Count
from django.http import Http404, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.main.views import contact_rate_limited, parse_json, require_admin_token
from .models import Review


def serialize_review(review, admin=False):
    result = {"id": review.pk, "name": review.name, "rating": review.rating, "message": review.message, "createdAt": review.created_at.isoformat()}
    if admin:
        result["status"] = review.status
    return result


@csrf_exempt
@require_http_methods(["GET", "POST"])
def reviews(request):
    if request.method == "GET":
        approved = Review.objects.filter(status=Review.Status.APPROVED)
        summary = approved.aggregate(count=Count("id"), average=Avg("rating"))
        return JsonResponse({"results": [serialize_review(review) for review in approved[:50]], **summary})
    if contact_rate_limited(request, prefix="review-rate"):
        response = JsonResponse({"detail": "Zu viele Anfragen. Bitte versuchen Sie es später erneut."}, status=429)
        response["Retry-After"] = str(settings.CONTACT_RATE_LIMIT_WINDOW)
        return response
    try:
        payload = parse_json(request)
        if payload.get("website"):
            return JsonResponse({"detail": "Bewertung eingereicht."}, status=201)
        name, message, rating = payload.get("name"), payload.get("message"), payload.get("rating")
        if not isinstance(name, str) or not isinstance(message, str) or not isinstance(rating, int) or isinstance(rating, bool):
            raise ValidationError("Name, Bewertung und Nachricht sind erforderlich.")
        review = Review(name=name.strip(), message=message.strip(), rating=rating)
        review.full_clean()
        review.save()
    except ValidationError as exc:
        return JsonResponse({"detail": exc.message_dict if hasattr(exc, "message_dict") else exc.messages}, status=400)
    return JsonResponse({"detail": "Bewertung eingereicht."}, status=201)


@require_http_methods(["GET"])
@require_admin_token
def admin_reviews(request):
    return JsonResponse({"results": [serialize_review(review, admin=True) for review in Review.objects.all()]})


@csrf_exempt
@require_http_methods(["PATCH", "DELETE"])
@require_admin_token
def admin_review_detail(request, pk):
    try:
        review = Review.objects.get(pk=pk)
    except Review.DoesNotExist as exc:
        raise Http404 from exc
    if request.method == "DELETE":
        review.delete()
        return HttpResponse(status=204)
    try:
        payload = parse_json(request)
        status = payload.get("status")
        if status not in Review.Status.values:
            raise ValidationError("Ungültiger Status.")
        review.status = status
        review.save(update_fields=["status"])
    except ValidationError as exc:
        return JsonResponse({"detail": exc.messages}, status=400)
    return JsonResponse(serialize_review(review, admin=True))
