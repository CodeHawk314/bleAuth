const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

const validateToken = require('./authenticate')

const allowedOrigins = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('DormPass is on!')
})

app.post('/unlock', (req, res) => {
  let token = req.headers.authorization.slice(7)
  // console.log(token)
  // console.log(req.body)
  if (validateToken(token)) {
    console.log("AUTHENTICATED! via web")
    res.json({ status: "unlocking" });

  } else {
    console.log("UNAUTHORIZED")
    res.json({ status: "unauthorized" });
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log("express server listening on port 3000")
})