const raw = require('./raw.json')
const bitpic = require('../index')
const parse = () => {
  return bitpic.parse.bob(raw.tx)
}
module.exports = parse
