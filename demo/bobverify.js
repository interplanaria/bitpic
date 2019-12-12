const bitpic = require("../index");
const raw = require('./raw.json');
const bob = require('./bob');
(async () => {
  const parsed = await bob(raw.tx)
  console.log("parsed = ", parsed)
  const verified = await bitpic.verify(parsed, { format: "bob" })
  console.log(verified)
})();
