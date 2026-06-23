import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Sign in to your EventSphere AI account
        </p>

        <form className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <FaLock className="absolute left-3 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

          </div>

          {/* Role */}

          <div>

            <label className="block mb-2 font-medium">
              Login As
            </label>

            <select
              className="w-full border rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Student</option>
              <option>Organizer</option>
              <option>Faculty</option>
            </select>

          </div>

          {/* Remember */}

          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember Me

            </label>

            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Button */}

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-center">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 ml-2 font-semibold"
            >
              Register
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;