import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/error.handler.js";
import swaggerSpec from "./utils/swagger.js";
import { successResponse } from "./utils/response.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import habitRoutes from "./routes/habit.route.js";
import checkInRoutes from "./routes/checkIn.route.js";
import profileRoutes from "./routes/profile.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import statRoutes from "./routes/stat.route.js";
const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (_req, res) => {
    successResponse(res, "Selamat datang di API Habit Forge", {
        name: "Habit Tracker API",
        version: "1.0.0",
        status: "Server berjalan",
        documentation: "/api-docs",
        test_endpoint: "/api/test/connection",
        endpoints: {
            auth: "/api/auth",
            user: "/api/user",
            habits: "/api/habit",
            checkins: "/api/checkIn",
            categories: "/api/category",
            profile: "/api/profile",
            dashboard: "/api/dashboard",
            statistics: "/api/stat",
            test: "/api/test",
        },
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/checkIn", checkInRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stat", statRoutes);
app.use((req, _res, next) => {
    const error = new Error(`Route ${req.originalUrl} tidak ditemukan di API Habit Tracker`);
    error.status = 404;
    next(error);
});
app.use(errorHandler);
export default app;
