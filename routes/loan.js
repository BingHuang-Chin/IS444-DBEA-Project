const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

/**
 * Retrieves loans which belongs to the user
 */
router.get("/", async (req, res) => {
  let { accessToken } = req.query
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    accessToken = JSON.parse(accessToken)
    const loans = await getLoansByUser(accessToken.userID)
    return res.json({ status: 200, data: loans })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

/**
 * Borrowers requests loans from lender
 */
router.post("/request", async (req, res) => {
  res.json({ initial: "implementation " })
})

/**
 * Lenders approve a loan request
 */
router.post("/request/:id/approve", async (req, res) => {
  res.json({ initial: "implementation " })
})

/**
 * Lenders reject a loan request
 */
router.post("/request/:id/reject", async (req, res) => {
  res.json({ initial: "implementation " })
})

/**
 * Borrowers repay loans one-shot
 */
router.post("/repay", async (req, res) => {
  res.json({ initial: "implementation " })
})

async function getLoansByUser (userId) {
  return mySql.handleQuery(`
    SELECT loans.id, user_id, loan_amount, title as loan_status, loaned_by, payment_duration, due_date, interest
    FROM loans
    INNER JOIN loan_status
    ON loan_status = loan_status.id
    WHERE user_id = ?
    ORDER BY loans.id asc;
  `, [userId])
}

module.exports = router
