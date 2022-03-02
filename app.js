const port = 8000;
const app = require("./index");

app.listen(port, () => {
  console.log(`listening to port no. ${port}`);
});
