const express = require("express")
const { init: initMySql } = require("./lib/mysql-wrapper")
const app = express()
const port = 3000

initMySql()

app.use(express.static("public"))

app.listen(port, () => console.log(`Application running at http://localhost:${port}`))
