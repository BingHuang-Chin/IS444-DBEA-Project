const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

router.get("/history", async (req, res) => {
  let { accessToken } = req.query
  if (!accessToken)
    return res.json({ status: 200, message: "Unauthorized access." })

  try {
    accessToken = JSON.parse(accessToken)
    const transactions = await getTransactionHistory(accessToken.userID)
    return res.json({ status: 200, data: transactions })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

function getTransactionHistory (userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM transaction_history
    WHERE user_id = ?
    ORDER BY id DESC
  `, [userId])
}

module.exports = router