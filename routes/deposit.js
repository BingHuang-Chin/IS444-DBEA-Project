const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

router.post("/", async (req, res) => {
  res.json({ hello: "world" })
})
