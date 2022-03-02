const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  findEmail,
  updatePagequery,
  insertPage,
  deletePagequery,
  ascdescQuery,
  findPageById,
  findPageOwnerDetails,
  insertMail,
  delUserDetails,
  updateUserDetails,
  updatepagedetails,
  pageBlogQuery,
} = require("../../db/query/index");

const createPage = async (ctx) => {
  const { findemail } = ctx.state.shared;
  const role = ctx.state.role;
  const userid = findemail._id;
  const date = new Date();
  const pageName = ctx.request.body.pageName;

  ctx.request.body = {
    _id: uuidv4(),
    pageName,
    createdOn: date,
    updatedOn: date,
    pageaccess: [{ userid, role }],
  };

  const insPage = await insertPage(ctx.request.body);
  ctx.body = { msg: "page inserted successfully.", details: insPage };
};

const updatePage = async (ctx, next) => {
  const _id = ctx.params._id;
  const { pageName } = ctx.request.body;
  const updatedOn = new Date();
  const updatePage = await updatePagequery(_id, pageName, updatedOn);
  ctx.body = {
    msg: "page updated successfully.",
    data: updatePage,
  };
};

const deletePage = async (ctx, next) => {
  const _id = ctx.params._id;
  const delPage = await deletePagequery(_id);
  ctx.body = {
    msg: "page deleted successfully.",
    data: delPage,
  };
};

const ascdscRoute = async (ctx, next) => {
  const { field, condition } = ctx.state.shared;

  const key = field,
    obj = {
      [key]: condition,
    };

  const ascdsc = await ascdescQuery({
    [key]: condition,
  });
  ctx.body = { msg: "data sorted successfully", data: ascdsc };
};

const listPageRoute = (ctx) => {
  const { findemail } = ctx.state.shared;
  // console.log(findemail);
  ctx.body = findemail;
};

const adduserRoute = async (ctx) => {
  let { userid, data, pageid } = ctx.state.data;
  data = { ...data, userid };
  const insertNewmail = await insertMail(pageid, data);
  ctx.body = { msg: "new owner inserted in page.", Response: insertNewmail };
};

const deluserRoute = async (ctx) => {
  const { ownerId } = ctx.state.shared;

  const deluserDetails = await delUserDetails(ownerId);
  ctx.body = {
    msg: "user details deleted successfully.",
    Response: deluserDetails,
  };
};

const csRoute = async (ctx) => {
  const _id = ctx.params.pageid;
  const pageName = ctx.request.body.pageName;
  const updatePageDetails = await updatepagedetails(_id, pageName);
  ctx.body = {
    msg: "page details updated successfully.",
    res: updatePageDetails,
  };
};

const viewPageRoute = async (ctx) => {
  // console.log("viewPageRoute");
  const { pageId } = ctx.state.pageId;
  const pageBlogDetails = await pageBlogQuery(pageId);
  ctx.body = pageBlogDetails;
};

module.exports = {
  createPage,
  updatePage,
  deletePage,
  ascdscRoute,
  adduserRoute,
  deluserRoute,
  listPageRoute,
  csRoute,
  viewPageRoute,
};
