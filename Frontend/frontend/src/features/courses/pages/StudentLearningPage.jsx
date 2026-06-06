import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import {
    getCourseDetails,
    getStudentCourseChapters,
    getCourseProgress,
    getCompletedChapters
} from "../api/courseApi";
import {completeChapter,} from "../../chapters/api/chapterApi";


import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    BookOpen,
    Pencil,
    Check,
    X,
    } from "lucide-react";


const StudentLearningPage = () => {
    const navigate = useNavigate();

    const { courseId } =
        useParams();

    const [course,
        setCourse] =
        useState(null);

    const [chapters,
        setChapters] =
        useState([]);

    const [
        selectedChapter,
        setSelectedChapter,
    ] = useState(null);

    const [
    progress,
    setProgress,
] = useState(null);

    const [
        completedChapters,
        setCompletedChapters,
    ] = useState([]);

    useEffect(() => {

        loadData();

    }, []);
    const handleComplete =
        async () => {

            try {

                await completeChapter(
                    selectedChapter.id
                );
                const updatedProgress =
                    await getCourseProgress(
                        courseId
                    );

                setProgress(
                    updatedProgress
                );

                setCompletedChapters(
                    (prev) => [

                        ...new Set([
                            ...prev,
                            selectedChapter.id,
                        ]),

                    ]
                );

                const currentIndex =
                    chapters.findIndex(
                        (c) =>
                            c.id ===
                            selectedChapter.id
                    );

                const nextChapter =
                    chapters[
                        currentIndex + 1
                    ];

                if (nextChapter) {

                    setSelectedChapter(
                        nextChapter
                    );

                }

            } catch (error) {

                console.error(error);

            }

        };

    const loadData =
    async () => {

        try {

            const [
                courseData,
                chapterData,
                progressData,
                completedData
            ] = await Promise.all([
                getCourseDetails(
                    courseId
                ),
                getStudentCourseChapters(
                    courseId
                ),
                getCourseProgress(
                    courseId
                ),
                getCompletedChapters(
        courseId
    ),
            ]);

            setCourse(
                courseData
            );

            setChapters(
                chapterData
            );
            setProgress(
    progressData
);
setCompletedChapters(
    completedData
);

            if (
                chapterData.length
            ) {

                setSelectedChapter(
                    chapterData[0]
                );

            }

        } catch (error) {

            console.error(
                error
            );

        }

    };

    if (!course) {

        return (
            <div>
                Loading...
            </div>
        );

    }

    return (

        <div className="h-screen bg-slate-950 text-white flex">

            {/* LEFT */}
            

            <div
                className="
                    w-80
                    border-r
                    border-slate-800
                "
            >

                <button
                onClick={() =>
                navigate(
                    "/student/courses"
                )
                }
                className="m-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"
            >
                <ArrowLeft size={16} />
                Courses
            </button>

                <div className="p-6">

                    <div className="text-xl font-bold">
                        Chapters
                    </div>

                </div>

                {
                    chapters.map(
                        (chapter) => (

                            <button
                                key={chapter.id}
                                onClick={() =>
                                    setSelectedChapter(
                                        chapter
                                    )
                                }
                                className={`
                                    w-full
                                    text-left
                                    px-6
                                    py-4
                                    border-b
                                    border-slate-800

                                    ${
                                        selectedChapter?.id
                                        === chapter.id
                                        ? "bg-indigo-600"
                                        : ""
                                    }
                                `}
                            >

                                <div className="flex items-center gap-3">

    <span>

        {
            completedChapters.includes(
                chapter.id
            )
            ? "✅"
            : <div
    className={`
        w-6
        h-6
        rounded-full
        flex
        items-center
        justify-center

        ${
            completedChapters.includes(
                chapter.id
            )
            ? "bg-green-500"
            : "bg-slate-700"
        }
    `}
>
    {
        completedChapters.includes(
            chapter.id
        )
        ? "✓"
        : ""
    }
</div>
        }

    </span>

    <span>
        {chapter.title}
    </span>

</div>

                            </button>

                        )
                    )
                }

            </div>

            {/* RIGHT */}

            {/* RIGHT */}

<div className="flex-1 flex flex-col h-screen">

    {/* HEADER */}

    <div className="border-b border-slate-800 p-6">

        <div>

    <div className="text-3xl font-bold">
        {course.title}
    </div>

    {

        progress && (

            <>

                <div
                    className="
                        mt-4
                        h-1
                        bg-slate-800
                        rounded-full
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            h-full
                            bg-green-500
                        "
                        style={{
                            width:
                            `${progress.progress_percentage}%`,
                        }}
                    />

                </div>

                <p
                    className="
                        mt-2
                        text-sm
                        text-slate-400
                    "
                >
                    {
                        progress.completed_chapters
                    }
                    {" / "}
                    {
                        progress.total_chapters
                    }
                    {" "}
                    chapters completed
                </p>

            </>

        )

    }

</div>

    </div>

    {/* CONTENT */}

    <div className="flex-1 overflow-y-auto p-8">

        <div className="text-2xl font-semibold mb-6">
            {selectedChapter?.title}
        </div>

        <pre className="whitespace-pre-wrap text-slate-300">
            {
                JSON.stringify(
                    selectedChapter?.content,
                    null,
                    2
                )
            }
        </pre>

    </div>

    {/* BOTTOM ACTION BAR */}
    <div className="border-t border-slate-800 p-6 flex justify-end shrink-0">

        {
        !completedChapters.includes(
            selectedChapter?.id
        ) && (

            <button
                onClick={handleComplete}
                className="
                    bg-green-600
                    hover:bg-green-700
                    px-6
                    py-3
                    rounded-xl
                    font-medium
                "
            >
                Mark Complete
            </button>

        )
    }

    </div>

</div>
            </div>
        // </div>

    );
};

export default StudentLearningPage;