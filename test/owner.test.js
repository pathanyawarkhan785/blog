const jwt = require("jsonwebtoken");
const query = require("../db/query/index");
const supertest = require("supertest");
const router = require("../index");
const request = supertest.agent(router.callback());

// jest.setTimeout(5000);

const token = jwt.sign(
  "ywr@gmail.com",
  "1234567890123456789012345678901234567890"
);

describe("owner update using params id", () => {
  test("if no token.", async () => {
    const ownerData = await request
      .patch("/owner/update/7df93619-42bd-4aed-9244-41245e0b3b4b")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      });

    expect(ownerData.body).toEqual({
      message: "jwt must be provided",
      name: "JsonWebTokenError",
    });
    expect(ownerData.status).toEqual(200);
  });

  test("if incorrect token.", async () => {
    query.findEmail = jest.fn();

    const ownerData = await request
      .patch("/owner/update/7df93619-42bd-4aed-9244-41245e0b3b4b")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      })
      .set(
        "authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inl3ckBnbWFpbC5jb20iLCJpYXQiOjE2NDYzODU2OTEsImV4cCI6MTY0NjQ3MjA5MX0.3KlnA371d4XFyZ9d8JNK-7Blp8dQDNl-fhdZinudm"
      );

    expect(ownerData.body).toEqual({
      name: "JsonWebTokenError",
      message: "invalid signature",
    });
    expect(ownerData.status).toEqual(200);
  });

  test("if token malformed.", async () => {
    query.findEmail = jest.fn();

    const ownerData = await request
      .patch("/owner/update/7df93619-42bd-4aed-9244-41245e0b3b4b")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      })
      .set("authorization", "eyJhbGcidZinudm");

    expect(ownerData.body).toEqual({
      name: "JsonWebTokenError",
      message: "jwt malformed",
    });
    expect(ownerData.status).toEqual(200);
  });

  test("if invalid token.", async () => {
    query.findEmail = jest.fn();

    const ownerData = await request
      .patch("/owner/update/7df93619-42bd-4aed-9244-41245e0b3b4b")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      })
      .set(
        "authorization",
        "eyJhbGciOiJIUzI1NiIsInR.eyJlbWFpbCI6Inl3ckBnbWFpbC5jb20iLCJpYXQiOjE2NDYzODU2OTEsImV4cCI6MTY0NjQ3MjA5MX0.3KlnA371d4XFyZ9d8JNK-7Blp8dQDNl-fhdZinudm"
      );

    expect(ownerData.body).toEqual({
      name: "JsonWebTokenError",
      message: "invalid token",
    });
    expect(ownerData.status).toEqual(200);
  });

  test("if token correct and but id in params is incorrect.", async () => {
    query.findbyownerid = jest.fn();
    query.findEmail = jest.fn();

    const ownerData = await request
      .patch("/owner/update/123")
      .send({
        firstName: "yawar",
        lastName: "pathan",
        password: "yawar370",
        email: "ywr1@gmail.com",
      })
      .set("Authorization", token);
    // expect(ownerData.body).toEqual({
    //   msg: "you are not authorised to update owner details.",
    // });
    expect(query.findbyownerid).toBeCalledTimes(1);
  });
});
