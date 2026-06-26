const Event = require("../models/Event");
const Registration = require("../models/Registration");

// ─────────────────────────────────────────────────────────────────
// ORGANIZER ANALYTICS
// GET /api/analytics/organizer
// ─────────────────────────────────────────────────────────────────
const getOrganizerAnalytics = async (req, res) => {
    try {
        const organizerId = req.user.id || req.user._id;

        // 1. All events created by this organizer
        const events = await Event.find({ createdBy: organizerId });
        const eventIds = events.map((e) => e._id);
        const totalEvents = events.length;

        // 2. Upcoming events (date > now)
        const now = new Date();
        const upcomingEvents = events
            .filter((e) => new Date(e.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map((e) => ({
                title: e.title,
                date: e.date,
                venue: e.venue,
                category: e.category,
            }));

        // 3. Total registrations across all organizer events
        const totalRegistrations = await Registration.countDocuments({
            eventId: { $in: eventIds },
        });

        // 4. Total attended
        const totalAttended = await Registration.countDocuments({
            eventId: { $in: eventIds },
            attended: true,
        });

        // 5. Attendance percentage
        const attendancePercentage =
            totalRegistrations > 0
                ? Math.round((totalAttended / totalRegistrations) * 100)
                : 0;

        // 6. Registrations per event (for bar chart)
        const registrationsPerEvent = await Registration.aggregate([
            { $match: { eventId: { $in: eventIds } } },
            { $group: { _id: "$eventId", count: { $sum: 1 } } },
        ]);

        // Map event titles onto the aggregation result
        const eventMap = {};
        events.forEach((e) => {
            eventMap[e._id.toString()] = e.title;
        });

        const registrationsChart = registrationsPerEvent.map((r) => ({
            name: eventMap[r._id.toString()] || "Unknown",
            registrations: r.count,
        }));

        // 7. Attendance per event (for grouped bar chart)
        const attendancePerEvent = await Registration.aggregate([
            { $match: { eventId: { $in: eventIds } } },
            {
                $group: {
                    _id: "$eventId",
                    total: { $sum: 1 },
                    attended: { $sum: { $cond: ["$attended", 1, 0] } },
                },
            },
        ]);

        const attendanceChart = attendancePerEvent.map((r) => ({
            name: eventMap[r._id.toString()] || "Unknown",
            total: r.total,
            attended: r.attended,
        }));

        // 8. Registrations by category (for pie chart)
        const categoryAgg = await Event.aggregate([
            { $match: { createdBy: events[0]?.createdBy || null, _id: { $in: eventIds } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        const categoryChart = categoryAgg.map((c) => ({
            name: c._id || "General",
            value: c.count,
        }));

        // 9. Monthly registrations trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Registration.aggregate([
            {
                $match: {
                    eventId: { $in: eventIds },
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const trendChart = monthlyTrend.map((m) => ({
            month: monthNames[m._id.month - 1],
            registrations: m.count,
        }));

        res.json({
            stats: {
                totalEvents,
                totalRegistrations,
                totalAttended,
                attendancePercentage,
                upcomingCount: upcomingEvents.length,
            },
            upcomingEvents,
            registrationsChart,
            attendanceChart,
            categoryChart,
            trendChart,
        });
    } catch (error) {
        console.error("Organizer analytics error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// STUDENT ANALYTICS
// GET /api/analytics/student
// ─────────────────────────────────────────────────────────────────
const getStudentAnalytics = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        // 1. All registrations for this student
        const registrations = await Registration.find({ userID: userId })
            .populate("eventId", "title date venue category");

        const totalRegistered = registrations.length;

        // 2. Attended events
        const attendedRegistrations = registrations.filter((r) => r.attended);
        const totalAttended = attendedRegistrations.length;

        // 3. Certificates earned = attended events
        const certificatesEarned = totalAttended;

        // 4. Upcoming registered events
        const now = new Date();
        const upcomingEvents = registrations
            .filter((r) => r.eventId && new Date(r.eventId.date) > now)
            .sort((a, b) => new Date(a.eventId.date) - new Date(b.eventId.date))
            .slice(0, 5)
            .map((r) => ({
                title: r.eventId.title,
                date: r.eventId.date,
                venue: r.eventId.venue,
                attended: r.attended,
            }));

        // 5. Attendance rate
        const attendanceRate =
            totalRegistered > 0
                ? Math.round((totalAttended / totalRegistered) * 100)
                : 0;

        // 6. Events by category (pie chart)
        const categoryCount = {};
        registrations.forEach((r) => {
            if (r.eventId) {
                const cat = r.eventId.category || "General";
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            }
        });
        const categoryChart = Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value,
        }));

        // 7. Monthly activity (line chart — last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyMap = {};
        registrations.forEach((r) => {
            const d = new Date(r.createdAt);
            if (d >= sixMonthsAgo) {
                const key = monthNames[d.getMonth()];
                if (!monthlyMap[key]) monthlyMap[key] = { registered: 0, attended: 0 };
                monthlyMap[key].registered += 1;
                if (r.attended) monthlyMap[key].attended += 1;
            }
        });

        const activityChart = Object.entries(monthlyMap).map(([month, data]) => ({
            month,
            registered: data.registered,
            attended: data.attended,
        }));

        // 8. Recent activity list
        const recentActivity = registrations
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6)
            .map((r) => ({
                eventTitle: r.eventId?.title || "Event",
                date: r.eventId?.date,
                attended: r.attended,
                registeredAt: r.createdAt,
            }));

        res.json({
            stats: {
                totalRegistered,
                totalAttended,
                certificatesEarned,
                attendanceRate,
            },
            upcomingEvents,
            categoryChart,
            activityChart,
            recentActivity,
        });
    } catch (error) {
        console.error("Student analytics error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { getOrganizerAnalytics, getStudentAnalytics };