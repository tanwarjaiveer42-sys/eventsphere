require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

/* ✅ MIDDLEWARE FIRST */

app.use(cors());
app.use(express.json());
console.log("EVENT ROUTES FILE LOADED");

/* ✅ ROUTES AFTER MIDDLEWARE */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
/* DB CONNECT */
connectDB();

/* TEST ROUTE */
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