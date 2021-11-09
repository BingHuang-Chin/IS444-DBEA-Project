const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

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

  res.json({ 
    status: 200,
    message: "Successfully registered with FastCash.",
    redirect: `/pages/${isLender ? "lender.html" : "borrower.html"}`
  })
})

module.exports = router

async function createUser(userId, isLender) {
  await mySql.handleQuery(`
    INSERT INTO fc_user (user_id, is_lender)
    VALUES
    (?, ?)
  `, [userId, JSON.parse(isLender)])
}
