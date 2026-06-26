import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
} from "recharts";
import API from "../services/api";

// ── Palette ───────────────────────────────────────────────────────
const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.08) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// ── Stat card ─────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ── Section wrapper ───────────────────────────────────────────────
const Section = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-700 mb-5">{title}</h3>
        {children}
    </div>
);

export default function OrganizerAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/analytics/organizer", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
                    <p className="text-4xl mb-3">⚠️</p>
                    <p className="text-red-600 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    const { stats, upcomingEvents, registrationsChart, attendanceChart, categoryChart, trendChart } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
                            Organizer View
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Overview of all your events and registrations
                        </p>
                    </div>
                    <div className="hidden sm:block text-5xl">📊</div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon="🗓️"
                        label="Total Events"
                        value={stats.totalEvents}
                        sub="events created"
                        color="bg-indigo-50"
                    />
                    <StatCard
                        icon="👥"
                        label="Registrations"
                        value={stats.totalRegistrations}
                        sub="across all events"
                        color="bg-violet-50"
                    />
                    <StatCard
                        icon="✅"
                        label="Attendance Rate"
                        value={`${stats.attendancePercentage}%`}
                        sub={`${stats.totalAttended} attended`}
                        color="bg-emerald-50"
                    />
                    <StatCard
                        icon="🚀"
                        label="Upcoming"
                        value={stats.upcomingCount}
                        sub="events scheduled"
                        color="bg-sky-50"
                    />
                </div>

                {/* Charts row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Registrations per event */}
                    <Section title="Registrations per Event">
                        {registrationsChart.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={registrationsChart} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                                        angle={-30}
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                                    />
                                    <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Section>

                    {/* Events by category */}
                    <Section title="Events by Category">
                        {categoryChart.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ResponsiveContainer width="60%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={categoryChart}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            dataKey="value"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                        >
                                            {categoryChart.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-col gap-2">
                                    {categoryChart.map((c, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <span
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                            />
                                            <span className="text-gray-600 truncate max-w-[100px]">{c.name}</span>
                                            <span className="font-bold text-gray-800 ml-auto">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Section>
                </div>

                {/* Charts row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Attendance breakdown */}
                    <Section title="Attendance vs Registrations">
                        {attendanceChart.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={attendanceChart} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                                        angle={-30}
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                                    <Bar dataKey="total" name="Registered" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="attended" name="Attended" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Section>

                    {/* Monthly trend */}
                    <Section title="Monthly Registration Trend">
                        {trendChart.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No data in the last 6 months.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={trendChart} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="registrations"
                                        stroke="#6366f1"
                                        strokeWidth={2.5}
                                        dot={{ fill: "#6366f1", r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Section>
                </div>

                {/* Upcoming Events */}
                <Section title="Upcoming Events">
                    {upcomingEvents.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-6">
                            No upcoming events. Create one to get started!
                        </p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {upcomingEvents.map((ev, i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
                                            {new Date(ev.date).getDate()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(ev.date).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}{" "}
                                                · {ev.venue}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium hidden sm:block">
                                        {ev.category || "General"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

            </div>
        </div>
    );
}