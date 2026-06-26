import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import API from "../services/api";

const TOOLS = [
  {
    id: "chat",
    icon: "💬",
    label: "AI Chat",
    description: "Ask anything about event management",
    color: "border-blue-400 bg-blue-50",
    accent: "text-blue-600",
  },
  {
    id: "description",
    icon: "✍️",
    label: "Description Generator",
    description: "Generate compelling event descriptions",
    color: "border-purple-400 bg-purple-50",
    accent: "text-purple-600",
  },
  {
    id: "budget",
    icon: "💰",
    label: "Budget Planner",
    description: "Get itemized budget breakdowns",
    color: "border-green-400 bg-green-50",
    accent: "text-green-600",
  },
  {
    id: "promotion",
    icon: "📣",
    label: "Promotion Ideas",
    description: "Social media & campus strategies",
    color: "border-orange-400 bg-orange-50",
    accent: "text-orange-600",
  },
  {
    id: "plan",
    icon: "📋",
    label: "Event Planner",
    description: "Full day-of schedule & checklists",
    color: "border-rose-400 bg-rose-50",
    accent: "text-rose-600",
  },
];

const STARTERS = [
  "How do I manage event registrations effectively?",
  "What are good icebreaker activities for 100 students?",
  "How do I handle no-shows at my event?",
  "Tips for running a smooth panel discussion?",
];

// ─────────────────────────────────────────────────────────────────
// ALL COMPONENTS DEFINED HERE — AT MODULE SCOPE
// Outside AIAssistant entirely. Stable references. Never recreated.
// ─────────────────────────────────────────────────────────────────

const ResultPanel = ({ result }) => (
  <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
      <span className="text-sm font-semibold text-gray-600">✨ AI Response</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(result);
          alert("Copied to clipboard!");
        }}
        className="text-xs text-blue-600 hover:underline"
      >
        Copy
      </button>
    </div>
    <div className="p-5 prose prose-sm max-w-none text-gray-700 leading-relaxed">
      <ReactMarkdown>{result}</ReactMarkdown>
    </div>
  </div>
);

