import request from "supertest";
import app from "../src/app.js";

describe("ShopSphere API", () => {
  test("GET / should return API status", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "ShopSphere API is running",
    });
  });
});
