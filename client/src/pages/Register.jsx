import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await registerUser({
                name,
                email,
                password,
                role,
            });

            alert("Registered successfully");
            window.location.href = "/login";

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-10">
            <div className="w-full max-w-md">

                <div className="overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl shadow-violet-200/40 ring-1 ring-white/60">
                    <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-400" />

                    <div className="p-8 sm:p-10">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl mb-5 shadow-lg shadow-violet-300/50">
                            ✨
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="text-slate-500 mt-2 mb-8">
                            Join EventSphere AI to get started
                        </p>

                        <form onSubmit={handleRegister} className="space-y-4">

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                                    I am a
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Organizer">Organizer</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:shadow-violet-400/60 hover:-translate-y-0.5 mt-2"
                            >
                                Create account
                            </button>

                            <p className="text-center text-slate-500 text-sm pt-1">
                                Already have an account?
                                <Link
                                    to="/login"
                                    className="text-violet-600 font-semibold ml-1.5 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;