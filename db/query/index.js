const { on } = require("koa");
const mongo = require("../index");

const registerData = async (data) =>
  await mongo.db("blog").collection("blogcoll").insertOne(data);

const updateUserData = async (
  _id,
  firstName,
  lastName,
  password,
  email,
  updatedon
) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .updateOne(
      { _id },
      { $set: { firstName, lastName, password, email, updatedon } }
    );

const findMobileno = async (mobileno) =>
  await mongo.db("blog").collection("blogcoll").findOne({ mobileno });

const findEmail = async (email) =>
  await mongo.db("blog").collection("blogcoll").findOne({ email });

const findbyId = async (_id) =>
  await mongo.db("blog").collection("blogcoll").findOne({ _id });

const findbyIdPages = async (_id) =>
  await mongo.db("blog").collection("pages").findOne({ _id });

const findOwner = async () =>
  await mongo.db("blog").collection("blogcoll").find({ owner: true }).toArray();

const newUser = async (data) =>
  await mongo.db("blog").collection("blogcoll").insertOne(data);

const updatedata = async (email, ownerid, role) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .updateOne({ email }, { $push: { ownerdetails: { ownerid, role } } });

const deleteData = async (_id) =>
  await mongo.db("blog").collection("blogcoll").deleteOne({ _id });

const insertPage = async (data) =>
  await mongo.db("blog").collection("pages").insertOne(data);

const findPageNameQuery = async (pageName) =>
  await mongo.db("blog").collection("pages").findOne({ pageName });

const deletePagequery = async (_id) =>
  await mongo.db("blog").collection("pages").deleteOne({ _id });

const deletePageOwner = async (_id) =>
  await mongo.db("blog").collection("blogcoll").deleteOne({ _id });

const updatePagequery = async (_id, pageName, updatedOn) =>
  await mongo
    .db("blog")
    .collection("pages")
    .updateOne({ _id }, { $set: { pageName, updatedOn } });

const ascdescQuery = async (field) =>
  mongo.db("blog").collection("pages").find().sort(field).toArray();

const roleData = async () =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .aggregate({
      $lookup: {
        from: "pages",
        localfield: "ownerdetails",
        foreignfield: "pageaccess",
        as: "newId",
      },
    });

const findRole = async () =>
  await mongo.db("blog").collection("blogcoll").find().toArray();

const ownerData = async (_id) =>
  await mongo.db("blog").collection("blogcoll").findOne({ _id });

const findPages = async () =>
  await mongo.db("blog").collection("pages").find().toArray();

