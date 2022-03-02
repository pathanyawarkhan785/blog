const koaRouter = require("koa-router");
const router = new koaRouter();

const {
  registerRoute,
  loginRoute,
  updateUserRoute,
  listRoute,
  inviteRoute,
  acceptRoute,
  // invite2Route,
  // accept2Route,
  updatelinkRoute,
  updateRoute,
  deleteRoute,
  updteUserRoute,
  deleteUserRoute,
} = require("../controller/index");

const auth = require("../middleware/auth");

const {
  registerVal,
  loginVal,
  updateUserVal,
  listVal,
  deleteVal,
  roleVal,
  inviteVal,
  updateinvUserVal,
  deleteinvUserVal,
} = require("../validators/index");
const {
  // inviteVal,
  updateInviteVal,
  // updateVal,
  isOwner,
} = require("../validators/pageval");

router.post("/register", registerVal, registerRoute);

router.post("/login", loginVal, loginRoute);

router.patch("/owner/update/:_id", auth, updateUserVal, updateUserRoute);

router.delete("/owner/delete", auth, deleteVal, deleteRoute);

router.get("/listuser", auth, listVal, listRoute);

router.post("/invite", auth, roleVal, inviteRoute);

router.post("/invite/accept", inviteVal, acceptRoute);

router.patch("/updateuser", auth, updateinvUserVal, updteUserRoute);

router.delete("/deleteuser", auth, deleteinvUserVal, deleteUserRoute);

router.post("/updateinvite", auth, updateInviteVal, updatelinkRoute);

router.patch("/updateinvite/accept", auth, updateRoute);

module.exports = router;
