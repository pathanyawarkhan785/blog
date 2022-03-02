// const mongo = require("../../db/index");
const jwt = require("jsonwebtoken");
const {
  findMobileno,
  findEmail,
  findbyIdPages,
  findRole,
  ascdescQuery,
  findPageNameQuery,
  emailOwner,
  findbyownerid,
  findPageById,
  delUserId,
  deletePage,
  updateUserDetails,
  delUserDetails,
  insertPageField,
  findRoleInPage,
  pageBlogQuery,
} = require("../../db/query");

const updateInviteVal = async (ctx, next) => {
  let { role } = ctx.request.body || "admin";
  role = role.trim();

  if (!(role === "admin" || role === "content-scheduler")) {
    ctx.status = 400;
    ctx.body = { msg: "enter correct role." };
    return;
  }
  await next();
};

const inviteVal = async (ctx, next) => {
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

const updateVal = async (ctx, next) => {
  await next();
};

const ascdscval = async (ctx, next) => {
  let field = (ctx.query.field && ctx.query.field.trim()) || "pageName";
  let order = (ctx.query.order && ctx.query.order.trim()) || "asc";
  const arr1 = ["createdOn", "updatedOn", "pageName"];

  const condition = order === "desc" ? -1 : 1;

  if (!arr1.includes(field)) {
    field = "pageName";
  }

  ctx.state.shared = { field, condition };

  await next();
};
const isCreatePage = async (ctx, next) => {
  // console.log("isCreatepage");
  let pageName = ctx.request.body.pageName;
  let role = "owner";
  const { findemail } = ctx.state.shared;

  if (!pageName || pageName.trim().length === 0) {
    ctx.status = 400;
    ctx.body = { msg: "page name is compulsory." };
    return;
  } else if (pageName && pageName.trim()) {
    if (typeof pageName !== "string") {
      ctx.status = 400;
      ctx.body = { msg: "page name must be a string." };
      return;
    }
  }

  if (!findemail.owner) {
    ctx.status = 401;
    ctx.body = {
      msg: "page can create only by owner.",
    };
    return;
  }

  ctx.state.role = role;

  await next();
};

const isUpdatepage = async (ctx, next) => {
  const _id = ctx.params._id;
  const findid = await findbyIdPages(_id);

  const { findemail } = ctx.state.shared;

  if (findid) {
    if (findemail._id !== findid.pageaccess[0].userid) {
      ctx.status = 401;
      ctx.body = {
        msg: "page can update only by owner.",
      };
      return;
    }
  } else {
    ctx.status = 400;
    ctx.body = { msg: "no data found." };
    return;
  }
  await next();
};

const isDeletePage = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  const _id = ctx.params._id;
  const findid = await findbyIdPages(_id);
  if (findemail._id !== findid.pageaccess[0].userid) {
    ctx.status = 401;
    ctx.body = {
      msg: "page can delete only by owner.",
    };
    return;
  }
  await next();
};

const adduserVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  const userid = findemail._id;
  const pageid = ctx.params.pageid;
  const findPage = await findPageById(pageid);
  let data = {};

  if (!findemail) {
    ctx.status = 404;
    return (ctx.body = { msg: "no user found." });
  }

  for (let i = 0; i < findPage.pageaccess.length; i++) {
    if (findPage.pageaccess[i].userid === userid) {
      ctx.status = 400;
      ctx.body = { msg: "owner already exists in pageaccess." };
      return;
    }
  }

  let role = ctx.request.body.role || "admin";

  if (role) {
    role = role.trim();
    if (!(role === "admin" || role === "content-scheduler")) {
      ctx.status = 400;
      ctx.body = { msg: "enter correct role." };
      return;
    } else if (role === "content-scheduler") {
      let access = ctx.request.body.access;
      if (access) {
        if (typeof access !== "boolean") {
          ctx.status = 400;
          ctx.body = { msg: "access value must be in boolean." };
          return;
        } else if (!(access === true || access === false)) {
          ctx.status = 400;
          ctx.body = { msg: "enter correct access." };
          return;
        }
      } else {
        access = false;
      }
      Object.assign(data, { ...data, access });
    }
  }

  Object.assign(data, { ...data, role });

  ctx.state.data = { userid, data, pageid };
  await next();
};

const deluserVal = async (ctx, next) => {
  const { findemail } = ctx.state.shared;
  const ownerId = findemail._id;

  const pageid = ctx.params.pageid;
  const findPage = await findPageById(pageid);
  for (let i = 0; i < findPage.pageaccess.length; i++) {
    if (findPage.pageaccess[i].userid === ownerId) {
      if (findPage.pageaccess[i].role === "owner") {
        const delPage = await deletePage(pageid);
        ctx.body = { msg: "page deleted successfully.", Response: delPage };
      }
    }
  }
  ctx.state.shared = { ownerId };
  await next();
};

const listPageVal = async (ctx, next) => {
  await next();
};

const csVal = async (ctx, next) => {
  const pageid = ctx.params.pageid;
  const findpage = await findPageById(pageid);
  const role = findpage[0].pageaccess[1].role;
  const access = findpage[0].pageaccess[1].access;
  // console.log(role, access);

  if (role === "content-scheduler") {
    if (!(access === false)) {
      ctx.status = 401;
      ctx.body = { msg: "you don't have access." };
      return;
    }
  }
  await next();
};

const viewPageVal = async (ctx, next) => {
  // console.log("viewPageVal");
  let pageId = ctx.params.pageId;
  pageId = pageId.trim();
  const pageDetails = await findPageById(pageId);
  if (!pageDetails) {
    ctx.status = 404;
    return (ctx.body = { msg: `no page found with this pageId : ${pageId}` });
  }
  ctx.state.pageId = { pageId };
  await next();
};

module.exports = {
  inviteVal,
  updateVal,
  isCreatePage,
  isUpdatepage,
  isDeletePage,
  ascdscval,
  adduserVal,
  deluserVal,
  updateInviteVal,
  listPageVal,
  csVal,
  viewPageVal,
};
