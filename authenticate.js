const jwt = require('jsonwebtoken');
const fs = require('fs');

const getKeys = () => {
  let rawdata = fs.readFileSync('authorized.json');
  let data = JSON.parse(rawdata);
  return data.map((e) => e.key)
}

let keys = getKeys()
console.log(keys)

const validateToken = (token) => {
  for (const key of keys) {
    try {
      let tokenPayload = jwt.verify(token, key)
      // console.log(tokenPayload)
      if (tokenPayload.sub = "open") {
        return true
      }
    }
    catch { }
  }
  console.log("invalid token")
  return false
}

module.exports = validateToken;