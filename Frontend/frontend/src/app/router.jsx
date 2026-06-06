import {
    createBrowserRouter,
    } from "react-router-dom";

    import LoginPage from "../features/auth/pages/LoginPage";

    // import CourseListPage from "../features/courses/pages/StudentCoursePage";

    import MyCoursesPage from "../features/courses/pages/MyCoursePage";

    import ProtectedRoute from "../routes/ProtectedRoute";
    import RegisterPage from "../features/auth/pages/RegisterPage";
    import CourseEditorPage from "../features/chapters/pages/CourseEditorPage";

    import StudentCoursesPage from "../features/courses/pages/StudentCoursePage";
    import StudentLearningPage from "../features/courses/pages/StudentLearningPage";

    export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
    path: "/register/:role",
    element: <RegisterPage />,
    },


    {
        path: "/my-courses",
        element: (
        <ProtectedRoute>
            <MyCoursesPage />
        </ProtectedRoute>
        ),
    },
    {
        path: "/my-courses/:courseId",
        element: (
            <ProtectedRoute>
            <CourseEditorPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/student/courses",
        element: <StudentCoursesPage />,
    },
    {
    path:
        "/student/course/:courseId",

    element: <StudentLearningPage />,
}
]);