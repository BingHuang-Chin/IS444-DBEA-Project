const express = require("express")
const { init: initMySql } = require("./lib/mysql-wrapper")

const authRouter = require("./routes/auth")
const depositRouter = require("./routes/deposit")
const loanRouter = require("./routes/loan")
const peerRouter = require("./routes/peer-lending")

const app = express()
const port = 3000

initMySql()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static("public"))

app.use("/api/auth", authRouter)
app.use("/api/deposit", depositRouter)
app.use("/api/loan", loanRouter)
app.use("/api/peer", peerRouter)

app.listen(port, () => console.log(`Application running at http://localhost:${port}`))
