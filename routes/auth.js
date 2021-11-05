const express = require("express")
const router = express.Router()

router.post("/login", (req, res) => {
  res.json({ hello: "world" })
})

module.exports = router
