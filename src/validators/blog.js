const {
  findPageById,
  findBlogById,
  findbyownerid,
  findRoleInPage,
  findRoleUser,
  findPageByAccess,
  findCommentById,
  commentblogquery,
  blogPagequery,
  filteruserid,
  filterPageAccess,
  matchBlogid,
  pageTable,
} = require("../../db/query/index");

const blogVal = async (ctx, next) => {
  //   console.log("blogval");

  const { findemail } = ctx.state.shared;

  let data = {};
  let { blogName, blogDescription, pageId } = ctx.request.body;

  if (!pageId) {
    ctx.status = 400;
    return (ctx.body = { msg: "pageId is compulsory." });
  } else if (pageId) {
    pageId = pageId.trim();
    var pageDetails = await findPageById(pageId);
    var pageaccess = pageDetails.pageaccess;
    var arr = [];
    pageaccess.forEach((e) => {
      arr.push(e.userid);
    });
    if (!arr.includes(findemail._id)) {
      ctx.status = 401;
      return (ctx.body = { msg: `you are not team member of this page.` });
    }
  }

  for (let i = 0; i < pageaccess.length; i++) {
    const role = pageaccess[i].role;
    if (role === "owner") {
      var ownerId = pageaccess[i].userid;
    }
  }

  // if (access.role === "owner") {
  // }
  if (!blogName) {
    // console.log(pageaccess);

    ctx.status = 400;
    return (ctx.body = { msg: "blogName is compulsory." });
  } else if (blogName) {
    blogName = blogName.trim();
    if (typeof blogName !== "string") {
      ctx.status = 400;
      return (ctx.body = { msg: "blogName must be in string." });
    } else if (blogName.length < 5) {
      ctx.status = 400;
      return (ctx.body = {
        msg: "blogName length must be greater than 5 letter.",
      });
    }
  }

  Object.assign(data, { ...data, blogName });

  if (blogDescription) {
    blogDescription = blogDescription.trim();
    if (typeof blogDescription !== "string") {
      ctx.status = 400;
      return (ctx.body = { msg: "blogDescription must be in string." });
    } else if (blogDescription.length < 10) {
      ctx.status = 400;
      return (ctx.body = {
        msg: "blogDescription length must be greater than 10 letter.",
      });
    }
    Object.assign(data, { ...data, blogDescription });
  }

  ctx.state.data = { data, pageDetails, ownerId };

  await next();
};

const updateVal = async (ctx, next) => {
  // console.log("updateVal");
  let data = {};
  const blogId = ctx.params.blogId;
  let { blogName, blogDescription } = ctx.request.body;
  const { findemail } = ctx.state.shared;

  if (!blogName) {
    ctx.status = 400;
    return (ctx.body = { msg: "blogName is compulsory." });
  } else if (blogName) {
    blogName = blogName.trim();
    if (typeof blogName !== "string") {
      ctx.status = 400;
      return (ctx.body = { msg: "blogName must be in string." });
    } else if (blogName.length < 5) {
      ctx.status = 400;
      return (ctx.body = {
        msg: "blogName length must be greater than 5 letter.",
      });
    }
  }

  Object.assign(data, { ...data, blogName });

  if (blogDescription) {
    blogDescription = blogDescription.trim();
    if (typeof blogDescription !== "string") {
      ctx.status = 400;
      return (ctx.body = { msg: "blogDescription must be in string." });
    } else if (blogDescription.length < 10) {
      ctx.status = 400;
      return (ctx.body = {
        msg: "blogDescription length must be greater than 10 letter.",
      });
    }
    Object.assign(data, { ...data, blogDescription });
  }

  if (blogId) {
    var blogExist = await findBlogById(blogId);
    if (!blogExist) {
      ctx.status = 404;
      return (ctx.body = { msg: `no blog found with this blogId : ${blogId}` });
    }
  }

  const findPageAccess = await findPageByAccess(
    blogExist.pageId,
    findemail._id
  );

  if (!findPageAccess[0]) {
    ctx.status = 401;
    return (ctx.body = { msg: "you are not team member of this page." });
  }

  const pageaccess = findPageAccess[0].pageaccess;
  pageaccess.forEach((e) => {
    if (e.userid === findemail._id) {
      if (e.role === "content-scheduler") {
        if (e.access !== true) {
          ctx.status = 401;
          return (ctx.body = {
            msg: "you have not access to update this blog.",
          });
        }
      } else if (e.role === "admin" || e.role === "owner") {
        if (!(e.role === "admin" || e.role === "owner")) {
          ctx.status = 401;
          return (ctx.body = {
            msg: "you have not access to update this blog.",
          });
        }
      }
    }
  });

  ctx.state.blogDetails = { data, blogId };

  await next();
};

