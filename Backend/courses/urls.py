from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    CourseViewSet,
    ChapterViewSet,
    EnrollmentViewSet
)


course_router = DefaultRouter()
course_router.register("", CourseViewSet, basename="courses")

chapter_router = DefaultRouter()
chapter_router.register("", ChapterViewSet, basename="chapters")

enrollment_router = DefaultRouter()
enrollment_router.register("", EnrollmentViewSet, basename="enrollments")

urlpatterns = [
    path(
        "chapters/",
        include(chapter_router.urls)
    ),
    path(
        "enrollments/",
        include(enrollment_router.urls)
    ),
    path(
        "",
        include(course_router.urls)
    ),
]