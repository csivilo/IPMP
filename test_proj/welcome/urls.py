from django.conf.urls import url
from django.conf.urls import include
from django.contrib import admin
from welcome import views


urlpatterns = [
	url(r'^$', views.index, name= 'welcome'),
]