const deleteVal = async (ctx, next) => {
  // console.log("deleteVal");
  const { findemail } = ctx.state.shared;
  const blogId = ctx.params.blogId;
  if (blogId) {
    var blogExist = await findBlogById(blogId);
    if (!blogExist) {
      ctx.status = 404;
      return (ctx.body = { msg: `no blog found for this blogId : ${blogId}` });
    }
  }

  const findPageAccess = await findPageByAccess(
    blogExist.pageId,
    findemail._id
  );

  if (!findPageAccess[0]) {
    ctx.status = 401;
    return (ctx.body = { msg: "you are not team member of this page." });
  }
  const pageaccess = findPageAccess[0].pageaccess;
  pageaccess.forEach((e) => {
    if (e.userid === findemail._id) {
      if (e.role === "content-scheduler") {
        if (e.access !== true) {
          ctx.status = 401;
          return (ctx.body = {
            msg: "you have not access to delete this blog.",
          });
        }
      } else if (e.role === "admin" || e.role === "owner") {
        if (!(e.role === "admin" || e.role === "owner")) {
          ctx.status = 401;
          return (ctx.body = {
            msg: "you have not access to delete this blog.",
          });
        }
      }
    }
  });

  ctx.state.blogId = { blogId };

  await next();
};

const commentVal = async (ctx, next) => {
  try {
    // console.log("commentVal");

    let { comment } = ctx.request.body;
    comment = comment.trim();

    if (!comment) {
      ctx.status = 400;
      return (ctx.body = { msg: "comment is compulsory." });
    }

    let { blogId } = ctx.params;
    blogId = blogId.trim();

    const findBlog = await findBlogById(blogId);
    if (!findBlog) {
      ctx.status = 404;
      return (ctx.body = { msg: `no blog found with this blogId : ${blogId}` });
    }

    ctx.state.data = { comment, blogId };

    await next();
  } catch (e) {
    console.log(e);
  }
};

const updateComVal = async (ctx, next) => {
  try {
    // console.log("updateComVal");

    let { comment } = ctx.request.body;
    comment = comment.trim();

    if (!comment) {
      ctx.status = 400;
      return (ctx.body = { msg: "comment is compulsory." });
    }

    let { commentId } = ctx.params;
    commentId = commentId.trim();

    const commentDetails = await findCommentById(commentId);
    if (!commentDetails) {
      ctx.status = 404;
      return (ctx.body = {
        msg: `no comment found with this commentId : ${commentId}`,
      });
    }

    const userId = commentDetails.createdBy;
    const { findemail } = ctx.state.shared;
    const _id = findemail._id;
    const blogId = commentDetails.blogId;
    // console.log(_id);

    if (userId !== _id) {
      const blogidMatch = await matchBlogid(blogId, _id);

      if (blogidMatch[0]) {
        if (blogidMatch[0].pageaccess.role === "content-scheduler") {
          if (blogidMatch[0].pageaccess.access !== true) {
            ctx.status = 401;
            return (ctx.body = {
              msg: "you have not access to update this comment.",
            });
          }
        }
      } else {
        ctx.status = 400;
        return (ctx.body = { msg: "you are not team member of this page." });
      }
    }

    ctx.state.data = { commentId, comment };

    await next();
  } catch (e) {
    console.log(e);
  }
};

const delComVal = async (ctx, next) => {
  try {
    // console.log("delComVal");

    let { commentId } = ctx.params;
    commentId = commentId.trim();

    const commentDetails = await findCommentById(commentId);
    if (!commentDetails) {
      ctx.status = 404;
      return (ctx.body = {
        msg: `no comment found with this commentId : ${commentId}`,
      });
    }

    const userId = commentDetails.createdBy;
    const { findemail } = ctx.state.shared;
    const _id = findemail._id;
    const blogId = commentDetails.blogId;

    if (userId !== _id) {
      const blogidMatch = await matchBlogid(blogId, _id);

      if (blogidMatch[0]) {
        if (blogidMatch[0].pageaccess.role === "content-scheduler") {
          if (blogidMatch[0].pageaccess.access !== true) {
            ctx.status = 401;
            return (ctx.body = {
              msg: "you have not access to update this comment.",
            });
          }
        }
      } else {
        ctx.status = 400;
        return (ctx.body = { msg: "you are not team member of this page." });
      }
    }

    ctx.state.data = { commentId };

    await next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  blogVal,
  updateVal,
  deleteVal,
  commentVal,
  updateComVal,
  delComVal,
};
