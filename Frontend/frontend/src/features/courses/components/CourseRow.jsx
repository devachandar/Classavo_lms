import { useNavigate } from "react-router-dom";

const CourseRow = ({
    course,
    }) => {
    const navigate = useNavigate();
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex justify-between items-center">

        <div>

            <h3 className="text-xl font-semibold">
            {course.title}
            </h3>

            <p className="text-slate-500 mt-1">
            {course.chapter_count} chapters • {course.student_count} students
            </p>

        </div>

        <div className="flex items-center gap-3">

            <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
                course.status === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
            >
            {course.status}
            </span>

            <button
                onClick={() =>
                    navigate(
                    `/my-courses/${course.id}`
                    )
                }
                className="border rounded-xl px-4 py-2 hover:bg-slate-100 hover:text-black transition"
                >
                Edit
            </button>

        </div>

        </div>
    );
};

export default CourseRow;