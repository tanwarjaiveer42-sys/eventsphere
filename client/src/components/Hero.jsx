function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 via-white to-indigo-50 text-center px-6">
      <div className="mb-6 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
    🚀 AI Powered College Event Management Platform
</div><h1 className="text-6xl md:text-7xl font-extrabold text-blue-700">
        EventSphere AI
      </h1>

      <p className="text-2xl mt-6 text-gray-700">
        Smarter Events. Stronger Campus.
      </p>

      <p className="mt-4 max-w-2xl text-gray-500">
        Manage registrations, QR attendance, AI assistance,
        certificates and analytics from one intelligent platform.
      </p>

     <div className="mt-10 flex gap-5 flex-wrap justify-center">
  <button className="bg-blue-600 hover:bg-blue-700 transition duration-300 px-8 py-4 rounded-xl text-white font-semibold shadow-lg">
    Get Started
  </button>

  <button className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 px-8 py-4 rounded-xl text-blue-600 font-semibold">
    Explore Events
  </button>
</div>
    </section>
  );
}

export default Hero;