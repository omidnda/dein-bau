import json

from django.core.cache import cache
from django.test import TestCase, override_settings

from apps.reviews.models import Review


@override_settings(ADMIN_API_TOKEN="test-secret", CONTACT_RATE_LIMIT=5, CONTACT_RATE_LIMIT_WINDOW=600)
class ReviewTests(TestCase):
    def setUp(self):
        cache.clear()

    def submit(self, **overrides):
        payload = {"name": "Alex", "message": "Gute Arbeit", "rating": 4, **overrides}
        return self.client.post("/api/reviews/", json.dumps(payload), content_type="application/json")

    def test_submission_starts_pending_and_only_approved_are_public(self):
        self.assertEqual(self.submit(status="approved").status_code, 201)
        review = Review.objects.get()
        self.assertEqual(review.status, Review.Status.PENDING)
        self.assertEqual(self.client.get("/api/reviews/").json(), {"results": [], "count": 0, "average": None})
        response = self.client.patch(f"/api/reviews/admin/{review.pk}/", json.dumps({"status": "approved"}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret")
        self.assertEqual(response.status_code, 200)
        public = self.client.get("/api/reviews/").json()
        self.assertEqual((public["count"], public["average"], public["results"][0]["message"]), (1, 4, "Gute Arbeit"))
        self.assertNotIn("status", public["results"][0])
        self.client.patch(f"/api/reviews/admin/{review.pk}/", json.dumps({"status": "rejected"}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret")
        self.assertEqual(self.client.get("/api/reviews/").json()["count"], 0)

    def test_invalid_ratings_and_empty_text_are_rejected(self):
        for rating in [0, 6, True, "5", 1.5, None]:
            self.assertEqual(self.submit(rating=rating).status_code, 400)
            cache.clear()
        self.assertEqual(self.submit(message="   ").status_code, 400)
        self.assertEqual(Review.objects.count(), 0)

    def test_admin_endpoints_require_token_and_validate_status(self):
        review = Review.objects.create(name="Alex", message="Text", rating=3)
        self.assertEqual(self.client.get("/api/reviews/admin/").status_code, 401)
        self.assertEqual(self.client.patch(f"/api/reviews/admin/{review.pk}/", json.dumps({"status": "approved"}), content_type="application/json").status_code, 401)
        self.assertEqual(self.client.delete(f"/api/reviews/admin/{review.pk}/").status_code, 401)
        self.assertEqual(self.client.patch(f"/api/reviews/admin/{review.pk}/", json.dumps({"status": "other"}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 400)
        self.assertEqual(self.client.delete(f"/api/reviews/admin/{review.pk}/", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 204)

    def test_rate_limit_and_honeypot(self):
        self.assertEqual(self.submit(website="spam").status_code, 201)
        self.assertEqual(Review.objects.count(), 0)
        for _ in range(4):
            self.assertEqual(self.submit().status_code, 201)
        response = self.submit()
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers["Retry-After"], "600")
