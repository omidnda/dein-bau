from django.conf import settings
from django.http import HttpResponse
from django.utils.cache import patch_vary_headers


class CorsAndSecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin")
        allowed = origin in settings.CORS_ALLOWED_ORIGINS if origin else False
        is_preflight = request.method == "OPTIONS" and request.headers.get("Access-Control-Request-Method")

        if is_preflight:
            response = HttpResponse(status=204 if allowed else 403)
        else:
            response = self.get_response(request)

        if allowed:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, X-Admin-Token"
            response["Access-Control-Max-Age"] = "86400"
            patch_vary_headers(response, ("Origin",))

        response["Content-Security-Policy"] = "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
        # Preflight responses bypass Django's XFrameOptionsMiddleware.
        response.setdefault("X-Frame-Options", settings.X_FRAME_OPTIONS)
        response["Cross-Origin-Resource-Policy"] = "same-origin"
        response["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
        response["X-DNS-Prefetch-Control"] = "off"
        response["X-XSS-Protection"] = "0"
        return response
