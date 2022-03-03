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
});
