const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")
const tBank = require("../lib/tbank-wrapper")
const Constant = require("../utils/constants")

// Withdraw e-credits and transfer into their account
router.post("/", async (req, res) => {
  let { accessToken, receivingAccount, withdrawAmount } = req.body
  let txRef = null

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  if (!receivingAccount)
  return res.json({ status: 400, message: "Receiving account not provided." })

  if (!withdrawAmount)
    return res.json({ status: 400, message: "Withdrawal amount not provided." })

  const user = await getUser(accessToken.userID)
  if (user.length === 0)
    return res.json({ status: 401, message: "Invalid user." })

  try {
    let { credits } = user[0]
    credits = parseFloat(credits)
    withdrawAmount = parseFloat(withdrawAmount)

    if (credits < withdrawAmount)
      return res.json({ status: 400, message: "Insufficient credits to withdraw." })

    await tBank.addBeneficiary(accessToken, { AccountID: accessToken.userID, Description: "Member of FastCash." })
    const { insertId } = await createTransactionHistory(accessToken.userID, Constant.merchantAccount, receivingAccount, withdrawAmount)
    txRef = insertId

    await tBank.transfer({
      accessToken,
      txRef,
      sourceAccount: Constant.merchantAccount,
      destAccount: receivingAccount,
      amount: withdrawAmount,
      description: "Withdraw from FastCash",
    })

    await updateTransactionHistory(2, txRef)
    await updateCredits(accessToken.userID, credits - withdrawAmount)

    return res.json({ status: 200, message: "Withdrawal successful." })
  } catch (e) {
    console.error(e)

    if (txRef)
      await updateTransactionHistory(3, txRef)

    if (e.customError)
      return res.json({ status: e.status, message: e.message })

    return res.json({ status: 500, message: "Internal server error" })
  }
})

async function getUser (userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM fc_user
    WHERE user_id = ?
  `, [userId])
}

async function updateCredits (userId, amount) {
  return mySql.handleQuery(`
    UPDATE fc_user
    SET
    credits = ?
    WHERE user_id = ?
  `, [amount, userId])
}

async function createTransactionHistory (userId, sourceAccount, destAccount, amount) {
  return mySql.handleQuery(`
    INSERT INTO transaction_history (user_id, source_account, dest_account, amount)
    VALUES
    (?, ?, ?, ?);
  `, [userId, sourceAccount, destAccount, amount])
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
