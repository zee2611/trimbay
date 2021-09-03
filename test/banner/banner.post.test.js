const app = require("../../server");
const mongoose = require("mongoose");
let request = require("supertest");
const Banner = require("../../model/banner.model");

describe("POST /users", () => {
  describe("given a usernaem and password", () => {
    test("should respons with a 200 status code", async () => {
      const response = await request(app).post("/users").send({
        image:
          "https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg",
        text: "Men's Shirts",
        category: "611cf752a498cb1a044ffdfc",
        subCategory: "611de7548ec4590b9854d842",
        brand: "612729aa88a9f71b1ce709a5",
        theme: "61272ea71e2c293240ae53d6",
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
