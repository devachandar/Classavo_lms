import {
    useEffect,
    useState,
} from "react";

import {
    getCourses,
    enrollCourse,
    getMyEnrollments,
} from "../api/courseApi";
import { Link } from "react-router-dom";

import { useAuth }
from "../../auth/context/AuthContext";

const StudentCoursesPage = () => {

    const { user } =
        useAuth();

    const [courses, setCourses] =
        useState([]);

    const [enrollments,
        setEnrollments] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        loadData();

    }, []);

    const loadData =
    async () => {

        try {

            const coursesData = await getCourses();

            setCourses(
                coursesData
            );

            try {

                const enrollmentData = await getMyEnrollments();

                setEnrollments( enrollmentData);

            } catch (error) {

                console.log(
                    "Enrollment API not ready"
                );

            }

            // setEnrollments(
            //     enrollmentData
            // );

        } catch (error) {

            console.error(
                error
            );

        } finally {

            setLoading(
                false
            );

        }
    };

    const handleEnroll =
    async (courseId) => {

        try {

            await enrollCourse(
                courseId
            );

            loadData();

        } catch (error) {

            console.error(
                error
            );

        }
    };

    if (loading) {

        return (
            <div className="p-10">
                Loading...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-slate-950 text-white">

            <div className="max-w-7xl mx-auto px-8 py-10">

                <div className="text-4xl font-bold mb-2 text-white">
                    Welcome,
                    {" "}
                    {user.username}
                    👋
                </div>

                <div className="text-slate-400 mb-10">
                    Continue your learning journey
                </div>

                {/* MY LEARNING */}

                <div className="mb-12">

                    <div className="text-2xl font-bold mb-6">
                        My Learning
                    </div>

                    <div className="space-y-4">

                        {enrollments.map(
                            (item) => (

                                <div
                                    key={item.id}
                                    className="
                                        bg-slate-900
                                        border
                                        border-slate-800
                                        rounded-2xl
                                        p-5
                                    "
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <h3 className="font-semibold">
                                                {
                                                    item.course_title
                                                }
                                            </h3>

                                            <p className="text-slate-400 text-sm">
                                                {
                                                    item.progress_percentage
                                                }%
                                                Complete
                                            </p>

                                        </div>

                                        <Link
                                            to={`/student/course/${item.course}`}
                                            className="
                                                bg-indigo-600
                                                px-4
                                                py-2
                                                rounded-xl
                                            "
                                        >
                                            Continue
                                        </Link>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

                {/* ALL COURSES */}

                <div>

                    <div className="text-2xl font-bold mb-6">
                        Browse Courses
                    </div>
                    {/* <div> */}


                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {courses.map(
                            (course) => {

                                const enrolled =
                                enrollments.some(
                                    (e) =>
                                        e.course ===
                                        course.id
                                );

                                return (

                                    <div
                                        key={course.id}
                                        className="
                                            bg-slate-900
                                            border
                                            border-slate-800
                                            rounded-2xl
                                            p-6
                                        "
                                    >

                                        <h3 className="font-bold text-xl mb-2">
                                            {
                                                course.title
                                            }
                                        </h3>

                                        <p className="text-slate-400 text-sm mb-5">
                                            {
                                                course.description
                                            }
                                        </p>

                                        <div className="flex justify-between items-center">

                                            <span className="text-slate-500 text-sm">
                                                {
                                                    course.chapter_count
                                                }
                                                {" "}
                                                Chapters
                                            </span>

                                            {

                                                enrolled
                                                ? (

                                                    <span className="text-green-400">
                                                        Enrolled
                                                    </span>

                                                )
                                                : (

                                                    <button
                                                        onClick={() =>
                                                            handleEnroll(
                                                                course.id
                                                            )
                                                        }
                                                        className="
                                                            bg-blue-600
                                                            hover:bg-blue-700
                                                            px-4
                                                            py-2
                                                            rounded-xl
                                                            transition
                                                        "
                                                    >
                                                        Enroll Now
                                                    </button>

                                                )

                                            }

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>

            </div>

        </div>

    );
};

export default StudentCoursesPage;