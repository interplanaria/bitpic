const bpu = require('bpu')
const bsv = require('bsv')
const Message = require('bsv/message')
const dns = require('dns')
const fetch = require('isomorphic-fetch')
const PaymailClient = require('@moneybutton/paymail-client')
const client = new PaymailClient.PaymailClient(dns, fetch)
const parse = {
  raw: (r) => {
    return r
  },
  bob: (r) => {
    return bpu.parse({
      tx: { r: r },
      transform: (o, c) => {
        if (c.buf && c.buf.byteLength > 512) {
          o.ls = o.s
          o.lb = o.b
          delete o.s
          delete o.b
        }
        return o
      },
      split: [
        { token: { s: "|" }, },
        { token: { op: 106 }, include: "l" }
      ]
    })
  }
}
const bitpic = async (tx, format) => {
  let result;
  if (!format || format === 'raw') {
    result = await parse.bob(tx)
  } else if (format === 'bob') {
    result = tx
  }
  for (let i=0; i<result.out.length; i++) {
    let o = result.out[i]
    try {
      if (o.tape[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut" &&
          o.tape[2] &&
          o.tape[2].cell.length === 4 &&
          o.tape[2].cell[0].s === "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p") {
        let bi;
        if (o.tape[1].cell[1].lb) {
          bin = o.tape[1].cell[1].lb;
        } else if (o.tape[1].cell[1].b) {
          bin = o.tape[1].cell[1].b;
        }
        if (bin) {
          const buf = Buffer.from(bin, "base64")
          const hash = bsv.crypto.Hash.sha256(buf).toString("hex")
          return {
            hash: hash,
            cell: o.tape[2].cell
          }
        } else {
          return null;
        }
      }
    } catch (e) {
      throw e;
    }
  }
  return null
}
const verify = {
  exec: async (tx, options) => {
    let format = (options ? options.format : undefined)
    let res = await bitpic(tx, format)
    if (res.cell && res.cell.length === 4) {
      const verified = await verify.user(res)
      if (verified) {
        if (options && options.cell) return res.cell
        else return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  user: async (res) => {
    const expected = res.cell[3].s
    const paymail = res.cell[1].s
    const pubkey = Buffer.from(res.cell[2].b, "base64").toString("hex")
    const paymailPubkMatch = await client.verifyPubkeyOwner(pubkey, paymail)
    const address = new bsv.PublicKey(pki).toAddress().toString()
    const hex = Buffer.from(res.hash, "hex")
    const verified = Message.verify(hex, address, expected)
    return (verified && paymailPubkMatch)
  },
}
module.exports = {
  verify: verify.exec,
  parse: parse,
  cell: bitpic
}
