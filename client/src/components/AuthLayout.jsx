function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-blue-600 text-white p-12 flex flex-col justify-center">
          <div className="bg-white/20 w-fit px-4 py-2 rounded-full font-semibold mb-6">
            🚀 AI Powered Platform
          </div>

          <h1 className="text-5xl font-extrabold">
            EventSphere AI
          </h1>

          <p className="mt-5 text-blue-100 text-lg">
            Smarter Events. Stronger Campus.
          </p>

          <div className="mt-10 space-y-4 text-lg">
            <p>✅ QR Attendance</p>
            <p>✅ AI Event Assistant</p>
            <p>✅ Certificate Generation</p>
            <p>✅ Analytics Dashboard</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 flex items-center justify-center">
          {children}
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;