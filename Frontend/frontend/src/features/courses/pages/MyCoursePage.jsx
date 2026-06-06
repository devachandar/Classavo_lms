import {
    useEffect,
    useState,
    } from "react";

    import {
    getDashboardStats,
    getMyCourses,
    createCourse,
    } from "../api/courseApi";

    import DashboardStats from "../components/DashboardStats";

    import CourseRow from "../components/CourseRow";

    import { useAuth } from "../../auth/context/AuthContext";

    const MyCoursesPage = () => {

    const { user } = useAuth();

    const [courses, setCourses] =
        useState([]);

    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showCreateModal,setShowCreateModal] = useState(false);

    const [courseForm,setCourseForm] = useState({title: "",description: "",status: "DRAFT",});

    const handleCreateCourse =
        async () => {

            try {

                const newCourse =
                    await createCourse(
                        courseForm
                    );

                setCourses(
                    [
                        newCourse,
                        ...courses,
                    ]
                );

                setStats({
                    ...stats,
                    total_courses:
                        stats.total_courses + 1,
                });

                setShowCreateModal(
                    false
                );

                setCourseForm({
                    title: "",
                    description: "",
                    status: "DRAFT",
                });

            } catch (error) {

                console.error(error);

            }
        };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

        const [
            coursesData,
            statsData,
        ] = await Promise.all([
            getMyCourses(),
            getDashboardStats(),
        ]);

        setCourses(
            coursesData
        );

        setStats(
            statsData
        );

        } catch (error) {

        console.error(error);

        } finally {

        setLoading(false);

        }
    };

    if (
        loading ||
        !stats
    ) {
        return (
        <h2>
            Loading...
        </h2>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-8 py-10">

            <div className="flex justify-between items-center mb-10">

            <div>

                <div className="text-5xl font-bold text-white">
                Welcome, {user.username} 👋
                </div>

                <p className="text-slate-500 mt-3 text-white">
                You have {stats.total_courses} active courses
                </p>

            </div>

            <button
                onClick={() =>
                    setShowCreateModal(
                        true
                    )
                }
                className="
                    bg-gradient-to-r
                    from-indigo-600
                    to-blue-600
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-medium
                    hover:scale-[1.02]
                    transition
                "
            >
                + New Course
            </button>

            </div>

            <DashboardStats
            stats={stats}
            />

            <div className="mt-12">

            <div className="text-2xl font-semibold mb-6 text-white">
                Your Courses
            </div>

            <div className="space-y-4">

                {courses.map(
                (course) => (
                    <CourseRow
                    key={course.id}
                    course={course}
                    />
                )
                )}

            </div>

            </div>

        </div>
            {
                showCreateModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div
    className="
    bg-slate-900
    border
    border-slate-800
    rounded-3xl
    w-full
    max-w-lg
    p-8
    text-white
"
>

                        <div className="text-white text-2xl font-bold mb-6">
                            Create Course
                        </div>

                        <div className="space-y-4">

                            <input
                                placeholder="Course Title"
                                value={
                                    courseForm.title
                                }
                                onChange={(e) =>
                                    setCourseForm({
                                        ...courseForm,
                                        title:
                                            e.target.value,
                                    })
                                }
                                className="
w-full
bg-slate-800
border
border-slate-700
text-white
rounded-xl
px-4
py-3
focus:outline-none
focus:border-indigo-500
"
                            />

                            <textarea
                                rows={4}
                                placeholder="Course Description"
                                value={
                                    courseForm.description
                                }
                                onChange={(e) =>
                                    setCourseForm({
                                        ...courseForm,
                                        description:
                                            e.target.value,
                                    })
                                }
                                className="
w-full
bg-slate-800
border
border-slate-700
text-white
rounded-xl
px-4
py-3
focus:outline-none
focus:border-indigo-500
"
                            />

                            <select
                                value={
                                    courseForm.status
                                }
                                onChange={(e) =>
                                    setCourseForm({
                                        ...courseForm,
                                        status:
                                            e.target.value,
                                    })
                                }
                                className="
w-full
bg-slate-800
border
border-slate-700
text-white
rounded-xl
px-4
py-3
focus:outline-none
focus:border-indigo-500
"
                            >
                                <option value="DRAFT">
                                    Draft
                                </option>

                                <option value="PUBLISHED">
                                    Published
                                </option>

                            </select>

                        </div>

                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={
                                    handleCreateCourse
                                }
                                className="
                                    flex-1
                                    bg-indigo-600
                                    text-white
                                    py-3
                                    rounded-xl
                                "
                            >
                                Create Course
                            </button>

                            <button
                                onClick={() =>
                                    setShowCreateModal(
                                        false
                                    )
                                }
                                className="
flex-1
bg-slate-800
text-white
py-3
rounded-xl
hover:bg-slate-700
"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

                )}
        </div>
    );
};

export default MyCoursesPage;