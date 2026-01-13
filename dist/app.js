import express, {} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { successResponse } from "./utils/response.js";
import { errorHandler } from "./middleware/error.handler.js";
import categoryRouter from "./routes/category.route.js";
import checkInRouter from "./routes/checkIn.route.js";
import habitRouter from "./routes/habit.route.js";
import profileRouter from "./routes/profile.route.js";
import authRouter from "./routes/auth.route.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./utils/swagger.js";
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.set("query panser", "extended");
app.use(express.static("public"));
app.use((req, _res, next) => {
    console.log(`${req.method}: ${req.path}`);
    req.startTime = Date.now();
    next();
});
app.get("/", (_req, res) => {
    successResponse(res, "selamat datang di API Habit Forge", {
        status: "server Hidup",
    });
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/category", categoryRouter);
app.use("/api/checkIn", checkInRouter);
app.use("/api/habit", habitRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);
app.get(/.*/, (req, _res) => {
    throw new Error(`Route ${req.originalUrl} tidak ada di API e-commrece`);
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map
