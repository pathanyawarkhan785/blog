const supertest = require("supertest");
const query = require("../db/query/index");
const router = require("../index");
const request = supertest.agent(router.callback());

describe("registeration", () => {
  test("register null", async () => {
    const emailData = await request.post("/register").send();
    expect(emailData.body).toEqual({
      msg: "email is compulsory,string & not null.",
    });
    expect(emailData.status).toEqual(400);
  });

  test("throw error if email in database.", async () => {
    query.findEmail = jest.fn(() => ({
      email: "rajdeep@gmail.com",
    }));

    const emailData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeepsinh",
      password: "rd123",
      mobileno: "9876543210",
    });
    expect(query.findEmail).toBeCalledTimes(1);
    expect(emailData.status).toEqual(400);
    expect(emailData.body).toEqual({ msg: "email must be unique." });
  });
});

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
