const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")
const tBank = require("../lib/tbank-wrapper")
const Constant = require("../utils/constants")

router.post("/", async (req, res) => {
  const { accessToken, amount, account: sourceAccount } = req.body
  let txRef = null

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    const { userID: userId } = accessToken
    const [user] = await getUser(userId)
    if (!user)
      return res.json({ status: 401, message: "Unauthorized access." })

    if (!amount || amount < 100)
      return res.json({ status: 400, message: "Deposit amount cannot be lower than $100." })

    if (!sourceAccount)
      return res.json({ status: 400, message: "No source account id provided." })

    await tBank.addBeneficiary(accessToken)
    const { insertId } = await createTransactionHistory(sourceAccount, Constant.merchantAccount, amount)
    txRef = insertId

    await tBank.transfer({
      accessToken,
      amount,
      txRef,
      sourceAccount,
      description: "Deposit to FastCash",
    })

    const { credits: currentAmount } = user
    await updateTransactionHistory(2, txRef)
    await updateCredits(userId, currentAmount, amount)
  } catch (e) {
    console.error(JSON.stringify(e))

    if (txRef)
      await updateTransactionHistory(3, txRef)

    if (e.customError)
      return res.json({ status: e.status, message: e.message })

    return res.json({ status: 500, message: `Internal server error` })
  }

  return res.json({ status: 200, message: `Successfully deposited $${amount}.` })
})

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
    WHERE user_id = ?;
  `, [currentAmount + topUpAmount, userId])
}

async function createTransactionHistory (sourceAccount, destAccount, amount) {
  return mySql.handleQuery(`
    INSERT INTO transaction_history (source_account, dest_account, amount)
    VALUES
    (?, ?, ?);
  `, [sourceAccount, destAccount, amount])
}

async function updateTransactionHistory (statusCode, txRef) {
  return mySql.handleQuery(`
    UPDATE transaction_history
    SET
    transaction_status = ?
    WHERE id = ?;
  `, [statusCode, txRef])
}

module.exports = router
