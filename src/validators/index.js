const {
  findMobileno,
  findEmail,
  findbyId,
  findOwner,
  inviteUser,
  contentData,
  findInvUsers,
  addAccess,
} = require("../../db/query");
const query = require("../../db/query");

const registerVal = async (ctx, next) => {
  try {
    // console.log("registerVal");

    let { email, password, firstName, lastName, mobileno } = ctx.request.body;
    let data = {};
    let regexEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    let regexMobileno = /^[6-9]\d{9}$/gi;

    // email

    if (!email || typeof email !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "email is compulsory,string & not null." };
      return;
    } else if (regexEmail.test(email.trim()) === false) {
      ctx.status = 400;
      ctx.body = { msg: "enter email in correct format." };
      return;
    } else {
      email = email.trim();
      const findemail = await query.findEmail(email);
      if (findemail) {
        ctx.status = 400;
        ctx.body = { msg: "email must be unique." };
        return;
      }
      Object.assign(data, { ...data, email: email });
    }

    //firstName
    {
      if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "firstName is compulsory,not null and in string." };
        return;
      }
      firstName = firstName.trim();
      Object.assign(data, { ...data, firstName: firstName });
    }

    //password
    {
      if (!password || typeof password !== "string" || !password.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "password is compulsory,not null and in string." };
        return;
      } else if (password.trim().length < 5) {
        ctx.status = 400;
        ctx.body = { msg: "password length must be atleast 5." };
        return;
      }
      password = password.trim();
      Object.assign(data, { ...data, password: password });
    }

    //lastName
    if (lastName) {
      if (typeof lastName !== "string") {
        ctx.status = 400;
        ctx.body = { msg: "lastName must be in string & not null." };
        return;
      } else if (!lastName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "lastName can not be empty." };
        return;
      }
      lastName = lastName.trim();
      Object.assign(data, { ...data, lastName: lastName });
    }

    //mobileno
    if (mobileno) {
      if (typeof mobileno !== "string") {
        ctx.status = 400;
        ctx.body = { msg: "mobileno must be in string." };
        return;
      } else if (regexMobileno.test(mobileno.trim()) === false) {
        ctx.status = 400;
        ctx.body = { msg: "enter mobile number in correct format." };
        return;
      } else {
        const findMobile = await query.findMobileno(mobileno.trim());
        if (findMobile) {
          ctx.status = 400;
          ctx.body = { msg: "mobileno must be unique." };
          return;
        }
      }
      mobileno = mobileno.trim();
      Object.assign(data, { ...data, mobileno: mobileno });
    }

    ctx.state.shared = data;

    await next();
  } catch (e) {
    console.log(e);
  }
};

const loginVal = async (ctx, next) => {
  try {
    const { email, password, mobileno } = ctx.request.body;
    if (!((email && email.trim()) || (mobileno && mobileno.trim()))) {
      ctx.status = 404;
      ctx.body = { msg: "user not found." };
      return;
      // ctx.throw(404, "user not found");
    }

    if (!email && !mobileno) {
      ctx.status = 404;
      ctx.body = { msg: "no owner found with this email or mobileno." };
      return;
    } else if (email) {
      const emailData = await query.findEmail(email);
      if (emailData) {
        if (emailData.password !== password) {
          ctx.status = 401;
          ctx.body = { msg: "password not matching." };
          return;
        }
      } else {
        ctx.status = 404;
        return (ctx.body = {
          msg: `no record found with this email : ${email}`,
        });
      }
    } else if (mobileno) {
      const mobileData = await query.findMobileno(mobileno);
      if (mobileData) {
        if (mobileData.password !== password) {
          ctx.status = 401;
          ctx.body = { msg: "password not matching." };
          return;
        }
      } else {
        ctx.status = 404;
        return (ctx.body = {
          msg: `no record found with this mobileno : ${mobileno}`,
        });
      }
    }
    ctx.state.shared = { email, mobileno };

    await next();
  } catch (e) {
    console.log(e);
  }
};