const findPageByOwnerid = async (userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .find({ pageaccess: { $elemMatch: { userid } } })
    .toArray();

const deletePage = async (userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .deleteMany({ pageaccess: { $elemMatch: { userid } } });

const inviteUser = async (_id) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .find(
      { ownerdetails: { $elemMatch: { ownerid: _id } } },
      { ownerdetails: 0 }
    )
    .toArray();

// const updateField = async (_id) =>
//   await mongo
//     .db("blog")
//     .collection("pages")
//     .updateMany(findPages{
//       $unset: { ownerdetails: { $elemMatch: { ownerid: _id } } },
//     });

const findInvUsers = async (_id) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .find({ ownerdetails: { $elemMatch: { ownerid: _id } } })
    .toArray();

const updateUserDetails = async (_id) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .updateMany(
      { ownerdetails: { $elemMatch: { ownerid: _id } } },
      { $pull: { ownerdetails: { ownerid: _id } }, $set: { noOwner: true } }
    );

const findPageById = async (_id) =>
  await mongo.db("blog").collection("pages").findOne({ _id });

const findPageByAccess = async (_id, userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .aggregate([
      {
        $match: { _id, pageaccess: { $elemMatch: { userid } } },
      },
      {
        $project: {
          _id: 0,
          // pageaccess: { $arrayElemAt: ["$pageaccess", 0] },
          pageaccess: 1,
        },
      },
    ])
    .toArray();

const emailOwner = async () =>
  await mongo.db("blog").collection("blogcoll").find({ owner: true }).toArray();

const insertMail = async (_id, data) =>
  await mongo
    .db("blog")
    .collection("pages")
    .updateOne({ _id }, { $push: { pageaccess: data } });

const findbyownerid = async (_id) =>
  await mongo
    .db("blog")
    .collection("pages")
    .findOne({ pageaccess: { $elemMatch: { userid: _id } } });

const delUserId = async (_id) =>
  await mongo
    .db("blog")
    .collection("pages")
    .deleteMany({ pageaccess: { $elemMatch: { userid: _id } } });

const delUserDetails = async (_id) =>
  await mongo
    .db("blog")
    .collection("pages")
    .updateMany(
      { pageaccess: { $elemMatch: { userid: _id } } },
      { $pull: { pageaccess: { userid: _id } } }
    );

const insertPageField = async (_id, data) =>
  await mongo
    .db("blog")
    .collection("pages")
    .updateOne(
      { ownerdetails: { $elemMatch: { userid: _id } } },
      { $push: { ownerdetails: { userid: _id } }, $set: { access: data } }
    );

const findbyownerdetails = async (_id) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .findOne({ ownerdetails: { $elemMatch: { ownerid: _id } } });

const contentData = async (_id, role) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .find({ _id }, { ownerdetails: { $elemMatch: { role } } })
    .toArray();

const addAccess = async (_id, access) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .updateOne({ _id }, { $push: { access } });

const changeDetails = async (
  _id,
  firstName,
  lastName,
  password,
  mobileno,
  email
) =>
  await mongo
    .db("blog")
    .collection("blogcoll")
    .updateOne(
      { _id },
      { $set: { firstName, lastName, password, mobileno, email } }
    );

const deleteUser = async (_id) =>
  await mongo.db("blog").collection("blogcoll").deleteOne({ _id });

const findRoleInPage = async (_id, userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .find({ _id }, { pageaccess: { $elemMatch: { userid } } })
    .toArray();

const updatepagedetails = async (_id, pageName) =>
  await mongo
    .db("blog")
    .collection("pages")
    .updateOne({ _id }, { $set: { pageName } });

const insertBlog = async (data) =>
  await mongo.db("blog").collection("blogdata").insertOne(data);

const findBlogById = async (_id) =>
  await mongo.db("blog").collection("blogdata").findOne({ _id });

const findRoleUser = async (userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .aggregate([
      {
        $project: {
          pageaccess: {
            $filter: {
              input: "$pageaccess",
              as: "result",
              cond: { $eq: ["$$result.userid", userid] },
            },
          },
        },
      },
    ])
    .toArray();

const updateBlogDetails = async (_id, blogName, blogDescription, updatedOn) =>
  await mongo
    .db("blog")
    .collection("blogdata")
    .updateOne({ _id }, { $set: { blogName, blogDescription, updatedOn } });

const deleteBlog = async (_id) =>
  await mongo.db("blog").collection("blogdata").deleteOne({ _id });

const pageBlogQuery = async (pageId) =>
  await mongo
    .db("blog")
    .collection("pages")
    .aggregate([
      {
        $match: { _id: pageId },
      },
      {
        $lookup: {
          from: "blogdata",
          localField: "_id",
          foreignField: "pageId",
          as: "blogs",
        },
      },
      {
        $unwind: "$blogs",
      },
      {
        $lookup: {
          from: "comment",
          localField: "blogs._id",
          foreignField: "blogId",
          as: "blogs.comments",
        },
      },
      {
        $unset: "blogs.comments.blogId",
      },
      {
        $project: {
          pageaccess: 0,
        },
      },
      {
        $unset: "blogs.pageId",
      },
    ])
    .toArray();

const findBlogByPageId = async (pageId) =>
  await mongo.db("blog").collection("blogdata").deleteMany({ pageId });

const insertComment = async (data) =>
  await mongo.db("blog").collection("comment").insertOne(data);

const findCommentById = async (_id) =>
  await mongo.db("blog").collection("comment").findOne({ _id });

const commentblogquery = async (_id) =>
  await mongo
    .db("blog")
    .collection("blogdata")
    .aggregate([
      {
        $lookup: {
          from: "comment",
          localField: "_id",
          foreignField: "blogId",
          as: "comment",
        },
      },
      {
        $match: { _id },
      },
    ])
    .toArray();

const blogPagequery = async (_id, userid) =>
  await mongo
    .db("blog")
    .collection("pages")
    .aggregate([
      {
        $lookup: {
          from: "blogdata",
          localField: "_id",
          foreignField: "pageId",
          as: "blogs",
        },
      },
      {
        $match: { _id },
      },
      // {
      //   $project: {
      //     pageaccess: {
      //       $filter: {
      //         input: "$pageaccess",
      //         as: "result",
      //         cond: { $eq: ["$$pageaccess.userid", userid] },
      //       },
      //     },
      //   },
      // },
    ])
    .toArray();

const filterPageAccess = async (_id) =>
  await mongo
    .db("blog")
    .collection("pages")
    .aggregate([
      {
        $filter: {
          input: "$pageaccess",
          as: "result",
          cond: { $eq: ["$$pageaccess.userid", _id] },
        },
      },
    ])
    .toArray();

const matchBlogid = async (_id, userid) =>
  await mongo
    .db("blog")
    .collection("blogdata")
    .aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "pages",
          localField: "pageId",
          foreignField: "_id",
          as: "pages2",
        },
      },
      {
        $unwind: "$pages2",
      },
      {
        $project: {
          pageaccess: {
            $filter: {
              input: "$pages2.pageaccess",
              as: "res",
              cond: { $eq: ["$$res.userid", userid] },
            },
          },
          _id: 0,
        },
      },
      {
        $unwind: "$pageaccess",
      },
    ])
    .toArray();

// const pageTable = async (_id) =>
//   await mongo
//     .db("blog")
//     .collection("pages")
//     .aggregate([
//       {
//         $lookup: {
//           from: "blogdata",
//           localField: "_id",
//           foreignField: "pageId",
//           as: "pages2",
//         },
//       },
//       {
//         $match: { _id },
//       },
//     ])
//     .toArray();

const updateComment = async (_id, comment, updatedBy) =>
  await mongo
    .db("blog")
    .collection("comment")
    .updateOne({ _id }, { $set: { comment, updatedBy } });

const deleteCommentById = async (_id) =>
  await mongo.db("blog").collection("comment").deleteOne({ _id });

module.exports = {
  registerData,
  // updateField,
  findMobileno,
  insertComment,
  findBlogByPageId,
  findCommentById,
  emailOwner,
  findEmail,
  filterPageAccess,
  inviteUser,
  findPages,
  findPageByOwnerid,
  findPageById,
  findbyId,
  updateUserData,
  findOwner,
  newUser,
  updatedata,
  insertPage,
  ownerData,
  deletePage,
  findInvUsers,
  deletePagequery,
  updatePagequery,
  findbyownerdetails,
  insertMail,
  findRole,
  deleteData,
  updateUserDetails,
  roleData,
  ascdescQuery,
  findbyownerid,
  findbyIdPages,
  findPageNameQuery,
  deletePageOwner,
  delUserId,
  delUserDetails,
  insertPageField,
  contentData,
  addAccess,
  changeDetails,
  deleteUser,
  findRoleInPage,
  updatepagedetails,
  insertBlog,
  findBlogById,
  findRoleUser,
  updateBlogDetails,
  deleteBlog,
  findPageByAccess,
  pageBlogQuery,
  commentblogquery,
  blogPagequery,
  // filterPageAccess,
  matchBlogid,
  // pageTable,
  updateComment,
  deleteCommentById,
};
