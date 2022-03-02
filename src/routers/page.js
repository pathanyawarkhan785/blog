const koaRouter = require("koa-router");
const router = new koaRouter({
  prefix: "/page",
});

const auth = require("../middleware/auth");

const {
  isCreatePage,
  isUpdatepage,
  isDeletePage,
  ascdscval,
  adduserVal,
  deluserVal,
  viewPageVal,
} = require("../validators/pageval");
const {
  createPage,
  updatePage,
  deletePage,
  ascdscRoute,
  adduserRoute,
  deluserRoute,
  viewPageRoute,
} = require("../controller/page");

router.post("/createpage", auth, isCreatePage, createPage);

router.patch("/updatepage/:_id", auth, isUpdatepage, updatePage);

router.delete("/deletepage/:_id", auth, isDeletePage, deletePage);

router.get("/ascdsc", ascdscval, ascdscRoute);

router.post("/adduser/:pageid", auth, adduserVal, adduserRoute);

router.delete("/deluser/:pageid", auth, deluserVal, deluserRoute);

router.get("/viewpage/:pageId", viewPageVal, viewPageRoute);

module.exports = router;
