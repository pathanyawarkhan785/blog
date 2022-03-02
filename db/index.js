const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://ywr:ywr@cluster0.0yfeq.mongodb.net";
const mongoConnection = new MongoClient(url, {
  useUnifiedTopology: true,
});
if (process.env.NODE_ENV != "test") {
  mongoConnection
    .connect()
    .then(() => {
      console.log("database connected.");
    })
    .catch((e) => {
      console.log(e);
    });
}
module.exports = mongoConnection;
