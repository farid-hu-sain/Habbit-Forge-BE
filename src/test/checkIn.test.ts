import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";

describe("POST /api/habit/:id/checkin", () => {
  const token = jwt.sign({ id: "user-checkin-123" }, config.JWT_SECRET);
  let habitId: string;

  beforeAll(async () => {
    // Create a habit
    const habitRes = await request(app)
      .post("/api/habit")
      .field("title", "Test Habit for Check-in")
      .field("description", "For testing check-ins")
      .field("userId", "user-checkin-123")
      .set("Authorization", `Bearer ${token}`);
    
    // ✅ FORMAT: response.body.id (bukan response.body.data.id)
    console.log("🔍 DEBUG Habit Response:");
    console.log("Status:", habitRes.status);
    console.log("Body:", JSON.stringify(habitRes.body, null, 2));
    
    if (habitRes.body.id) {
      habitId = habitRes.body.id;
    } else if (habitRes.body.data?.id) {
      habitId = habitRes.body.data.id;
    } else {
      console.log("❌ Could not find habit ID, using fallback");
      habitId = "test-habit-id-123";
    }
    
    console.log("✅ Habit ID:", habitId);
  });

  it("should return 201 and create check-in", async () => {
    const res = await request(app)
      .post(`/api/habit/${habitId}/checkin`)
      .field("note", "Did it successfully today!")
      .field("userId", "user-checkin-123")
      .set("Authorization", `Bearer ${token}`);

    console.log("🔍 Check-in Response:");
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(res.body, null, 2));
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });
});

describe("GET /api/habit/:id/checkins", () => {
  const token = jwt.sign({ id: "user-456" }, config.JWT_SECRET);

  it("should return 200 and list of check-ins", async () => {
    // Create habit
    const habitRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit for Checkins List")
      .field("description", "For listing check-ins")
      .field("userId", "user-456")
      .set("Authorization", `Bearer ${token}`);
    
    // ✅ FORMAT: response.body.id
    const habitId = habitRes.body.id || habitRes.body.data?.id;
    console.log("Habit ID for checkins:", habitId);

    // Create check-in
    await request(app)
      .post(`/api/habit/${habitId}/checkin`)
      .field("note", "Check-in 1")
      .field("userId", "user-456")
      .set("Authorization", `Bearer ${token}`);

    // Get check-ins
    const res = await request(app)
      .get(`/api/habit/${habitId}/checkins`)
      .set("Authorization", `Bearer ${token}`);

    console.log("GET checkins response:", res.status);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe("PUT /api/checkin/:id", () => {
  const token = jwt.sign({ id: "user-789" }, config.JWT_SECRET);

  it("should return 200 and update check-in note", async () => {
    // Create habit
    const habitRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit for Checkin Update")
      .field("description", "For updating check-in")
      .field("userId", "user-789")
      .set("Authorization", `Bearer ${token}`);
    
    // ✅ FORMAT: response.body.id
    const habitId = habitRes.body.id || habitRes.body.data?.id;

    // Create check-in
    const createRes = await request(app)
      .post(`/api/habit/${habitId}/checkin`)
      .field("note", "Original note")
      .field("userId", "user-789")
      .set("Authorization", `Bearer ${token}`);

    // ✅ FORMAT: response.body.id
    const checkinId = createRes.body.id || createRes.body.data?.id;
    console.log("Checkin ID for update:", checkinId);

    // Update check-in
    const res = await request(app)
      .put(`/api/checkin/${checkinId}`)
      .field("note", "Updated note here")
      .set("Authorization", `Bearer ${token}`);

    console.log("Update checkin status:", res.status);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe("DELETE /api/checkin/:id", () => {
  const token = jwt.sign({ id: "user-999" }, config.JWT_SECRET);

  it("should return 200 and delete check-in", async () => {
    // Create habit
    const habitRes = await request(app)
      .post("/api/habit")
      .field("title", "Habit for Checkin Delete")
      .field("description", "For deleting check-in")
      .field("userId", "user-999")
      .set("Authorization", `Bearer ${token}`);
    
    // ✅ FORMAT: response.body.id
    const habitId = habitRes.body.id || habitRes.body.data?.id;

    // Create check-in
    const createRes = await request(app)
      .post(`/api/habit/${habitId}/checkin`)
      .field("note", "Will be deleted")
      .field("userId", "user-999")
      .set("Authorization", `Bearer ${token}`);

    // ✅ FORMAT: response.body.id
    const checkinId = createRes.body.id || createRes.body.data?.id;
    console.log("Checkin ID to delete:", checkinId);

    // Delete check-in
    const res = await request(app)
      .delete(`/api/checkin/${checkinId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete checkin status:", res.status);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});