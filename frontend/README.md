# Dein Bau Hub: frontend and content administration

The Next.js app reads site content and public media from the Django API. The custom administration page is `/custom-admin`; it authenticates an active Django superuser and proxies admin requests to Django. Contact requests are stored by Django and shown in the administration page.

## Local setup

1. Install backend requirements in a compatible Python environment and run `python manage.py migrate` in `backend`.
2. Set `ADMIN_API_TOKEN` to the same long random value in the Django and Next.js process environments. Set `ADMIN_SESSION_SECRET` to a different random value of at least 32 characters in the Next.js environment. Set `CONTENT_API_URL` to the Django API URL, for example `http://127.0.0.1:8000/api`. Environment variables must be exported to the processes in production. For local development only, Django also reads `ADMIN_API_TOKEN` from `backend/.env` when it is not set in the environment; Next.js reads `frontend/.env.local`. Restart the development servers after changing these settings if they do not reload automatically.
3. In `backend`, run `python manage.py createsuperuser`. Import the initial content and reference images once:

   ```sh
   python manage.py seed_site_content
   python manage.py seed_home_content
   python manage.py seed_faq_content
   python manage.py seed_legal_content
   python manage.py import_reference_photos ../frontend/public/images/reference
   ```

   These commands add missing homepage, FAQ and legal-page fields without overwriting existing site content or reimport files already present under the same original name. The director's portrait is excluded from the public gallery. Existing uploaded media and content must be backed up separately from the source checkout.
4. Run Django and then `npm install` and `npm run dev` in `frontend`. Visit `/custom-admin` and sign in with the Django superuser account.

The editor saves the `site` content section, supports selecting uploaded images for hero, services, portrait and reference comparisons, and edits media metadata. Project comparisons appear when both images are selected and saved. Uploads accept JPG, PNG, WebP, MP4, WebM and MOV up to 10 MB. Gallery videos and contact submissions are served by the backend. The legal pages can be edited under “Rechtliche Seiten”; company name and contact details are shared with “Unternehmen”. Legal text remains a draft until reviewed and completed.

For deployment, set the environment variables in the actual service configuration, use persistent database and media storage, and arrange backups. The local SQLite database and `backend/media` directory are ignored by Git and are not deployed by committing source files. Initial content uses local frontend assets, so deploy those assets too. Configure the production Django settings, hosts, HTTPS, server processes and reverse proxy for the target environment before exposing the service.

Reviews are submitted publicly and remain pending until a superuser approves them in `/custom-admin`. Only approved reviews contribute to the public count and average. Reviews are not customer-verified. Submission limits use the configured Django cache and the existing `CONTACT_RATE_LIMIT` and `CONTACT_RATE_LIMIT_WINDOW` values; use a shared cache for limits across multiple workers. Apply Django migrations on each deployed database before enabling the feature.

The `/ueber-uns` and `/leistungen` pages use ISR with a five-minute revalidation interval. Saving content through `/custom-admin` invalidates their cached content and pages for the next request; changes made directly in Django are picked up on time-based revalidation. Django must be reachable during the production build, and an existing generated page remains available if a later regeneration fails. Other public pages render on the server per request. In multi-instance deployments, configure a shared Next.js cache so invalidation reaches every instance. The `/faq` page reads its questions from the `site` content section; add or edit questions in the custom admin under “Häufige Fragen”. A new installation starts with an empty list.
