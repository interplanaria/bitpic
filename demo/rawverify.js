const bitpic = require("../index");
const raw = require('./raw.json');
(async () => {
  const verified = await bitpic.verify(raw.tx)
  console.log(verified)
})();