const updateUserVal = async (ctx, next) => {
  // console.log("updateUserVal");
  const { findemail } = ctx.state.shared;
  const { _id } = ctx.params;

  if (findemail) {
    if (findemail._id !== _id) {
      ctx.status = 401;
      return (ctx.body = {
        msg: "you are not authorised to update owner details.",
      });
    }
  } else {
    ctx.status = 404;
    return (ctx.body = { msg: "no owner found." });
  }

  let data = {};
  let regexEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  let { email, firstName, lastName, password, mobileno } = ctx.request.body;
  let regexMobileno = /[6-9]{1}\d{9}/;
  const { oldEmail } = ctx.state.shared;

  if (typeof email !== "string") {
    ctx.status = 400;
    ctx.body = { msg: "email must be in string." };
    return;
  } else if (regexEmail.test(email.trim()) === false) {
    ctx.status = 400;
    ctx.body = { msg: "enter email in correct format." };
    return;
  } else {
    const findemail = await query.findEmail(email);
    if (oldEmail === email) {
      // ctx.status = 400;
      // ctx.body = { msg: "you entered old email." };
      // return;
    } else if (findemail) {
      ctx.status = 400;
      ctx.body = { msg: "email must be unique." };
      return;
    }
    email = email.trim();
    Object.assign(data, { ...data, email: email });
  }

  //firstName
  {
    if (typeof firstName !== "string" || firstName.trim().length === 0) {
      ctx.status = 400;
      ctx.body = { msg: "firstName is not null and in string." };
      return;
    }
    firstName = firstName.trim();
    Object.assign(data, { ...data, firstName: firstName });
  }

  //password
  {
    if (password.trim().length === 0 || typeof password !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "password is not null and in string." };
      return;
    } else if (password.length < 6) {
      ctx.status = 400;
      ctx.body = { msg: "password length must be atleast 5." };
      return;
    }
    password = password.trim();
    Object.assign(data, { ...data, password: password });
  }

  //lastName
  if (lastName) {
    if (typeof lastName !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "lastName must be in string." };
      return;
    } else if (lastName.trim().length !== 0) {
      lastName = lastName.trim();
      Object.assign(data, { ...data, lastName: lastName });
    }
  }

  //mobileno
  if (mobileno) {
    if (typeof mobileno !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "mobileno must be in string." };
      return;
    } else if (regexMobileno.test(mobileno.trim()) === false) {
      ctx.status = 400;
      ctx.body = { msg: "enter mobile number in correct format." };
      return;
    } else {
      const findMobile = await findMobileno(mobileno.trim());
      if (findMobile) {
        ctx.status = 400;
        ctx.body = { msg: "mobileno must be unique." };
        return;
      }
    }
    mobileno = mobileno.trim();
    Object.assign(data, { ...data, mobileno: mobileno });
  }

  ctx.state.shared = data;

  await next();
};

const roleVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  const role = ctx.request.body.role || "admin";

  if (findemail && !findemail.owner) {
    ctx.status = 400;
    ctx.body = { msg: "only owner have access to invite other user." };
    return;
  } else if (
    !(
      (role && role.trim() === "admin") ||
      (role && role.trim() === "content-scheduler")
    )
  ) {
    ctx.status = 400;
    ctx.body = { msg: "enter correct role." };
    return;
  }
  await next();
};

const deleteVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  if (findemail) {
    const ownerID = findemail._id;
    ctx.state.shared = { ownerID };
  } else {
    ctx.status = 404;
    ctx.body = { msg: "user not found." };
    return;
  }
  await next();
};

const listVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;

  if (findemail.owner) {
    const ownerData = await findEmail(findemail.email);
    const invUser = await inviteUser(findemail._id);
    ctx.body = { ownerData, teammember: invUser };
  } else if (findemail.ownerdetails) {
    if (findemail.ownerdetails[0].role === "content-scheduler") {
      const conschedData = await contentData(
        findemail._id,
        "content-scheduler"
      );
      ctx.body = { contentscheduler: conschedData };
    } else if (findemail.ownerdetails[0].role === "admin") {
      const admData = await contentData(findemail._id, "admin");
      const invContentData = await findInvUsers(findemail._id);
      ctx.body = { admin: admData, contentscheduler: invContentData };
    }
  }
  await next();
};

