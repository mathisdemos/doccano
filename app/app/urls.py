"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import PasswordResetView, LogoutView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from server.views import LoginView

# TODO: adds AnnotationList and AnnotationDetail endpoint.
schema_view = get_schema_view(
   openapi.Info(
      title="doccano API",
      default_version='v1',
      description="doccano API description",
      license=openapi.License(name="MIT License"),
   ),
   public=True,
)

urlpatterns = [
    path('', include('authentification.urls')),
    path('', include('server.urls')),
    path('admin/', admin.site.urls),
    path('social/', include('social_django.urls')),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api-auth/', include('rest_framework.urls')),
    path('v1/', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.views.generic import RedirectView
from django.conf.urls import url
urlpatterns += [
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    url(r'^images\/feature1\.png$', RedirectView.as_view(url='/static/images/feature1.png', permanent=True)),
    url(r'^images\/feature2\.png$', RedirectView.as_view(url='/static/images/feature2.png', permanent=True)),
    url(r'^images\/feature3\.png$', RedirectView.as_view(url='/static/images/feature3.png', permanent=True)),
    url(r'^images\/ner_demo\.png$', RedirectView.as_view(url='/static/images/ner_demo.png', permanent=True)),
    url(r'^images\/vbanner\.jpg$', RedirectView.as_view(url='/static/images/vbanner.jpg', permanent=True)),
]

from django.views.generic import TemplateView
urlpatterns += [
    url(r'^.*', TemplateView.as_view(template_name='index.html'))
]

if 'cloud_browser' in settings.INSTALLED_APPS:
    urlpatterns.append(path('cloud-storage/', include('cloud_browser.urls')))
