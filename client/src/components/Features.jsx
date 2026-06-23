import { CalendarDays, QrCode, Bot, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <CalendarDays size={40} className="text-blue-600" />,
    title: "Event Management",
    description:
      "Create, edit and manage college events with an intuitive dashboard.",
  },
  {
    icon: <QrCode size={40} className="text-blue-600" />,
    title: "QR Attendance",
    description:
      "Generate QR codes for every event and record attendance instantly.",
  },
  {
    icon: <Bot size={40} className="text-blue-600" />,
    title: "AI Assistant",
    description:
      "Generate event descriptions, answer FAQs and help organizers.",
  },
  {
    icon: <BarChart3 size={40} className="text-blue-600" />,
    title: "Analytics",
    description:
      "Track registrations, attendance and event performance in real time.",
  },
];

function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Powerful Features
        </h2>

        <p className="text-gray-500 text-center mt-4">
          Everything you need to organize successful college events.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              {feature.icon}

              <h3 className="text-xl font-bold mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-500 mt-3">
                {feature.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;