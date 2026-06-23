function Stats() {
  return (
    <section className="bg-blue-700 text-white py-20">

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

        <div>
          <h2 className="text-5xl font-bold">100+</h2>
          <p className="mt-2">Events Hosted</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">5000+</h2>
          <p className="mt-2">Students</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">50+</h2>
          <p className="mt-2">Organizers</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">95%</h2>
          <p className="mt-2">Attendance Accuracy</p>
        </div>

      </div>

    </section>
  );
}

export default Stats;