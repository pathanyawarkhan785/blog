const jwt = require("jsonwebtoken");
const query = require("../db/query/index");
const supertest = require("supertest");
const router = require("../index");
const request = supertest.agent(router.callback());

jest.setTimeout(1000);

const token = jwt.sign(
  "ywr@gmail.com",
  "1234567890123456789012345678901234567890"
);

describe("owner update using params id", () => {
  test("if no token.", async (ctx) => {
    query.findEmail = jest.fn(() => ({
      _id: "7df93619-42bd-4aed-9244-41245e0b3b4b",
      email: "ywr@gmail.com",
      firstName: "yawar",
      password: "ywr123",
      lastName: "pathan",
      mobileno: "8487864415",
      createdon: "2022-03-01T07:31:53.836+00:00",
      updatedon: "2022-03-01T08:02:10.189+00:00",
      owner: true,
    }));
    query.updateUserData = jest.fn(() => ({
      _id: "7df93619-42bd-4aed-9244-41245e0b3b4b",
      email: "ywr@gmail.com",
      firstName: "yawar",
      password: "ywr123",
      lastName: "pathan",
      mobileno: "8487864415",
      createdon: "2022-03-01T07:31:53.836+00:00",
      updatedon: "2022-03-01T08:02:10.189+00:00",
      owner: true,
    }));

    const ownerData = await request
      .patch("/owner/update/7df93619-42bd-4aed-9244-41245e0b3b4b")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      })
      .set("authorization", token);

    expect(ownerData.body).toBe({
      message: "jwt must be provided",
      name: "JsonWebTokenError",
    });
    expect(ownerData.status).toEqual(200);
  });
});