const inviteVal = async (ctx, next) => {
  try {
    let { email, password, firstName, lastName, mobileno } = ctx.request.body;
    const access = ctx.request.body.access || false;
    let role = ctx.query.role;
    let data = {};
    let regexEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    let regexMobileno = /^[6-9]\d{9}$/gi;

    if (role && role.trim() === "content-scheduler") {
      if (!(access === true || access === false)) {
        ctx.status = 400;
        ctx.body = { msg: "give proper access." };
        return;
      }
    }

    // email

    if (!email || typeof email !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "email is compulsory,string & not null." };
      return;
    } else if (regexEmail.test(email.trim()) === false) {
      ctx.status = 400;
      ctx.body = { msg: "enter email in correct format." };
      return;
    } else {
      email = email.trim();
      const findemail = await findEmail(email);
      if (findemail) {
        ctx.status = 400;
        ctx.body = { msg: "email must be unique." };
        return;
      }
      Object.assign(data, { ...data, email });
    }

    //firstName
    {
      if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "firstName is compulsory,not null and in string." };
        return;
      }
      firstName = firstName.trim();
      Object.assign(data, { ...data, firstName: firstName });
    }

    //password
    {
      if (!password || typeof password !== "string" || !password.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "password is compulsory,not null and in string." };
        return;
      } else if (password.trim().length < 5) {
        ctx.status = 400;
        ctx.body = { msg: "password length must be atleast 5." };
        return;
      }
      password = password.trim();
      Object.assign(data, { ...data, password: password });
    }

    //lastName
    if (lastName) {
      if (typeof lastName !== "string") {
        ctx.status = 400;
        ctx.body = { msg: "lastName must be in string & not null." };
        return;
      } else if (!lastName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "lastName can not be empty." };
        return;
      }
      lastName = lastName.trim();
      Object.assign(data, { ...data, lastName: lastName });
    }

    //mobileno
    if (mobileno) {
      if (typeof mobileno !== "string") {
        //     ctx.status = 400;
        ctx.body = { msg: "mobileno must be in string." };
        return;
      } else if (regexMobileno.test(mobileno.trim()) === false) {
        ctx.status = 400;
        ctx.body = { msg: "enter mobile number in correct format." };
        return;
      } else {
        const findMobile = await findMobileno(mobileno.trim());
        if (findMobile) {
          ctx.status = 400;
          ctx.body = { msg: "mobileno must be unique." };
          return;
        }
      }
      mobileno = mobileno.trim();
      Object.assign(data, { ...data, mobileno: mobileno });
    }

    ctx.state.shared = data;
    ctx.state.access = access;

    await next();
  } catch (e) {
    console.log(e);
  }
};

const updateinvUserVal = async (ctx, next) => {
  try {
    let { email, password, firstName, lastName, mobileno } = ctx.request.body;
    let data = {};
    let regexEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    let regexMobileno = /^[6-9]\d{9}$/gi;
    const { findemail } = ctx.state.shared;

    if (findemail.ownerdetails[0].access !== true) {
      ctx.status = 401;
      ctx.body = { msg: "you don't have access to update." };
      return;
    }

    if (!email || typeof email !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "email is compulsory,string & not null." };
      return;
    } else if (regexEmail.test(email.trim()) === false) {
      ctx.status = 400;
      ctx.body = { msg: "enter email in correct format." };
      return;
    } else {
      email = email.trim();
      const findemail = await findEmail(email);
      if (findemail) {
        ctx.status = 400;
        ctx.body = { msg: "email must be unique." };
        return;
      }
      Object.assign(data, { ...data, email: email });
    }

    //firstName
    {
      if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "firstName is compulsory,not null and in string." };
        return;
      }
      firstName = firstName.trim();
      Object.assign(data, { ...data, firstName: firstName });
    }

    //password
    {
      if (!password || typeof password !== "string" || !password.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "password is compulsory,not null and in string." };
        return;
      } else if (password.trim().length < 6) {
        ctx.status = 400;
        ctx.body = { msg: "password length must be atleast 5." };
        return;
      }
      password = password.trim();
      Object.assign(data, { ...data, password: password });
    }

    //lastName
    if (lastName) {
      if (typeof lastName !== "string") {
        ctx.status = 400;
        ctx.body = { msg: "lastName must be in string & not null." };
        return;
      } else if (!lastName.trim()) {
        ctx.status = 400;
        ctx.body = { msg: "lastName can not be empty." };
        return;
      }
      lastName = lastName.trim();
      Object.assign(data, { ...data, lastName: lastName });
    }

    //mobileno
    if (mobileno) {
      if (typeof mobileno !== "string") {
        //     ctx.status = 400;
        ctx.body = { msg: "mobileno must be in string." };
        return;
      } else if (regexMobileno.test(mobileno.trim()) === false) {
        ctx.status = 400;
        ctx.body = { msg: "enter mobile number in correct format." };
        return;
      } else {
        const findMobile = await findMobileno(mobileno.trim());
        if (findMobile) {
          ctx.status = 400;
          ctx.body = { msg: "mobileno must be unique." };
          return;
        }
      }
      mobileno = mobileno.trim();
      Object.assign(data, { ...data, mobileno: mobileno });
    }

    ctx.state.data = { data };

    await next();
  } catch (e) {
    console.log(e);
  }
};

const deleteinvUserVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  if (findemail.ownerdetails[0].access !== true) {
    ctx.status = 401;
    ctx.body = { msg: "you don't have access to delete." };
    return;
  }
  await next();
};

module.exports = {
  registerVal,
  loginVal,
  updateUserVal,
  listVal,
  deleteVal,
  roleVal,
  inviteVal,
  updateinvUserVal,
  deleteinvUserVal,
};
