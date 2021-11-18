const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

router.get("/user", async (req, res) => {
  let { accessToken } = req.query
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorised access." })

  try {
    accessToken = JSON.parse(accessToken)
    const users = await getUser(accessToken.userID)
    if (users.length === 0)
      return res.json({ status: 401, message: "Unauthorised access." })

    return res.json({ status: 200, data: users[0] })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

router.post("/login", async (req, res) => {
  let { accessToken, isLender } = req.body
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorised access." })

  const { userID: userId } = accessToken
  const results = await mySql.handleQuery(`
    SELECT * FROM fc_user
    WHERE user_id = ?
  `, [userId])

  if (results.length === 0)
    await createUser(userId, isLender)
  else {
    const { is_lender } = results[0]
    isLender = is_lender
  }

  if (typeof isLender === "string")
    isLender = isLender === "true"

  res.json({
    status: 200,
    message: "Successfully registered with FastCash.",
    redirect: `/pages/${isLender ? "lender.html" : "borrower.html"}`
  })
})

async function getUser(userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM fc_user
    WHERE user_id = ?
  `, [userId])
}

async function createUser(userId, isLender) {
  await mySql.handleQuery(`
    INSERT INTO fc_user (user_id, is_lender)
    VALUES
    (?, ?)
  `, [userId, JSON.parse(isLender)])
}

module.exports = router
