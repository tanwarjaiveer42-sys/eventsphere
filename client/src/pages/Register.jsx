import React, { useState } from "react";
import { registerUser } from "../services/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await registerUser({ name, email, password });

            alert("Registered successfully");
            window.location.href = "/login";

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Register</button>
        </form>
    );
};

export default Register;