import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    ResponsiveContainer,
} from "recharts";
import API from "../services/api";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
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

const Section = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-700 mb-5">{title}</h3>
        {children}
    </div>
);

export default function StudentAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/analytics/student", {
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

    const { stats, upcomingEvents, categoryChart, activityChart, recentActivity } = data;

    // Ring chart data — attended vs not attended
    const ringData = [
        { name: "Attended", value: stats.totalAttended },
        { name: "Missed", value: stats.totalRegistered - stats.totalAttended },
    ];
    const ringColors = ["#6366f1", "#e2e8f0"];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
                            Student View
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900">My Analytics</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Your event participation and achievement overview
                        </p>
                    </div>
                    <div className="hidden sm:block text-5xl">🎓</div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon="🎟️"
                        label="Registered"
                        value={stats.totalRegistered}
                        sub="events joined"
                        color="bg-indigo-50"
                    />
                    <StatCard
                        icon="✅"
                        label="Attended"
                        value={stats.totalAttended}
                        sub="physically present"
                        color="bg-emerald-50"
                    />
                    <StatCard
                        icon="🏆"
                        label="Certificates"
                        value={stats.certificatesEarned}
                        sub="earned so far"
                        color="bg-amber-50"
                    />
                    <StatCard
                        icon="📈"
                        label="Attendance Rate"
                        value={`${stats.attendanceRate}%`}
                        sub="of events attended"
                        color="bg-violet-50"
                    />
                </div>

                {/* Charts row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Attendance ring */}
                    <Section title="Attendance Breakdown">
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="55%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={ringData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        labelLine={false}
                                        label={renderCustomLabel}
                                    >
                                        {ringData.map((_, i) => (
                                            <Cell key={i} fill={ringColors[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-4xl font-bold text-indigo-600">
                                        {stats.attendanceRate}%
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">attendance rate</p>
                                </div>
                                {ringData.map((r, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: ringColors[i] }}
                                        />
                                        <span className="text-gray-500">{r.name}</span>
                                        <span className="font-bold text-gray-800 ml-auto">{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Events by category */}
                    <Section title="Events by Category">
                        {categoryChart.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                Register for events to see category data.
                            </p>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ResponsiveContainer width="60%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={categoryChart}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={85}
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

                {/* Activity chart */}
                <Section title="Monthly Activity (Last 6 Months)">
                    {activityChart.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">
                            No activity in the last 6 months.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={activityChart} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                                <Bar dataKey="registered" name="Registered" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="attended" name="Attended" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Section>

                {/* Bottom row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Upcoming events */}
                    <Section title="My Upcoming Events">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-6">
                                No upcoming events. Browse and register!
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {upcomingEvents.map((ev, i) => (
                                    <div key={i} className="flex items-center gap-3 py-3">
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
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* Recent activity */}
                    <Section title="Recent Activity">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-6">No activity yet.</p>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentActivity.map((act, i) => (
                                    <div key={i} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{act.attended ? "✅" : "🎟️"}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {act.eventTitle}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Registered{" "}
                                                    {new Date(act.registeredAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                act.attended
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {act.attended ? "Attended" : "Registered"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

            </div>
        </div>
    );
}