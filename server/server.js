require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ← ADD
const analyticsRoutes = require("./routes/analyticsRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const aiRoutes = require("./routes/aiRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes); // ← ADD
app.use("/api/analytics", analyticsRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/ai", aiRoutes);
connectDB();

app.get("/", (req, res) => {
    res.send("EventSphere Backend Running");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error(err);
    }
    process.exit(1);
});