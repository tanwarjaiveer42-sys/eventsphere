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
      });
      console.log(res.data.user);
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

        <div className="mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl mb-5 shadow-lg shadow-violet-300/50">
            👋
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 mt-2">
            Login to continue to EventSphere AI
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-600">
              Email address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 pl-12 pr-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-600">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 pl-12 pr-12 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
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

          {/* Remember */}
          <div className="flex justify-between items-center pt-1">
            <label className="flex gap-2 items-center text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-300"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-violet-600 hover:text-violet-700 hover:underline text-sm font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:shadow-violet-400/60 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-slate-500 text-sm pt-1">
            Don't have an account?
            <Link
              to="/register"
              className="text-violet-600 font-semibold ml-1.5 hover:underline"
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