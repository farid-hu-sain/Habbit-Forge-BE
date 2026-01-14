// tests/profile.test.ts
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import path from "path";
describe("GET /api/profile", () => {
    const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);
    it("should return 200 and user profile", async () => {
        const res = await request(app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("PUT /api/profile/:id", () => {
    const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);
    it("should return 200 and update profile", async () => {
        const res = await request(app)
            .put(`/api/profile/user-123`)
            .field("fullName", "Updated Name")
            .field("bio", "Updated bio here")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 200 and update profile with avatar", async () => {
        const res = await request(app)
            .put(`/api/profile/user-123`)
            .field("fullName", "User with Avatar")
            .field("bio", "Testing file upload")
            .attach("avatar", path.resolve(__dirname, "../test-images/avatar.jpg"))
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=profile.test.js.map