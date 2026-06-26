import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import AuthLayout from "../components/AuthLayout";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  document.title = "Login | EventSphere";
}, []);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await API.post("/auth/login", {
      email,
      password,
    });console.log(res.data.user);
    console.log("LOGIN RESPONSE:", res.data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    

   if (res.data.user.role === "Student") {
    navigate("/student-dashboard");
}
else if (res.data.user.role === "Organizer") {
    navigate("/organizer-dashboard");
}
else if (res.data.user.role === "Admin") {
    navigate("/admin-dashboard");
}

  } catch (err) {
    
    alert(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-700">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-2 mb-8">
          Login to continue to EventSphere AI
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}

          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
               type="email"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-4 text-gray-400" />

             <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl pl-12 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

              <button
                type="button"
                className="absolute right-4 top-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Role */}

        

          {/* Remember */}

          <div className="flex justify-between items-center">

            <label className="flex gap-2 items-center text-sm">

              <input type="checkbox" />

              Remember Me

            </label>

            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button
  
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2"
            >
              Register
            </Link>

          </p>

        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;