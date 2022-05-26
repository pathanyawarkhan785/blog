const jwt = require("jsonwebtoken");
const { findEmail } = require("../../db/query");

const auth = async (ctx, next) => {
  try {
    // console.log("auth");
    const token = ctx.headers.authorization;
    const verify = jwt.verify(
      token,
      "1234567890123456789012345678901234567890"
    );

    const oldEmail = verify.email;
    const findemail = await findEmail(oldEmail);

    ctx.state.shared = { findemail };
    await next();
  } catch (e) {
    ctx.body = e;
    // console.log(e);
  }
};

module.exports = auth;
