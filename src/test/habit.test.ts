// tests/habit.test.ts
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";

describe("GET /api/habit", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 200 and list of habits", async () => {
    const res = await request(app)
      .get("/api/habit")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app)
      .get("/api/habit");

    expect(res.statusCode).toEqual(401);
  });
});

describe("POST /api/habit", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 201 and create new habit", async () => {
    const res = await request(app)
      .post("/api/habit")
      .field("title", "Morning Exercise")
      .field("description", "30 minutes of exercise every morning")
      .field("userId", "user-123")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 for missing title", async () => {
    const res = await request(app)
      .post("/api/habit")
      .field("description", "Test description")
      .field("userId", "user-123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/habit/:id", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 200 for existing habit", async () => {
    // First create a habit
    const createRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit for Get Test")
      .field("description", "Test description")
      .field("userId", "user-123")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    const habitId = createRes.body.data.id;

    const res = await request(app)
      .get(`/api/habit/${habitId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 for non-existent habit", async () => {
    const res = await request(app)
      .get("/api/habit/non-existent-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
  });
});

describe("PUT /api/habit/:id", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 200 and update habit", async () => {
    // First create a habit
    const createRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit to Update")
      .field("description", "Original description")
      .field("userId", "user-123")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    const habitId = createRes.body.data.id;

    // Update habit
    const res = await request(app)
      .put(`/api/habit/${habitId}`)
      .field("title", "Updated Habit Title")
      .field("description", "Updated description")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe("DELETE /api/habit/:id", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 200 and delete habit", async () => {
    // First create a habit
    const createRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit to Delete")
      .field("description", "Will be deleted")
      .field("userId", "user-123")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    const habitId = createRes.body.data.id;

    // Delete habit
    const res = await request(app)
      .delete(`/api/habit/${habitId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe("PUT /api/habit/:id/toggle", () => {
  const token = jwt.sign({ id: "user-123" }, config.JWT_SECRET);

  it("should return 200 and toggle habit status", async () => {
    // First create a habit
    const createRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit to Toggle")
      .field("description", "Toggle test")
      .field("userId", "user-123")
      .field("categoryId", "category-123")
      .set("Authorization", `Bearer ${token}`);

    const habitId = createRes.body.data.id;

    // Toggle habit
    const res = await request(app)
      .put(`/api/habit/${habitId}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});