const bitpic = require("../index");
const raw = require('./raw.json');
(async () => {
  const cell = await bitpic.cell(raw.tx)
  console.log(cell)
})();
