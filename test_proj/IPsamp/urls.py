from django.conf.urls import url
from django.conf.urls import include
from django.contrib import admin
from IPsamp import views


urlpatterns = [
	url(r'^$', views.index, name='IPMPindex'),
	url(r'^data/', views.data, name='IPMPdata'),
	url(r'^model/', views.model, name='IPMPdata'),
]
