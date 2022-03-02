const koa = require("koa");
const bodyparser = require("koa-bodyparser");
const router = require("./src/routers/index");
const router2 = require("./src/routers/page");
const router3 = require("./src/routers/blog");
const app = new koa();

app.use(bodyparser());
app.use(router.routes()).use(router.allowedMethods());
app.use(router2.routes()).use(router2.allowedMethods());
app.use(router3.routes()).use(router3.allowedMethods());

module.exports = app;
