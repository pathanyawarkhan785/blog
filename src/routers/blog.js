const koarouter = require("koa-router");
const router = new koarouter({
  prefix: "/blog",
});

const auth = require("../middleware/auth");
const {
  blogVal,
  updateVal,
  deleteVal,
  commentVal,
  updateComVal,
  delComVal,
} = require("../validators/blog");
const {
  blogCont,
  updateController,
  deleteController,
  commentController,
  updateComController,
  delComController,
} = require("../controller/blog");

router.post("/create", auth, blogVal, blogCont);

router.post("/addcomment/:blogId", auth, commentVal, commentController);

router.patch(
  "/updatecomment/:commentId",
  auth,
  updateComVal,
  updateComController
);

router.patch("/update/:blogId", auth, updateVal, updateController);

router.delete("/delete/:blogId", auth, deleteVal, deleteController);

router.delete("/deletecomment/:commentId", auth, delComVal, delComController);

module.exports = router;
