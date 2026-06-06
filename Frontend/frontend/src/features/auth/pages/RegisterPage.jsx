import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { register } from "../api/authApi";

const RegisterPage = () => {

    const { role } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

        await register({
            ...formData,
            role: role.toUpperCase(),
        });

        navigate("/login");

        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

            <h3 className="text-2xl font-bold text-center mb-8">
            Register as {role?.toUpperCase()}
            </h3>

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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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
                Register
            </button>

            </form>

        </div>

        </div>
    );
};

export default RegisterPage;