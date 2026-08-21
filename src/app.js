const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(helmet());
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads", {
  setHeaders: (res) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ProjectFlow API is running" });
});

module.exports = app;