const bitpic = require("../index");
const raw = require('./raw.json');
const bob = require('./bob');
(async () => {
  const parsed = await bob(raw.tx)
  console.log("parsed = ", parsed)
  const cell = await bitpic.cell(parsed, "bob")
  console.log(cell)
})();
