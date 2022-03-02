const supertest = require("supertest");
let query = require("../db/query/index");
const router = require("../index");
// const mock = jest.fn();

const request = supertest.agent(router.callback());

describe("check login", () => {
  test("login null", async () => {
    const data = await request.post("/login").send();
    expect(data.body).toEqual({ msg: "user not found." });
  });

  test("valid login credentials", async () => {
    query.findEmail = jest.fn(() => ({
      email: "ywr@gmail.com",
      firstName: "yawar",
      password: "ywr123",
      lastName: "pathan",
      mobileno: "8487864415",
      owner: true,
    }));

    const result = await request
      .post("/login")
      .send({ email: "ywr@gmail.com", password: "ywr123" });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(result.status).toBe(200);
  });
});
