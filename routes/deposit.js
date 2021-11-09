const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")
const tBank = require("../lib/tbank-wrapper")

router.post("/", async (req, res) => {
  const { accessToken, amount } = req.body
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    const { userID: userId } = accessToken
    const [user] = await getUser(userId)
    if (!user)
      return res.json({ status: 401, message: "Unauthorized access." })

    if (!amount || amount < 100)
      return res.json({ status: 400, message: "Deposit amount cannot be lower than $100." })

    await tBank.addBeneficiary(accessToken)

    const { credits: currentAmount } = user
    await updateCredits(userId, currentAmount, amount)
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: `Internal server error` })
  }

  return res.json({ status: 200, message: `Successfully deposited $${amount}.` })
})

module.exports = router

async function getUser (userId) {
  return mySql.handleQuery(`
    SELECT * 
    FROM fc_user
    WHERE user_id = ?
  `, [userId])
}

async function updateCredits (userId, currentAmount, topUpAmount) {
  return mySql.handleQuery(`
    UPDATE fc_user
    SET
    credits = ?
    WHERE user_id = ?
  `, [currentAmount + topUpAmount, userId])
}
