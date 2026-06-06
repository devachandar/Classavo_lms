import api from "../../../api/axios";

export const getMyCourses = async () => {
    const response = await api.get(
        "/courses/my-courses/"
    );

    return response.data;
    };

    export const getDashboardStats = async () => {
    const response = await api.get(
        "/courses/dashboard/"
    );

    return response.data;
    };

    export const createCourse = async (
    payload
    ) => {
    const response = await api.post(
        "/courses/",
        payload
    );

    return response.data;
    };

    export const updateCourse = async (
    courseId,
    payload
    ) => {
    const response = await api.put(
        `/courses/${courseId}/`,
        payload
    );

    return response.data;
    };

    export const deleteCourse = async (
    courseId
    ) => {
    await api.delete(
        `/courses/${courseId}/`
    );
    };

    export const getCourseDetails = async (
    courseId
    ) => {
    const response = await api.get(
        `/courses/${courseId}/`
    );

    return response.data;
};


    export const getCourseEnrollments =
    async (courseId) => {

        const response =
        await api.get(
            `/courses/${courseId}/enrollments/`
        );

        return response.data;
    };

    export const getCourses =
    async () => {

        const response =
            await api.get(
                "/courses/"
            );

        return response.data;
    };

    // export const enrollCourse =
    // async (courseId) => {

    //     const response =
    //         await api.post(
    //             "/courses/enroll/",
    //             {
    //                 course_id:
    //                     courseId,
    //             }
    //         );

    //     return response.data;
    // };

    export const getMyEnrollments =
    async () => {

        const response =
            await api.get(
                "/courses/enrollments/"
            );

        return response.data;
    };

    export const getCourseChapters =
    async (courseId) => {

        const response =
            await api.get(
                `/courses/${courseId}/chapters/`
            );

        return response.data;
    };

    export const getProgress =
    async () => {

        const response =
            await api.get(
                "/progress/"
            );

        return response.data;
    };

    export const markChapterComplete =
    async (chapterId) => {

        const response =
            await api.post(
                "/progress/",
                {
                    chapter: chapterId,
                    status: "COMPLETED",
                }
            );

        return response.data;
    };

    export const getStudentCourseChapters =
        async (courseId) => {

            const response =
                await api.get(
                    `/courses/chapters/?course_id=${courseId}`
                );

            return response.data;
        };

    export const getCourseProgress =
    async (courseId) => {

        const response =
            await api.get(
                `/courses/${courseId}/progress_summary/`
            );

        return response.data;
    };

    export const getCompletedChapters =
        async (courseId) => {

            const response =
                await api.get(
                    `/courses/${courseId}/completed_chapters/`
                );

            return response.data;
        };

    export const enrollCourse =
        async (courseId) => {

            const response =
                await api.post(
                    `/courses/${courseId}/join/`
                );

            return response.data;
        };