const supertest = require("supertest");
const query = require("../db/query/index");
const router = require("../index");
const request = supertest.agent(router.callback());

describe("registeration", () => {
  test("if registeration details null.", async () => {
    const registerData = await request.post("/register").send();

    expect(registerData.body).toEqual({
      msg: "email is compulsory,string & not null.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if only send email in body.", async () => {
    query.findEmail = jest.fn();

    const emailData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(emailData.body).toEqual({
      msg: "firstName is compulsory,not null and in string.",
    });
    expect(emailData.status).toEqual(400);
  });

  test("if only send firstName in body.", async () => {
    const firstNameData = await request.post("/register").send({
      firstName: "rajdeep",
    });

    expect(firstNameData.body).toEqual({
      msg: "email is compulsory,string & not null.",
    });
    expect(firstNameData.status).toEqual(400);
  });

  test("if only send password in body.", async () => {
    const passwordData = await request.post("/register").send({
      password: "rd123",
    });

    expect(passwordData.body).toEqual({
      msg: "email is compulsory,string & not null.",
    });
    expect(passwordData.status).toEqual(400);
  });

  test("if only send email and firstName in body.", async () => {
    query.findEmail = jest.fn();

    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "password is compulsory,not null and in string.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if only send email and password in body.", async () => {
    query.findEmail = jest.fn();

    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      password: "rd123",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "firstName is compulsory,not null and in string.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if only send firstName and password in body.", async () => {
    const registerData = await request.post("/register").send({
      firstName: "rajdeep",
      password: "rd123",
    });

    expect(registerData.body).toEqual({
      msg: "email is compulsory,string & not null.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if email exists in database", async () => {
    query.findEmail = jest.fn(() => ({
      msg: "email must be unique.",
    }));
    const emailData = await request.post("/register").send({
      email: "ywr@gmail.com",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(emailData.body).toEqual({ msg: "email must be unique." });
    expect(emailData.status).toEqual(400);
  });

  test("if email not in correct format.", async () => {
    const registerData = await request.post("/register").send({
      email: "rajdeepgmailc.o2m",
    });

    expect(registerData.body).toEqual({
      msg: "enter email in correct format.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if password length less than 5.", async () => {
    query.findEmail = jest.fn();

    const password = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd12",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(password.body).toEqual({
      msg: "password length must be atleast 5.",
    });
    expect(password.status).toEqual(400);
  });

  test("if lastname is in blank string.", async () => {
    query.findEmail = jest.fn();

    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd123",
      lastName: "     ",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "lastName can not be empty.",
    });
    expect(registerData.status).toEqual(400);
  });
  test("if mobileno is not in string.", async () => {
    query.findEmail = jest.fn();
    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd123",
      mobileno: 9087654321,
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "mobileno must be in string.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if mobileno is not in correct format.", async () => {
    query.findEmail = jest.fn();
    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd123",
      mobileno: "727278",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "enter mobile number in correct format.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if mobileno is exists in database.", async () => {
    query.findEmail = jest.fn();
    query.findMobileno = jest.fn(() => ({
      msg: "mobileno must be unique.",
    }));
    const registerData = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd123",
      mobileno: "8487864415",
    });

    expect(query.findEmail).toBeCalledTimes(1);
    expect(query.findMobileno).toBeCalledTimes(1);
    expect(registerData.body).toEqual({
      msg: "mobileno must be unique.",
    });
    expect(registerData.status).toEqual(400);
  });

  test("if all the details fill correct.", async () => {
    query.findEmail = jest.fn();
    query.registerData = jest.fn();

    const registerDetails = await request.post("/register").send({
      email: "rajdeep@gmail.com",
      firstName: "rajdeep",
      password: "rd123",
    });

    expect(registerDetails.status).toEqual(201);
    expect(query.findEmail).toBeCalledTimes(1);
    expect(query.registerData).toBeCalledTimes(1);
  });
});

describe("login ", () => {
  test("if login details null.", async () => {
    const loginData = await request.post("/login").send();

    expect(loginData.body).toEqual({ msg: "user not found." });
    expect(loginData.status).toEqual(404);
  });

  test("if write only correct email in body.", async () => {
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

    const loginData = await request.post("/login").send({
      email: "ywr@gmail.com",
    });

    expect(loginData.body).toEqual({
      msg: "password not matching.",
    });
    expect(loginData.status).toEqual(401);
    expect(query.findEmail).toBeCalledTimes(1);
  });

  test("if write only password in body.", async () => {
    const loginData = await request.post("/login").send({
      password: "ywr",
    });

    expect(loginData.body).toEqual({
      msg: "user not found.",
    });
    expect(loginData.status).toEqual(404);
  });

  test("if write incorrect crendential in body.", async () => {
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

    const loginData = await request.post("/login").send({
      email: "ywr@gmail.com",
      password: "ywr",
    });

    expect(loginData.body).toEqual({
      msg: "password not matching.",
    });
    expect(loginData.status).toEqual(401);
    expect(query.findEmail).toBeCalledTimes(1);
  });

  test("if write only wrong email in body.", async () => {
    query.findEmail = jest.fn();

    const loginData = await request
      .post("/login")
      .send({ email: "darshit@gmail.com" });

    expect(loginData.body).toEqual({
      msg: "no record found with this email : darshit@gmail.com",
    });
  });

  test("if write correct credentials in body.", async () => {
    query.findEmail = jest.fn(() => ({
      _id: "6eab0f5b-2eb5-4259-8d10-9a96924dac40",
      email: "viraj@gmail.com",
      firstName: "viraj",
      password: "viru123",
      lastName: "patel",
      mobileno: "8487864410",
    }));

    const emailData = await request.post("/login").send({
      email: "viraj@gmail.com",
      password: "viru123",
    });

    expect(emailData.status).toEqual(200);
    expect(query.findEmail).toBeCalledTimes(1);
  });
});
