from rest_framework import viewsets, status

from rest_framework.decorators import action

from rest_framework.response import Response

from .models import Course, Chapter, Enrollment, Progress
from django.db.models import Count
from django.utils import timezone

from .serializers import ChapterSerializer, CourseSerializer,EnrollmentSerializer,CourseEnrollmentSerializer,ProgressSerializer

from .permissions import (
    IsInstructor,
    IsStudent,
    IsCourseOwner,
    IsChapterOwner,
)

from rest_framework.exceptions import PermissionDenied

class CourseViewSet(
    viewsets.ModelViewSet
):

    serializer_class = CourseSerializer

    def get_queryset(self):

        user = self.request.user

        if (
            user.is_authenticated
            and user.role == "INSTRUCTOR"
        ):
            return Course.objects.filter(
                instructor=user
            )

        return Course.objects.filter(
            status="PUBLISHED"
        )

    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
            "my_courses",
        ]:
            return [IsInstructor()]

        return []

    def perform_create(
        self,
        serializer
    ):
        serializer.save(
            instructor=self.request.user
        )

    def perform_update(
        self,
        serializer
    ):

        course = self.get_object()

        if course.instructor != self.request.user:
            raise PermissionDenied(
                "You do not own this course."
            )

        serializer.save()

    def perform_destroy(
        self,
        instance
    ):

        if instance.instructor != self.request.user:
            raise PermissionDenied(
                "You do not own this course."
            )

        instance.delete()
        

    @action(
        detail=False,
        methods=["get"],
        url_path="my-courses"
    )
    def my_courses(
        self,
        request
    ):

        queryset = Course.objects.filter(
            instructor=request.user
        )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
            serializer.data
        ) 
        
        
    @action(
    detail=True,
    methods=["post"]
    )
    def join(
        self,
        request,
        pk=None
    ): 
        if request.user.role != "STUDENT":
            return Response(
            {
                "detail":
                "Only students can join courses."
            },
            status=status.HTTP_403_FORBIDDEN
        )

        course = self.get_object() 
        enrollment_exists = (
            Enrollment.objects.filter(
                student=request.user,
                course=course
            ).exists()
        )

        if enrollment_exists:
            return Response(
                {
                    "detail":
                    "Already enrolled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course
        )   
        serializer = EnrollmentSerializer(
            enrollment
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
        
        
    @action(
    detail=True,
    methods=["get"],
    permission_classes=[IsInstructor]
    )
    def enrollments(
        self,
        request,
        pk=None
    ):
        course = self.get_object()
        if course.instructor != request.user:

            raise PermissionDenied(
                "You do not own this course."
            )
            
        enrollments = (
            Enrollment.objects.filter(
                course=course
            )
            .select_related("student")
        )
        serializer = CourseEnrollmentSerializer(
            enrollments,
            many=True
        )

        return Response(
            serializer.data
        )
        
    @action(
    detail=True,
    methods=["get"]
    )
    def progress_summary(
        self,
        request,
        pk=None
    ):
        course = self.get_object()
        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not enrolled:
            raise PermissionDenied(
                "You are not enrolled in this course."
            )
        
        total_chapters = (
            Chapter.objects.filter(
                course=course,
                status="PUBLISHED"
            )
            .count()
        )
        completed_chapters = (
            Progress.objects.filter(
                student=request.user,
                chapter__course=course,
                status="COMPLETED"
            )
            .count()
        )
        
        percentage = 0

        if total_chapters > 0:

            percentage = round(
                (
                    completed_chapters
                    / total_chapters
                ) * 100,
                2
            )
    
        return Response(
            {
                "course_id": course.id,
                "course_title": course.title,
                "total_chapters": total_chapters,
                "completed_chapters": completed_chapters,
                "progress_percentage": percentage,
            }
        )  
        
    @action(
    detail=False,
    methods=["get"],
    url_path="dashboard"
    )
    def dashboard(
        self,
        request
    ): 
            courses = Course.objects.filter(
                instructor=request.user
            )

            total_courses = courses.count()

            total_students = Enrollment.objects.filter(
                course__in=courses
            ).count()

            total_chapters = Chapter.objects.filter(
                course__in=courses
            ).count()

            return Response(
                {
                    "total_courses": total_courses,
                    "total_students": total_students,
                    "total_chapters": total_chapters,
                }
            )
            
    @action(
    detail=True,
    methods=["get"]
    )
    def completed_chapters(
        self,
        request,
        pk=None
    ):
        course = self.get_object()

        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not enrolled:
            raise PermissionDenied(
                "You are not enrolled in this course."
            )

        completed = Progress.objects.filter(
            student=request.user,
            chapter__course=course,
            status="COMPLETED"
        ).values_list(
            "chapter_id",
            flat=True
        )

        return Response(
            list(completed)
        )
            

class ChapterViewSet(
    viewsets.ModelViewSet
):

    serializer_class = ChapterSerializer

    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsInstructor()]

        return []
    
    def get_queryset(self):

        queryset = Chapter.objects.all()

        course_id = self.request.query_params.get(
            "course_id"
        )

        if course_id:
            queryset = queryset.filter(
                course_id=course_id
            )

        user = self.request.user

        if (
            user.is_authenticated
            and user.role == "INSTRUCTOR"
        ):
            return queryset.filter(
                course__instructor=user
            )

        return queryset.filter(
            status="PUBLISHED"
        )
        
    def perform_create(
        self,
        serializer
    ):

        course = serializer.validated_data[
            "course"
        ]

        if (
            course.instructor
            != self.request.user
        ):
            raise PermissionDenied(
                "You do not own this course."
            )

        serializer.save()
        
    def perform_update(
        self,
        serializer
    ):

        chapter = self.get_object()

        if (
            chapter.course.instructor
            != self.request.user
        ):
            raise PermissionDenied(
                "You do not own this chapter."
            )

        serializer.save()
        
    def perform_destroy(
        self,
        instance
    ):

        if (
            instance.course.instructor
            != self.request.user
        ):
            raise PermissionDenied(
                "You do not own this chapter."
            )

        instance.delete()
        
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsStudent]
    )
    def complete(
        self,
        request,
        pk=None
    ):
        chapter = self.get_object()

        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=chapter.course
        ).exists()

        if not enrolled:
            raise PermissionDenied(
                "You must join the course first."
            )

        progress, created = (
            Progress.objects.get_or_create(
                student=request.user,
                chapter=chapter
            )
        )

        if not progress.started_at:
            progress.started_at = timezone.now()

        progress.status = "COMPLETED"

        progress.completed_at = timezone.now()

        progress.save()

        serializer = ProgressSerializer(
            progress
        )

        return Response(
            serializer.data
        )
        
class EnrollmentViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = EnrollmentSerializer

    permission_classes = [
        IsStudent
    ]

    def get_queryset(self):

        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related(
            "course"
        )
        
        