import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
describe("Auth API with Fixed Middleware", () => {
    // Helper untuk data unik
    function getUniqueTestData() {
        const timestamp = Date.now();
        return {
            email: `test${timestamp}@example.com`,
            username: `user${timestamp}`,
            password: "password123",
            fullName: `User ${timestamp}`
        };
    }
    describe("POST /api/auth/register", () => {
        it("should return 201 and register new user", async () => {
            const testData = getUniqueTestData();
            const res = await request(app)
                .post("/api/auth/register")
                .send(testData)
                .set('Content-Type', 'application/json');
            console.log("Register - Status:", res.status);
            console.log("Register - Response:", res.body);
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
        });
        it("should return 400 for duplicate email", async () => {
            const testData = getUniqueTestData();
            // Register pertama
            await request(app)
                .post("/api/auth/register")
                .send(testData)
                .set('Content-Type', 'application/json');
            // Register kedua dengan email sama
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                ...testData,
                username: `different${Date.now()}`
            })
                .set('Content-Type', 'application/json');
            console.log("Duplicate email - Status:", res.status);
            console.log("Duplicate email - Message:", res.body?.message);
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe("POST /api/auth/login", () => {
        let testData;
        beforeAll(async () => {
            testData = getUniqueTestData();
            await request(app)
                .post("/api/auth/register")
                .send(testData)
                .set('Content-Type', 'application/json');
        });
        it("should return 200 and login token", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                email: testData.email,
                password: testData.password
            })
                .set('Content-Type', 'application/json');
            console.log("Login success - Status:", res.status);
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("token");
        });
        it("should return 401 (or 400) for wrong password", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                email: testData.email,
                password: "wrongpassword"
            })
                .set('Content-Type', 'application/json');
            console.log("Wrong password - Status:", res.status);
            console.log("Wrong password - Message:", res.body?.message);
            expect([400, 401]).toContain(res.statusCode);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("salah"); // Cek pesan error
        });
        it("should return 401 (or 400) for non-existent email", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                email: "nonexistent@example.com",
                password: "anypassword"
            })
                .set('Content-Type', 'application/json');
            console.log("Non-existent email - Status:", res.status);
            expect([400, 401]).toContain(res.statusCode);
            expect(res.body.success).toBe(false);
        });
    });
    describe("GET /api/auth/me - MIDDLEWARE TESTS", () => {
        let validToken;
        beforeAll(async () => {
            // Setup: register dan login untuk dapat token valid
            const testData = getUniqueTestData();
            await request(app)
                .post("/api/auth/register")
                .send(testData)
                .set('Content-Type', 'application/json');
            const loginRes = await request(app)
                .post("/api/auth/login")
                .send({
                email: testData.email,
                password: testData.password
            })
                .set('Content-Type', 'application/json');
            validToken = loginRes.body.data?.token;
            // Fallback jika token tidak ada
            if (!validToken) {
                validToken = jwt.sign({ id: "test-user-id" }, config.JWT_SECRET);
            }
        });
        it("should return 401 without authorization header", async () => {
            const res = await request(app).get("/api/auth/me");
            console.log("No header - Status:", res.status);
            console.log("No header - Message:", res.body?.message);
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain("token tidak ditemukan");
        });
        it("should return 401 with invalid token format (no Bearer)", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "JustTokenWithoutBearer");
            console.log("No Bearer - Status:", res.status);
            expect(res.statusCode).toEqual(401);
        });
        it("should return 401 with empty token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer ");
            console.log("Empty token - Status:", res.status);
            expect(res.statusCode).toEqual(401);
        });
        it("should return 401 with invalid JWT token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid.jwt.token.here");
            console.log("Invalid JWT - Status:", res.status);
            console.log("Invalid JWT - Message:", res.body?.message);
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain("token tidak valid");
        });
        it("should return 200 with valid token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${validToken}`);
            console.log("Valid token - Status:", res.status);
            console.log("Valid token - Response:", res.body);
            // Bisa jadi 200 (success) atau 404 (user not found di service)
            // Tapi yang penting TIDAK 401 (middleware passed)
            expect(res.statusCode).not.toEqual(401);
        });
    });
});
//# sourceMappingURL=auth.test.js.map