const ChatTool = ({ messages, input, setInput, loading, sendMessage, messagesEndRef, inputRef }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1"
        style={{ maxHeight: "420px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.role === "model" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">
              AI
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {STARTERS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-left text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-600 hover:bg-blue-50 hover:border-blue-300 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about events..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1.5 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

const DescriptionTool = ({ descForm, setDescForm, loading, submitTool, toolResult }) => (
  <div className="space-y-4">
    <p className="text-gray-500 text-sm">
      Fill in your event details and get a polished description instantly.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { key: "title", label: "Event Title *", placeholder: "Tech Fest 2025" },
        { key: "category", label: "Category", placeholder: "Technical / Cultural / Sports" },
        { key: "date", label: "Event Date", placeholder: "2025-12-15", type: "date" },
        { key: "venue", label: "Venue", placeholder: "College Auditorium" },
        { key: "maxParticipants", label: "Max Participants", placeholder: "200", type: "number" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
          <input
            type={type || "text"}
            value={descForm[key]}
            onChange={(e) => setDescForm({ ...descForm, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      ))}
    </div>
    <button
      onClick={() => submitTool("generate-description", descForm, "description")}
      disabled={loading || !descForm.title.trim()}
      className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Generating..." : "✍️ Generate Description"}
    </button>
    {toolResult && <ResultPanel result={toolResult} />}
  </div>
);

const BudgetTool = ({ budgetForm, setBudgetForm, loading, submitTool, toolResult }) => (
  <div className="space-y-4">
    <p className="text-gray-500 text-sm">
      Get a realistic, itemized budget breakdown for your event.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { key: "eventType", label: "Event Type *", placeholder: "Hackathon / Cultural Fest / Workshop" },
        { key: "participants", label: "Expected Participants", placeholder: "150", type: "number" },
        { key: "duration", label: "Duration", placeholder: "1 day / 2 days" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
          <input
            type={type || "text"}
            value={budgetForm[key]}
            onChange={(e) => setBudgetForm({ ...budgetForm, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      ))}
    </div>
    <button
      onClick={() => submitTool("budget-suggestions", budgetForm, "budget")}
      disabled={loading || !budgetForm.eventType.trim()}
      className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Calculating..." : "💰 Generate Budget"}
    </button>
    {toolResult && <ResultPanel result={toolResult} />}
  </div>
);

const PromotionTool = ({ promoForm, setPromoForm, loading, submitTool, toolResult }) => (
  <div className="space-y-4">
    <p className="text-gray-500 text-sm">
      Get a full promotion strategy with social media captions and timelines.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { key: "eventTitle", label: "Event Title *", placeholder: "Annual Tech Fest" },
        { key: "targetAudience", label: "Target Audience", placeholder: "Engineering students" },
        { key: "eventDate", label: "Event Date", placeholder: "2025-12-20", type: "date" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
          <input
            type={type || "text"}
            value={promoForm[key]}
            onChange={(e) => setPromoForm({ ...promoForm, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      ))}
    </div>
    <button
      onClick={() => submitTool("promotion-ideas", promoForm, "ideas")}
      disabled={loading || !promoForm.eventTitle.trim()}
      className="bg-orange-500 text-white px-6 py-2.5 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Generating..." : "📣 Get Promotion Ideas"}
    </button>
    {toolResult && <ResultPanel result={toolResult} />}
  </div>
);

const PlanTool = ({ planForm, setPlanForm, loading, submitTool, toolResult }) => (
  <div className="space-y-4">
    <p className="text-gray-500 text-sm">
      Get a complete event plan with schedules, checklists, and team roles.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { key: "eventType", label: "Event Type *", placeholder: "Hackathon / Seminar / Sports Meet" },
        { key: "theme", label: "Theme", placeholder: "Innovation / Sustainability / Culture" },
        { key: "participants", label: "Expected Participants", placeholder: "200", type: "number" },
        { key: "duration", label: "Duration", placeholder: "2 days" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
          <input
            type={type || "text"}
            value={planForm[key]}
            onChange={(e) => setPlanForm({ ...planForm, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      ))}
    </div>
    <button
      onClick={() => submitTool("event-plan", planForm, "plan")}
      disabled={loading || !planForm.eventType.trim()}
      className="bg-rose-600 text-white px-6 py-2.5 rounded-xl hover:bg-rose-700 transition disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Planning..." : "📋 Generate Event Plan"}
    </button>
    {toolResult && <ResultPanel result={toolResult} />}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// Only state, logic, and layout live here.
// No component definitions inside this function.
// ─────────────────────────────────────────────────────────────────

export default function AIAssistant() {
  const [activeTool, setActiveTool] = useState("chat");
  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Hi! I'm your **EventSphere AI Assistant** 🎓\n\nI can help you plan events, write descriptions, suggest budgets, and more. What would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [descForm, setDescForm] = useState({
    title: "",
    category: "",
    date: "",
    venue: "",
    maxParticipants: "",
  });
  const [budgetForm, setBudgetForm] = useState({
    eventType: "",
    participants: "",
    duration: "",
  });
  const [promoForm, setPromoForm] = useState({
    eventTitle: "",
    targetAudience: "",
    eventDate: "",
  });
  const [planForm, setPlanForm] = useState({
    eventType: "",
    theme: "",
    participants: "",
    duration: "",
  });
  const [toolResult, setToolResult] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setToolResult("");
    setError("");
    if (activeTool === "chat") inputRef.current?.focus();
  }, [activeTool]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await API.post(
        "/ai/chat",
        { message: userMessage, history },
        getAuthHeader()
      );

      setMessages((prev) => [...prev, { role: "model", content: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "AI service unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitTool = async (endpoint, payload, resultKey) => {
    setLoading(true);
    setError("");
    setToolResult("");
    try {
      const res = await API.post(`/ai/${endpoint}`, payload, getAuthHeader());
      setToolResult(res.data[resultKey]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get AI response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeMeta = TOOLS.find((t) => t.id === activeTool);

  // Props passed down — no components defined here
  const toolComponents = {
    chat: (
      <ChatTool
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        sendMessage={sendMessage}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />
    ),
    description: (
      <DescriptionTool
        descForm={descForm}
        setDescForm={setDescForm}
        loading={loading}
        submitTool={submitTool}
        toolResult={toolResult}
      />
    ),
    budget: (
      <BudgetTool
        budgetForm={budgetForm}
        setBudgetForm={setBudgetForm}
        loading={loading}
        submitTool={submitTool}
        toolResult={toolResult}
      />
    ),
    promotion: (
      <PromotionTool
        promoForm={promoForm}
        setPromoForm={setPromoForm}
        loading={loading}
        submitTool={submitTool}
        toolResult={toolResult}
      />
    ),
    plan: (
      <PlanTool
        planForm={planForm}
        setPlanForm={setPlanForm}
        loading={loading}
        submitTool={submitTool}
        toolResult={toolResult}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Powered by Google Gemini
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            EventSphere <span className="text-blue-600">AI Assistant</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Your intelligent partner for planning, writing, and promoting college events.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setToolResult("");
                setError("");
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                activeTool === tool.id
                  ? tool.color + " shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{tool.icon}</div>
              <div
                className={`text-xs font-bold ${
                  activeTool === tool.id ? tool.accent : "text-gray-700"
                }`}
              >
                {tool.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 hidden sm:block leading-tight">
                {tool.description}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <span className="text-2xl">{activeMeta.icon}</span>
            <div>
              <h2 className={`text-lg font-bold ${activeMeta.accent}`}>
                {activeMeta.label}
              </h2>
              <p className="text-xs text-gray-400">{activeMeta.description}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              ❌ {error}
            </div>
          )}

          {toolComponents[activeTool]}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          AI responses are suggestions only. Always review before publishing event details.
        </p>
      </div>
    </div>
  );
}