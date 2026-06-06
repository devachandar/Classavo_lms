import api from "../../../api/axios";

export const getCourseDetails = async (
    courseId
    ) => {
    const response = await api.get(
        `/courses/${courseId}/`
    );

    return response.data;
    };

    export const getCourseChapters = async (
    courseId
    ) => {
    const response = await api.get(
        `/courses/chapters/?course_id=${courseId}`
    );

    return response.data;
    };

    export const createChapter = async (
    payload
    ) => {
    const response = await api.post(
        "/courses/chapters/",
        payload
    );

    return response.data;
    };

    export const updateChapter = async (
        chapterId,
        payload
        ) => {
        const response = await api.put(
            `/courses/chapters/${chapterId}/`,
            payload
        );

        return response.data;
    };

    export const deleteChapter = async (
        chapterId
    ) => {

        await api.delete(
            `/courses/chapters/${chapterId}/`
        );
    };

    export const completeChapter =
    async (chapterId) => {

        const response =
            await api.post(
                `/courses/chapters/${chapterId}/complete/`
            );

        return response.data;
    };

    
