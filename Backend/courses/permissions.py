from rest_framework.permissions import BasePermission


class IsInstructor(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "INSTRUCTOR"
        )

class IsStudent(BasePermission):

    def has_permission(
        self,
        request,
        view
    ):
        return (
            request.user.is_authenticated
            and request.user.role == "STUDENT"
        )

class IsCourseOwner(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        return obj.instructor == request.user
    
class IsChapterOwner(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        return (
            obj.course.instructor
            == request.user
        )