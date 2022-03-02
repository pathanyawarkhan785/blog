const {
  registerData,
  newUser,
  findEmail,
  updatedata,
  findOwner,
  findbyId,
  findRole,
  updateUserData,
  deleteData,
  roleData,
  deletePagequery,
  ownerData,
  findPages,
  deletePage,
  deletePageOwner,
  inviteUser,
  updateField,
  findInvUsers,
  noOwnerQuery,
  updateUserDetails,
  findbyownerdetails,
  changeDetails,
  deleteUser,
  findPageByAccess,
  findPageByOwnerid,
  deleteBlog,
  findBlogById,
  findBlogByPageId,
} = require("../../db/query/index");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Db } = require("mongodb");

const registerRoute = async (ctx) => {
  const data = ctx.state.shared;
  const date = new Date();
  ctx.state.shared = {
    ...ctx.state.shared,
    _id: uuidv4(),
    createdon: date,
    updatedon: date,
    owner: true,
  };
  const getData = await registerData(ctx.state.shared);
  let message = "data not found";
  if (getData) {
    message = jwt.sign(
      { email: ctx.request.body.email },
      "1234567890123456789012345678901234567890",
      {
        expiresIn: "24h",
      }
    );
  }
  ctx.body = { msg: "registered successfully", token: message };
};

const loginRoute = async (ctx) => {
  const { email, mobileno } = ctx.state.shared;
  if (email || mobileno) {
    const token = jwt.sign(
      { email },
      "1234567890123456789012345678901234567890",
      {
        expiresIn: "1d",
      }
    );
    ctx.body = {
      token,
    };
  }
};

const updateUserRoute = async (ctx) => {
  const _id = ctx.params._id;
  const updatedon = new Date();
  // let findData = await findbyId(_id);
  const { email, password, lastName, firstName } = ctx.request.body;
  let getData = await updateUserData(
    _id,
    firstName,
    lastName,
    password,
    email,
    updatedon
  );
  ctx.body = { msg: "updated successfully.", response: getData };
};

const deleteRoute = async (ctx) => {
  const { ownerID } = ctx.state.shared;

  const pageData = await findPageByOwnerid(ownerID);
  if (pageData[0]) {
    const deleteOwnerPage = await deletePage(ownerID);
  }

  const findData = await findInvUsers(ownerID);
  if (findData[0]) {
    const updateUserdetails = await updateUserDetails(ownerID);
  }

  pageData.forEach(async (e) => {
    const deletepageBlog = await findBlogByPageId(e._id);
  });

  const deleteUser = await deletePageOwner(ownerID);
  ctx.body = { msg: "owner deleted successfully.", response: deleteUser };
};

const inviteRoute = async (ctx) => {
  const token = ctx.headers.authorization;
  const role = ctx.request.body.role;
  const url = `http://localhost:8000/invite/accept?token=${token}&role=${role}`;
  return (ctx.body = {
    success: true,
    url,
  });
};

const acceptRoute = async (ctx) => {
  const data = ctx.state.shared;
  const access = ctx.state.access;
  const token = ctx.query.token;
  const verify = jwt.verify(token, "1234567890123456789012345678901234567890");
  const email = await findEmail(verify.email);
  const _id = email._id;
  const role = ctx.query.role;

  const userDetails = {
    _id: uuidv4(),
    ...data,
    ownerdetails: [{ ownerid: _id, role, access }],
  };

  const userData = await newUser(userDetails);

  ctx.body = {
    msg: "new user registered.",
    userData,
  };
};

const invite2Route = async (ctx) => {
  const token = ctx.headers.authorization;
  const role = ctx.request.body.role;
  const url = `http://localhost:8000/invite2/accept?token=${token}&role=${role}`;
  return (ctx.body = {
    success: true,
    url,
  });
};

const accept2Route = async (ctx, next) => {
  // ctx.request.body = {
  //   ...ctx.request.body,
  //   _id: uuidv4(),
  // };
  // console.log("accept2Route");
  const token = ctx.query.token;
  const role = ctx.query.role;
  // console.log(`token : ${token}`);
  // const email = ctx.state.email;
  // console.log(email);
  const verify = jwt.verify(token, "1234567890123456789012345678901234567890");
  // console.log(verify.email);
  // console.log(token);
  // console.log(ctx.request.body.email);
  const data = await findEmail(verify.email.trim());
  console.log(data);

  // console.log(email.ownerdetails.length);
  // console.log(data._id);
  // console.log(data);
  // console.log(data.ownerdetails);
  // if(ownerdetails)
  // console.log(data);
  if (data) {
    ctx.request.body = {
      ...ctx.request.body,
      ownerdetails: [{ ownerid: data._id, role }],
      _id: uuidv4(),
    };
    // console.log(ctx.request.body);
    // console.log((ownerId = data._id));
    const insData = await newUser(ctx.request.body);
    // ctx.body = {
    //   msg: "new user registered",
    //   insData,
    // };
  }
};

const updatelinkRoute = async (ctx, next) => {
  const token = ctx.headers.authorization;
  const role = ctx.request.body.role;
  const url = `localhost:8000/updateinvite/accept?token=${token}&role=${role}`;
  ctx.body = {
    success: true,
    url,
  };
};

const updateRoute = async (ctx, next) => {
  const role = ctx.query.role;
  const { findemail } = ctx.state.shared;
  const { email } = ctx.request.body;
  for (let i = 0; i < findemail.ownerdetails[0].length; i++) {
    if (findemail._id === finduseremail.ownerdetails[i].ownerid) {
      ctx.status = 400;
      ctx.body = { msg: "owner already invited this user." };
      return;
    }
  }
  const updateField = await updatedata(findemail.email, findemail._id, role);
  ctx.body = { msg: "updated successfully", response: updateField };
};

const listRoute = async (ctx) => {};

const updteUserRoute = async (ctx) => {
  const { findemail } = ctx.state.shared;
  const { data } = ctx.state.data;
  const updateDetails = await changeDetails(
    findemail._id,
    data.firstName,
    data.lastName,
    data.password,
    data.mobileno,
    data.email
  );
  ctx.body = { updatedData: updateDetails };
};

const deleteUserRoute = async (ctx) => {
  const { findemail } = ctx.state.shared;
  const delUser = deleteUser(findemail._id);
  ctx.body = { msg: "user deleted successfully.", res: delUser };
};

module.exports = {
  registerRoute,
  loginRoute,
  updateUserRoute,
  inviteRoute,
  acceptRoute,
  invite2Route,
  accept2Route,
  updatelinkRoute,
  updateRoute,
  deleteRoute,
  listRoute,
  updteUserRoute,
  deleteUserRoute,
};
