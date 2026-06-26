// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";



// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const fmt = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";
       

// ─────────────────────────────────────────────────────────────────
// StatCard — used in Overview tab
// ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, gradient }) => (
    <div className={`rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
        <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">{icon}</span>
            <span className="text-4xl font-bold">{value ?? "—"}</span>
        </div>
        <p className="text-sm font-medium opacity-90">{label}</p>
    </div>
);

// ─────────────────────────────────────────────────────────────────
// Pill — role badge
// ─────────────────────────────────────────────────────────────────
const RolePill = ({ role }) => {
    const map = {
        Admin: "bg-rose-100 text-rose-700",
        Organizer: "bg-indigo-100 text-indigo-700",
        Student: "bg-emerald-100 text-emerald-700",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[role] || "bg-gray-100 text-gray-600"}`}>
            {role || "—"}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────
// DeleteButton — shared confirm-then-delete button
// ─────────────────────────────────────────────────────────────────
const DeleteButton = ({ onConfirm, label = "Delete" }) => {
    const [confirming, setConfirming] = useState(false);

    if (confirming) {
        return (
            <span className="flex items-center gap-1">
                <button
                    onClick={() => { onConfirm(); setConfirming(false); }}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition"
                >
                    Confirm
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition font-medium"
        >
            {label}
        </button>
    );
};

// ─────────────────────────────────────────────────────────────────
// RegistrationsModal — shown when organizer clicks View Registrations
// ─────────────────────────────────────────────────────────────────
const RegistrationsModal = ({ eventId, eventTitle, onClose }) => {
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get(`/admin/events/${eventId}/registrations`, authHeader());
                setRegs(res.data.registrations || []);
            } catch {
                setRegs([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [eventId]);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Registrations</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{eventTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : regs.length === 0 ? (
                        <p className="text-center text-gray-400 py-12">No registrations yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    {["Name", "Email", "Role", "Attended"].map((h) => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {regs.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {r.userID?.name || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">{r.userID?.email || "—"}</td>
                                        <td className="px-5 py-3">
                                            <RolePill role={r.userID?.role} />
                                        </td>
                                        <td className="px-5 py-3">
                                            {r.attended ? (
                                                <span className="text-emerald-600 font-semibold">✅ Yes</span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs text-gray-400">{regs.length} registration{regs.length !== 1 ? "s" : ""}</p>
                    <button
                        onClick={onClose}
                        className="text-sm bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────
// Tab components — defined at module scope (no focus-loss bug)
// ─────────────────────────────────────────────────────────────────

// Overview Tab
const OverviewTab = ({ stats, aiInsights }) => (
    <div className="space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon="👥"
                label="Total Users"
                value={stats?.totalUsers}
                gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            />
            <StatCard
                icon="🗓️"
                label="Total Events"
                value={stats?.totalEvents}
                gradient="bg-gradient-to-br from-violet-500 to-violet-700"
            />
            <StatCard
                icon="📋"
                label="Registrations"
                value={stats?.totalRegistrations}
                gradient="bg-gradient-to-br from-sky-500 to-sky-700"
            />
            <StatCard
                icon="✅"
                label="Attendance"
                value={stats?.totalAttendance}
                gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
        </div>

        {/* Analytics summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
                {
                    label: "Certificates Issued",
                    value: stats?.totalAttendance ?? 0,
                    icon: "🏆",
                    desc: "One certificate per attended event",
                },
                {
                    label: "Attendance Rate",
                    value:
                        stats?.totalRegistrations > 0
                            ? `${Math.round((stats.totalAttendance / stats.totalRegistrations) * 100)}%`
                            : "0%",
                    icon: "📈",
                    desc: "Across all events",
                },
                {
                    label: "Avg. per Event",
                    value:
                        stats?.totalEvents > 0
                            ? Math.round(stats.totalRegistrations / stats.totalEvents)
                            : 0,
                    icon: "📊",
                    desc: "Registrations per event",
                },
            ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{card.icon}</span>
                        <p className="text-sm font-semibold text-gray-500">{card.label}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
                </div>
            ))}
        </div>

        {/* AI Insights card */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg shrink-0">
                    🤖
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-indigo-900">AI Insights</h3>
                        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            Gemini
                        </span>
                    </div>
                    <div className="space-y-1.5">
                        {aiInsights.map((insight, i) => (
                            <p key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                                <span className="text-indigo-400 mt-0.5">▸</span>
                                {insight}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Users Tab
const UsersTab = ({ users, search, setSearch, onDelete }) => {
    const filtered = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <p className="text-sm text-gray-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-12">
                                        {search ? "No users match your search." : "No users found."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                                                    {user.name?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                                        <td className="px-5 py-3.5">
                                            <RolePill role={user.role} />
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                                            {fmt(user.createdAt)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <DeleteButton
                                                label="Delete"
                                                onConfirm={() => onDelete(user._id, user.name)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Events Tab
const EventsTab = ({ events, onDelete, onViewRegs }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">
                {events.length} event{events.length !== 1 ? "s" : ""} total
            </p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        {["Title", "Organizer", "Category", "Date", "Venue", "Actions"].map((h) => (
                            <th
                                key={h}
                                className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-gray-400 py-12">
                                No events found.
                            </td>
                        </tr>
                    ) : (
                        events.map((ev) => (
                            <tr key={ev._id} className="hover:bg-gray-50 transition">
                                <td className="px-5 py-3.5 font-medium text-gray-800 max-w-[180px] truncate">
                                    {ev.title}
                                </td>
                                <td className="px-5 py-3.5 text-gray-500">
                                    {ev.createdBy?.name || "—"}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                                        {ev.category || "General"}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                                    {fmt(ev.date)}
                                </td>
                                <td className="px-5 py-3.5 text-gray-500 max-w-[140px] truncate">
                                    {ev.venue}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewRegs(ev._id, ev.title)}
                                            className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-100 transition font-medium whitespace-nowrap"
                                        >
                                            View Regs
                                        </button>
                                        <DeleteButton
                                            label="Delete"
                                            onConfirm={() => onDelete(ev._id, ev.title)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
const TABS = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "events", label: "Events", icon: "🗓️" },
];

const AI_INSIGHTS = [
    "Most registrations this month came from Technical category events.",
    "Attendance rate has improved by 12% compared to last month.",
    "Students are registering most on weekday evenings between 6–9 PM.",
    "Events with detailed descriptions get 40% more registrations on average.",
];

export default function AdminDashboard() {
  
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [modal, setModal] = useState(null); // { eventId, eventTitle }
     const navigate = useNavigate();   // ✅ inside component

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    

    return (
        <>
            
        </>
    );
}

    // Load all data on mount
    useEffect(() => {
        loadAll();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    const loadAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [statsRes, usersRes, eventsRes] = await Promise.all([
                API.get("/admin/stats", authHeader()),
                API.get("/admin/users", authHeader()),
                API.get("/admin/events", authHeader()),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            setError(
                err.response?.status === 403
                    ? "Access denied. Admin role required."
                    : err.response?.data?.message || "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id, name) => {
        try {
            await API.delete(`/admin/users/${id}`, authHeader());
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            setToast(`✅ User "${name}" deleted.`);
        } catch (err) {
            setToast(`❌ ${err.response?.data?.message || "Delete failed."}`);
        }
    };

    const handleDeleteEvent = async (id, title) => {
        try {
            await API.delete(`/admin/events/${id}`, authHeader());
            setEvents((prev) => prev.filter((e) => e._id !== id));
            setStats((prev) => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
            setToast(`✅ Event "${title}" deleted.`);
        } catch (err) {
            setToast(`❌ ${err.response?.data?.message || "Delete failed."}`);
        }
    };

    // ── Render ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
                    <p className="text-5xl mb-4">🔒</p>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }
     

    return (
      
        <div className="min-h-screen bg-gray-50">

            {/* Gradient header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
                            EventSphere AI
                        </p>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                       
                        <p className="text-indigo-200 text-sm mt-1">
                            Full platform control — {stats?.totalUsers} users · {stats?.totalEvents} events
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-indigo-200 text-xs">Signed in as</p>
                            <p className="text-white text-sm font-semibold">Administrator</p>
                            
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">
                            🛡️
                        </div><button
  onClick={handleLogout}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
>
  🚪 Logout
</button>
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-gray-200 bg-white px-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex gap-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                            {tab.id === "users" && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                                    {users.length}
                                </span>
                            )}
                            {tab.id === "events" && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                                    {events.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Page body */}
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                {activeTab === "overview" && (
                    <OverviewTab stats={stats} aiInsights={AI_INSIGHTS} />
                )}
                {activeTab === "users" && (
                    <UsersTab
                        users={users}
                        search={search}
                        setSearch={setSearch}
                        onDelete={handleDeleteUser}
                    />
                )}
                {activeTab === "events" && (
                    <EventsTab
                        events={events}
                        onDelete={handleDeleteEvent}
                        onViewRegs={(id, title) => setModal({ eventId: id, eventTitle: title })}
                    />
                )}
            </div>

            {/* Registrations modal */}
            {modal && (
                <RegistrationsModal
                    eventId={modal.eventId}
                    eventTitle={modal.eventTitle}
                    onClose={() => setModal(null)}
                />
            )}

            {/* Toast notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-xl animate-pulse">
                    {toast}
                </div>
            )}
        </div>
    );
  }