import json
import tempfile
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings

from apps.main.models import ContactSubmission, ContentSection, MediaAsset


class SecurityHeadersTests(TestCase):
    def test_headers_on_normal_error_and_preflight_responses(self):
        responses = [
            self.client.get("/api/media/public/"),
            self.client.get("/missing/"),
            self.client.options("/api/media/public/", HTTP_ORIGIN="http://localhost:3000", HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET"),
        ]
        for response in responses:
            with self.subTest(status=response.status_code):
                self.assertEqual(response["X-Frame-Options"], "DENY")
                self.assertEqual(response["X-Content-Type-Options"], "nosniff")
                self.assertIn("frame-ancestors 'none'", response["Content-Security-Policy"])
                self.assertIn("camera=()", response["Permissions-Policy"])


@override_settings(ADMIN_API_TOKEN="test-secret")
class ContentAndMediaTests(TestCase):
    def test_contact_status_updates_require_admin_token_and_valid_status(self):
        item = ContactSubmission.objects.create(name="Test", email="test@example.com", message="Anfrage")
        url = f"/api/submissions/{item.pk}/"
        body = json.dumps({"status": "read"})
        self.assertEqual(self.client.patch(url, body, content_type="application/json").status_code, 401)
        self.assertEqual(self.client.patch(url, json.dumps({"status": "other"}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 400)
        self.assertEqual(self.client.patch(url, body, content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 200)
        item.refresh_from_db()
        self.assertEqual(item.status, "read")

    def test_contact_deletion_requires_admin_and_removes_only_requested_message(self):
        item = ContactSubmission.objects.create(name="First", email="first@example.com", message="Anfrage")
        other = ContactSubmission.objects.create(name="Second", email="second@example.com", message="Andere Anfrage")
        url = f"/api/submissions/{item.pk}/"
        self.assertEqual(self.client.delete(url).status_code, 401)
        self.assertTrue(ContactSubmission.objects.filter(pk=item.pk).exists())
        self.assertEqual(self.client.delete(url, HTTP_X_ADMIN_TOKEN="wrong").status_code, 401)
        self.assertEqual(self.client.delete(url, HTTP_X_ADMIN_TOKEN="test-secret").status_code, 204)
        self.assertFalse(ContactSubmission.objects.filter(pk=item.pk).exists())
        self.assertTrue(ContactSubmission.objects.filter(pk=other.pk).exists())
        self.assertEqual(self.client.delete(url, HTTP_X_ADMIN_TOKEN="test-secret").status_code, 404)

    def test_content_write_requires_token_and_is_publicly_readable(self):
        data = json.dumps({"key": "site", "value": {"hero": {"title": "Neuer Titel"}}})
        self.assertEqual(self.client.post("/api/content/sections/", data, content_type="application/json").status_code, 401)
        self.assertEqual(self.client.post("/api/content/sections/", data, content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 201)
        self.assertEqual(self.client.get("/api/content/site/").json()["content"]["site"]["hero"]["title"], "Neuer Titel")
        self.assertEqual(ContentSection.objects.count(), 1)

    def test_media_update_is_protected_and_validated(self):
        with tempfile.TemporaryDirectory() as directory, self.settings(MEDIA_ROOT=directory):
            asset = MediaAsset.objects.create(file=SimpleUploadedFile("photo.jpg", b"\xff\xd8\xfftest", content_type="image/jpeg"), original_name="photo.jpg", content_type="image/jpeg")
            url = f"/api/media/{asset.pk}/"
            data = json.dumps({"title": "Bad", "alt": "Neues Bad", "category": "Bad", "isFeatured": True})
            self.assertEqual(self.client.patch(url, data, content_type="application/json").status_code, 401)
            self.assertEqual(self.client.patch(url, data, content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 200)
            self.assertEqual(self.client.get("/api/media/public/").json()["results"][0]["title"], "Bad")
            self.assertEqual(self.client.patch(url, json.dumps({"isFeatured": "yes"}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret").status_code, 400)

    def test_reference_import_is_repeatable_and_excludes_portrait(self):
        with tempfile.TemporaryDirectory() as source, tempfile.TemporaryDirectory() as media, self.settings(MEDIA_ROOT=media):
            Path(source, "project.jpg").write_bytes(b"\xff\xd8\xfftest")
            Path(source, "IMG_20261123_002235_850.jpg").write_bytes(b"\xff\xd8\xfftest")
            call_command("import_reference_photos", source, verbosity=0)
            call_command("import_reference_photos", source, verbosity=0)
            self.assertEqual(list(MediaAsset.objects.values_list("original_name", flat=True)), ["project.jpg"])

    def test_video_upload_and_public_listing(self):
        with tempfile.TemporaryDirectory() as directory, self.settings(MEDIA_ROOT=directory):
            video = SimpleUploadedFile("project.mp4", b"test video", content_type="video/mp4")
            response = self.client.post("/api/media/", {"file": video, "title": "Projektvideo"}, HTTP_X_ADMIN_TOKEN="test-secret")
            self.assertEqual(response.status_code, 201)
            result = self.client.get("/api/media/public/").json()["results"][0]
            self.assertEqual((result["mediaType"], result["title"]), ("video", "Projektvideo"))

    def test_upload_selection_replacement_and_removal_preserve_library(self):
        with tempfile.TemporaryDirectory() as directory, self.settings(MEDIA_ROOT=directory):
            def upload(name):
                return self.client.post("/api/media/", {"file": SimpleUploadedFile(name, b"\xff\xd8\xfftest", content_type="image/jpeg")}, HTTP_X_ADMIN_TOKEN="test-secret")
            first = upload("first.jpg")
            second = upload("second.jpg")
            self.assertEqual((first.status_code, second.status_code), (201, 201))
            ContentSection.objects.create(key="site", value={})
            for url in (first.json()["url"], second.json()["url"], ""):
                data = {"value": {"gallery": {"projects": [{"title": "Bad", "text": "Arbeit", "beforeImage": url, "afterImage": ""}]}}}
                response = self.client.put("/api/content/sections/site/", json.dumps(data), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(self.client.get("/api/content/site/").json()["content"]["site"]["gallery"]["projects"][0]["beforeImage"], url)
            self.assertEqual(MediaAsset.objects.count(), 2)

    def test_reference_projects_keep_independent_ordered_media_and_comparisons(self):
        ContentSection.objects.create(key="site", value={})
        projects = [
            {"title": "First", "text": "Description", "beforeImage": "/before.jpg", "afterImage": "/after.jpg", "mediaIds": [3, 1]},
            {"title": "Second", "text": "Other project", "beforeImage": "", "afterImage": "", "mediaIds": [2]},
        ]
        response = self.client.put("/api/content/sections/site/", json.dumps({"value": {"gallery": {"projects": projects}}}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret")
        self.assertEqual(response.status_code, 200)
        stored = self.client.get("/api/content/site/").json()["content"]["site"]["gallery"]["projects"]
        self.assertEqual(stored, projects)

    def test_upload_accepts_video_larger_than_previous_limit_and_rejects_bad_type(self):
        with tempfile.TemporaryDirectory() as directory, self.settings(MEDIA_ROOT=directory):
            video = SimpleUploadedFile("mobile.mp4", b"x" * (10 * 1024 * 1024 + 1), content_type="video/mp4")
            response = self.client.post("/api/media/", {"file": video}, HTTP_X_ADMIN_TOKEN="test-secret")
            self.assertEqual(response.status_code, 201)
            bad = SimpleUploadedFile("bad.jpg", b"not an image", content_type="image/jpeg")
            self.assertEqual(self.client.post("/api/media/", {"file": bad}, HTTP_X_ADMIN_TOKEN="test-secret").status_code, 400)
            self.assertEqual(MediaAsset.objects.count(), 1)

    def test_home_seed_preserves_existing_content_and_is_repeatable(self):
        section = ContentSection.objects.create(key="site", value={"hero": {"title": "Existing"}, "home": {"companyHeading": "Custom heading"}})
        call_command("seed_home_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value["hero"]["title"], "Existing")
        self.assertEqual(section.value["home"]["companyHeading"], "Custom heading")
        self.assertIn("companyImage", section.value["home"])
        snapshot = section.value
        call_command("seed_home_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value, snapshot)

    def test_faq_seed_preserves_editor_content_and_is_repeatable(self):
        section = ContentSection.objects.create(key="site", value={"faq": {"title": "Custom FAQ", "questions": [{"title": "Question", "text": "Answer"}]}, "nav": [{"label": "Home", "href": "/"}]})
        call_command("seed_faq_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value["faq"]["title"], "Custom FAQ")
        self.assertEqual(section.value["faq"]["questions"][0]["text"], "Answer")
        self.assertEqual(section.value["nav"][-1]["href"], "/faq")
        snapshot = section.value
        call_command("seed_faq_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value, snapshot)

    def test_legal_seed_and_content_updates_preserve_existing_fields(self):
        section = ContentSection.objects.create(key="site", value={"company": {"name": "Existing"}, "legal": {"impressum": {"vatId": "DE123", "sections": [{"title": "Test", "text": "Existing text"}]}}})
        call_command("seed_legal_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value["legal"]["impressum"]["vatId"], "DE123")
        self.assertEqual(section.value["legal"]["impressum"]["sections"][0]["text"], "Existing text")
        self.assertIn("datenschutz", section.value["legal"])
        snapshot = section.value
        call_command("seed_legal_content", verbosity=0)
        section.refresh_from_db()
        self.assertEqual(section.value, snapshot)
        snapshot["legal"]["datenschutz"]["sections"] = [{"title": "Privacy", "text": "Updated"}]
        response = self.client.put("/api/content/sections/site/", json.dumps({"value": snapshot}), content_type="application/json", HTTP_X_ADMIN_TOKEN="test-secret")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get("/api/content/site/").json()["content"]["site"]["legal"]["datenschutz"]["sections"][0]["text"], "Updated")
