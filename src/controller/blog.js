const {
  insertBlog,
  updateBlogDetails,
  deleteBlog,
  insertComment,
  updateComment,
  deleteCommentById,
} = require("../../db/query");
const { v4: uuidv4 } = require("uuid");

const blogCont = async (ctx) => {
  const { data } = ctx.state.data;
  const { pageDetails, ownerId } = ctx.state.data;
  const date = new Date();
  const pageId = pageDetails._id;
  const pageName = pageDetails.pageName;
  const { findemail } = ctx.state.shared;
  const createdBy = findemail._id;

  ctx.request.body = {
    _id: uuidv4(),
    ...data,
    pageId,
    pageName,
    createdBy,
    ownerId,
    createdOn: date,
    updatedOn: date,
  };

  const insertData = await insertBlog(ctx.request.body);
  ctx.body = { msg: "inserted successfully.", res: insertData };
};

const updateController = async (ctx) => {
  // console.log("updateController");
  const { blogId, data } = ctx.state.blogDetails;
  const updatedOn = new Date();
  const updateBlog = await updateBlogDetails(
    blogId,
    data.blogName,
    data.blogDescription,
    updatedOn
  );
  return (ctx.body = { msg: "blog updated successfully.", res: updateBlog });
};

const deleteController = async (ctx) => {
  // console.log("deleteController");
  const { blogId } = ctx.state.blogId;
  const delBlog = await deleteBlog(blogId);
  return (ctx.body = { msg: "blog deleted successfully.", res: delBlog });
};

const commentController = async (ctx) => {
  // console.log("commentController");
  const { blogId, comment } = ctx.state.data;
  const date = new Date();
  const { findemail } = ctx.state.shared;

  let data = { comment, blogId };
  data = {
    _id: uuidv4(),
    ...data,
    createdBy: findemail._id,
    createdOn: date,
    updatedOn: date,
  };

  const addComment = await insertComment(data);
  ctx.body = { msg: "comment added successfully.", res: addComment };
};

const updateComController = async (ctx) => {
  // console.log("updateComController");

  const { findemail } = ctx.state.shared;
  const { commentId, comment } = ctx.state.data;

  const updComment = await updateComment(commentId, comment, findemail._id);

  ctx.body = { msg: "comment updated successfully.", res: updComment };
};

const delComController = async (ctx) => {
  // console.log("deleComController");

  const { commentId } = ctx.state.data;
  const delComment = await deleteCommentById(commentId);

  ctx.body = { msg: "comment deleted successfully.", res: delComment };
};

module.exports = {
  blogCont,
  updateController,
  deleteController,
  commentController,
  updateComController,
  delComController,
};
