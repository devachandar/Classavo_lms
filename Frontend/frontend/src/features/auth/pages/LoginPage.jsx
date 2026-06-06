import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        setError("");

        const user = await login(formData);

        if (user.role === "INSTRUCTOR") {
            navigate("/my-courses");
        } else {
            navigate("/student/courses");
        }
        } catch (error) {
        console.error(error);
        setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

            <h1 className="text-3xl font-bold text-center mb-2">
            LMS Platform
            </h1>

            <p className="text-center text-slate-500 mb-8">
            Learn. Teach. Grow.
            </p>

            <form
            onSubmit={handleSubmit}
            className="space-y-5"
            >

            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 text-white py-3"
            >
                Login
            </button>

            {error && (
                <p className="text-red-500 text-sm">
                {error}
                </p>
            )}

            </form>

            <div className="mt-8 space-y-3">

            <Link
                to="/register/student"
                className="block text-center border rounded-xl py-3"
            >
                Register as Student
            </Link>

            <Link
                to="/register/instructor"
                className="block text-center border rounded-xl py-3"
            >
                Register as Instructor
            </Link>

            </div>

        </div>

        </div>
    );
};

export default LoginPage;