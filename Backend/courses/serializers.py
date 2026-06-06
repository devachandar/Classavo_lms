from rest_framework import serializers
from rest_framework.permissions import BasePermission

from .models import Course, Chapter, Enrollment, Progress

class CourseSerializer(serializers.ModelSerializer):

    instructor = serializers.StringRelatedField(
        read_only=True
    )
    chapter_count = serializers.SerializerMethodField()

    student_count = serializers.SerializerMethodField()
    class Meta:
        model = Course

        fields = (
            "id",
            "title",
            "description",
            "status",
            "instructor",
            "chapter_count",
            "student_count",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "instructor",
            "created_at",
            "updated_at",
        )
        
    def get_chapter_count(
        self,
        obj
    ):
        return obj.chapters.count()
    
    def get_student_count(
        self,
        obj
    ):
        return obj.enrollments.count()
        
    
class ChapterSerializer(serializers.ModelSerializer):
    
    content = serializers.JSONField(
        required=False,
        default=list
    )

    class Meta:
        model = Chapter

        fields = (
            "id",
            "course",
            "title",
            "content",
            "position",
            "status",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class EnrollmentSerializer(
    serializers.ModelSerializer
):

    course_title = serializers.CharField(
        source="course.title",
        read_only=True
    )

    progress_percentage = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = Enrollment

        fields = (
            "id",
            "course",
            "course_title",
            "progress_percentage",
            "enrolled_at",
        )

        read_only_fields = (
            "id",
            "course_title",
            "progress_percentage",
            "enrolled_at",
        )

    def get_progress_percentage(
        self,
        obj
    ):

        total_chapters = (
            Chapter.objects.filter(
                course=obj.course,
                status="PUBLISHED"
            )
            .count()
        )

        completed_chapters = (
            Progress.objects.filter(
                student=obj.student,
                chapter__course=obj.course,
                status="COMPLETED"
            )
            .count()
        )

        if total_chapters == 0:
            return 0

        return round(
            (
                completed_chapters
                / total_chapters
            ) * 100,
            2
        )
        
class CourseEnrollmentSerializer(
    serializers.ModelSerializer
):

    student_id = serializers.IntegerField(
        source="student.id",
        read_only=True
    )

    username = serializers.CharField(
        source="student.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="student.email",
        read_only=True
    )

    class Meta:
        model = Enrollment

        fields = (
            "id",
            "student_id",
            "username",
            "email",
            "enrolled_at",
        )
        
        
class ProgressSerializer(
    serializers.ModelSerializer
):

    chapter_title = serializers.CharField(
        source="chapter.title",
        read_only=True
    )

    class Meta:
        model = Progress

        fields = (
            "id",
            "chapter",
            "chapter_title",
            "status",
            "started_at",
            "completed_at",
        )