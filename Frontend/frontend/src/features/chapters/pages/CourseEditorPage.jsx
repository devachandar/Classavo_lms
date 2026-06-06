import {
    useEffect,
    useState,
    } from "react";

    import {
    useParams,
    useNavigate,
    } from "react-router-dom";

    import {
    ArrowLeft,
    Users,
    BookOpen,
    Pencil,
    Check,
    X,
    } from "lucide-react";

    import {
    getCourseDetails,
    getCourseChapters,
    createChapter,
    updateChapter,
    deleteChapter
    } from "../api/chapterApi";

    import {
    getCourseEnrollments,
    updateCourse,
    } from "../../courses/api/courseApi";

    import ChapterSidebar from "../components/ChapterSidebar";
    import ChapterEditor from "../components/ChapterEditor";
    import StudentSidebar from "../components/StudentSidebar";

    const CourseEditorPage = () => {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] =
        useState(null);

    const [chapters, setChapters] =
        useState([]);

    const [students, setStudents] =
        useState([]);

    const [
        selectedChapter,
        setSelectedChapter,
    ] = useState(null);

    const [
        editingCourse,
        setEditingCourse,
    ] = useState(false);

    const [courseForm, setCourseForm] =
        useState({
        title: "",
        description: "",
        status: "",
        });
    const [showCreateModal,setShowCreateModal] = useState(false);

    const [chapterForm, setChapterForm] =
        useState({
            title: "",
            content: [],
            status: "DRAFT",
        });

        const [
            createChapterForm,
            setCreateChapterForm,
        ] = useState({
            title: "",
            position: 1,
            status: "DRAFT",
        });
    
    useEffect(() => {

        if (
            selectedChapter
        ) {

            setChapterForm({
                title:
                    selectedChapter.title,

                content:
                    selectedChapter.content?.length
                    ? selectedChapter.content
                    : [
                        {
                            type: "p",
                            children: [
                            {
                                text: "",
                            },
                            ],
                        },
                        ],

                status:
                    selectedChapter.status,
                });

        }

    }, [selectedChapter]);

    useEffect(() => {
        loadData();
    }, []);
    
    

    const loadData = async () => {

        try {

        const [
            courseData,
            chapterData,
            studentData,
        ] = await Promise.all([
            getCourseDetails(courseId),
            getCourseChapters(courseId),
            getCourseEnrollments(courseId),
        ]);

        setCourse(courseData);

        setChapters(chapterData);

        setStudents(studentData);

        setCourseForm({
            title: courseData.title,
            description:
            courseData.description,
            status:
            courseData.status,
        });

        if (
            chapterData.length > 0
        ) {
            setSelectedChapter(
            chapterData[0]
            );
        }

        } catch (error) {
        console.error(error);
        }
    };

    const handleSaveCourse =
        async () => {

        try {

            const updatedCourse =
            await updateCourse(
                course.id,
                {
                title:
                    courseForm.title,
                description:
                    courseForm.description,
                status:
                    courseForm.status,
                }
            );

            setCourse(
            updatedCourse
            );

            setEditingCourse(
            false
            );

        } catch (error) {
            console.error(error);
        }
        };

    const handleCancelEdit =
        () => {

        setCourseForm({
            title:
            course.title,
            description:
            course.description,
            status:
            course.status,
        });

        setEditingCourse(
            false
        );
        };

    const handleCreateChapter =
    async () => {

        try {

            const newChapter =
                await createChapter({
                    course: Number(
                        courseId
                    ),
                    title:
                        createChapterForm.title,
                    // content: [],
                    position:
                        createChapterForm.position,
                    status:
                        createChapterForm.status,
                });

            setChapters(
                [
                    ...chapters,
                    newChapter,
                ]
            );

            setSelectedChapter(
                newChapter
            );

            setShowCreateModal(
                false
            );

            setCreateChapterForm({
                title: "",
                position:
                    chapters.length + 2,
                status:
                    "DRAFT",
            });

        } catch (error) {

            console.error(error);

        }
    };

    const handleSaveChapter =
        async () => {

            try {

                const updatedChapter =
                    await updateChapter(
                        selectedChapter.id,
                        {
                            course:
                                selectedChapter.course,
                            title:
                                chapterForm.title,
                            content:
                                chapterForm.content,
                            position:
                                selectedChapter.position,
                            status:
                                chapterForm.status,
                        }
                    );

                setChapters(
                    chapters.map(
                        (chapter) =>
                            chapter.id ===
                            updatedChapter.id
                                ? updatedChapter
                                : chapter
                    )
                );

                setSelectedChapter(
                    updatedChapter
                );

            } catch (error) {

                console.error(error);

            }
        };

        const handleDeleteChapter =
            async () => {

                if (
                    !window.confirm(
                        "Delete chapter?"
                    )
                ) {
                    return;
                }

                try {

                    await deleteChapter(
                        selectedChapter.id
                    );

                    const remaining =
                        chapters.filter(
                            (chapter) =>
                                chapter.id !==
                                selectedChapter.id
                        );

                    setChapters(
                        remaining
                    );

                    setSelectedChapter(
                        remaining[0] ||
                        null
                    );

                } catch (error) {

                    console.error(error);

                }
            };

    if (!course) {
        return (
        <div className="h-screen flex items-center justify-center">
            Loading...
        </div>
        );
    }

    return (

        <div className="h-screen bg-slate-950 flex">

        {/* LEFT SIDEBAR */}

        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">

            <div className="p-5 border-b bg-slate-950">

            <button
                onClick={() =>
                navigate(
                    "/my-courses"
                )
                }
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 text-white"
            >
                <ArrowLeft size={16} />
                My Courses
            </button>

            

            <button
                onClick={() =>
                    setShowCreateModal(
                        true
                    )
                }
                className="w-full mt-5 bg-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-xl"
            >
                + Add Chapter
            </button>

            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950">

            <ChapterSidebar
                chapters={chapters}
                selectedChapter={
                selectedChapter
                }
                setSelectedChapter={
                setSelectedChapter
                }
            />

            </div>

        </div>

        {/* CENTER */}

        <div className="flex-1 p-5 overflow-y-auto">

            <div className="bg-slate-900 border border-slate-200 rounded-2xl h-full">

            <div className="p-6">

                {selectedChapter && (

                    <>

                        <div className="flex justify-between items-center mb-6">

                            <input
                                value={
                                    chapterForm.title
                                }
                                onChange={(e) =>
                                    setChapterForm({
                                        ...chapterForm,
                                        title:
                                            e.target.value,
                                    })
                                }
                                className="text-2xl font-semibold border-none outline-none w-full text-white"
                            />

                            <div className="flex gap-3">

                                <select
                                    value={
                                        chapterForm.status
                                    }
                                    onChange={(e) =>
                                        setChapterForm({
                                            ...chapterForm,
                                            status:
                                                e.target.value,
                                        })
                                    }
                                    className="border rounded-lg px-3 py-2"
                                >
                                    <option value="DRAFT">
                                        Draft
                                    </option>

                                    <option value="PUBLISHED">
                                        Published
                                    </option>

                                </select>

                                <button
                                    onClick={
                                        handleSaveChapter
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={
                                        handleDeleteChapter
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                        <ChapterEditor
                            key={selectedChapter?.id}
                            chapterForm={chapterForm}
                            setChapterForm={setChapterForm}
                        />

                    </>

                )}

            </div>

            </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="w-80 bg-slate-950 border-l border-slate-200 flex flex-col">

            <div className="p-5 border-b bg-slate-950 border-slate-800">

            <div className="text-lg font-semibold text-white">
                Course Details
            </div>

            </div>

        {!editingCourse ? (

                <>

                <div className="m-4 flex justify-between items-start text-white bg-slate-950">

                    <div>

                    <div className="mt-4 text-center text-2xl font-semibold text-white">
                        {course.title}
                    </div>

                    <div className="text-sm text-left text-white">
                        {course.description}
                    </div>

                    </div>

                    <button
                    onClick={() =>
                        setEditingCourse(
                        true
                        )
                    }
                    className="text-slate-500 hover:text-indigo-600"
                    >
                    <Pencil size={18} />
                    </button>

                </div>

                </>

            ) : (

                <div className="m-4 space-y-3">

                <input
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
                    className="w-full border rounded-lg px-3 py-2"
                />

                <textarea
                    rows={3}
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
                    className="w-full border rounded-lg px-3 py-2"
                />

                <div className="flex items-center justify-between">

                    <span className="text-sm font-medium">
                    Published
                    </span>

                    <button
                    onClick={() =>
                        setCourseForm({
                        ...courseForm,
                        status:
                            courseForm.status ===
                            "PUBLISHED"
                            ? "DRAFT"
                            : "PUBLISHED",  
                        })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        courseForm.status ===
                        "PUBLISHED"
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                    >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        courseForm.status ===
                        "PUBLISHED"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                    />
                    </button>

                </div>

                <div className="flex gap-2">

                    <button
                    onClick={
                        handleSaveCourse
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex justify-center"
                    >
                    <Check size={18} />
                    </button>

                    <button
                    onClick={
                        handleCancelEdit
                    }
                    className="flex-1 bg-slate-200 py-2 rounded-lg flex justify-center"
                    >
                    <X size={18} />
                    </button>

                </div>

                </div>

            )}

            <div className="p-5 space-y-4 bg-slate-950">

            <div className="border rounded-xl p-4 bg-slate-900 border-slate-800">

                <div className="flex items-center gap-2 text-sm text-white mb-2">
                <BookOpen size={16} />
                Chapters
                </div>

                <p className="text-2xl font-semibold text-white">
                {chapters.length}
                </p>

            </div>

            <div className="border rounded-xl p-4 bg-slate-900 border-slate-800">

                <div className="flex items-center gap-2 text-sm text-white mb-2">
                <Users size={16} />
                Students
                </div>

                <p className="text-2xl font-semibold text-white">
                {students.length}
                </p>

            </div>

            <div className="border rounded-xl p-4 bg-slate-900 border-slate-800">

                <p className="text-sm text-white mb-2">
                Status
                </p>

                <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status ===
                    "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                >
                {course.status}
                </span>

            </div>

            </div>

            <div className="border-t px-5 py-4">

            <div className="text-lg font-semibold text-white">
                Students
            </div>

            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-slate-950">

            <StudentSidebar
                students={students}
            />

            </div>

        </div>
                
                {
                showCreateModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl p-6 w-[450px]">

                        <div className="text-xl font-semibold mb-5">
                            Create Chapter
                        </div>

                        <div className="space-y-4">

                            <input
                                placeholder="Chapter Title"
                                value={
                                    createChapterForm.title
                                }
                                onChange={(e) =>
                                    setCreateChapterForm({
                                        ...createChapterForm,
                                        title:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                value={
                                    createChapterForm.position
                                }
                                onChange={(e) =>
                                    setCreateChapterForm({
                                        ...createChapterForm,
                                        position:
                                            Number(
                                                e.target.value
                                            ),
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <select
                                value={
                                    createChapterForm.status
                                }
                                onChange={(e) =>
                                    setCreateChapterForm({
                                        ...createChapterForm,
                                        status:
                                            e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="DRAFT">
                                    Draft
                                </option>

                                <option value="PUBLISHED">
                                    Published
                                </option>

                            </select>

                        </div>

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={
                                    handleCreateChapter
                                }
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                            >
                                Create
                            </button>

                            <button
                                onClick={() =>
                                    setShowCreateModal(
                                        false
                                    )
                                }
                                className="flex-1 bg-slate-200 py-2 rounded-lg"
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

export default CourseEditorPage;