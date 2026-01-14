// tests/dashboard.test.ts
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
describe("GET /api/dashboard", () => {
    const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);
    it("should return 200 and dashboard data", async () => {
        const res = await request(app)
            .get("/api/dashboard")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/dashboard/today", () => {
    const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);
    it("should return 200 and today's habits", async () => {
        // Create a habit first
        await request(app)
            .post("/api/habit")
            .field("title", "Dashboard Test Habit")
            .field("description", "For dashboard testing")
            .field("userId", "user-123")
            .field("categoryId", "category-123")
            .set("Authorization", `Bearer ${token}`);
        const res = await request(app)
            .get("/api/dashboard/today")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/dashboard/stats", () => {
    const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);
    it("should return 200 and user statistics", async () => {
        const res = await request(app)
            .get("/api/dashboard/stats")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=category.test.js.map