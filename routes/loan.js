const express = require("express")
const router = express.Router()
const { DateTime } = require("luxon")
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

router.get("/current", async (req, res) => {
  let { accessToken } = req.query
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    accessToken = JSON.parse(accessToken)
    const loans = await getOfferedLoans(accessToken.userID)
    if (loans.length === 0)
      return res.json({ status: 200, data: null })

    return res.json({ status: 200, data: loans[0] })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

/**
 * Borrowers requests loans from lender
 * paymentDuration - contains months where the borrower wants to payback the loaned amount.
 */
router.post("/request", async (req, res) => {
  let { accessToken, peerListingId, paymentDuration } = req.body
  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  const user = await getUser(accessToken.userID)
  if (user.length === 0)
    return res.json({ status: 401, message: "Invalid user." })

  if (user[0].is_lender)
    return res.json({ status: 400, message: "Cannot request a loan as you are a lender." })

  if (!peerListingId)
    return res.json({ status: 400, message: "Invalid peer listing." })

  if (!paymentDuration || paymentDuration < 1)
    return res.json({ status: 400, message: "Payment duration cannot be lower than 1 month." })

  try {
    const peerListing = await getPeerListing(peerListingId)
    if (peerListing.length === 0)
      return res.json({ status: 400, message: "Invalid peer listing." })

    const offeredLoans = await getOfferedLoans(accessToken.userID)
    if (offeredLoans.length > 0)
      return res.json({ status: 400, message: "You have already been offered a loan, please repay before borrowing again." })

    const { commited_amount, interest_rate, listed_by } = peerListing[0]
    const dueDate = DateTime.now().plus({ months: paymentDuration })
    await createLoan({
      peerListingId,
      paymentDuration,
      dueDate: dueDate.toISO(),
      interest: interest_rate,
      loanAmount: commited_amount,
      borrowBy: accessToken.userID,
      loanBy: listed_by
    })

    res.json({ status: 200, message: "Loan successfully requested." })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

/**
 * Lenders approve a loan request
 */
router.post("/request/:id/approve", async (req, res) => {
  let { accessToken } = req.body
  const { id } = req.params

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    const loans = await getLoans(id)
    if (loans.length === 0)
      return res.json({ status: 400, message: "Invalid loan." })

    const { peer_listing_id } = loans[0]
    const peerListing = await getPeerListing(peer_listing_id)
    const { listed_by, commited_amount } = peerListing[0]

    let [loaner, borrower] = await Promise.all([
      getUser(listed_by),
      getUser(accessToken.userID)
    ])
    const { user_id: loanerUserId, credits: loanerCredits } = loaner[0]
    const { user_id: borrowerUserId, credits: borrowerCredits } = borrower[0]

    if (loanerCredits < commited_amount)
      return res.json({ status: 400, message: "Insufficient credits to loan." })

    await acceptLoan(id, peer_listing_id)
    await deletePeerListing(peer_listing_id)
    await transferFastCashCredits({
      sourceUserId: loanerUserId,
      destUserId: borrowerUserId,
      sourceFinalAmount: loanerCredits - commited_amount,
      destFinalAmount: borrowerCredits + commited_amount
    })

    return res.json({ status: 200, message: "Successfully accepted loan." })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
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

async function getUser (userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM fc_user
    WHERE user_id = ?
  `, [userId])
}

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

async function getOfferedLoans (userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM loans
    WHERE loan_status = 2
    AND user_id = ?
  `, [userId])
}

async function getPeerListing (peerListingId) {
  return mySql.handleQuery(`
    SELECT *
    FROM peer_listing
    WHERE id = ?
  `, [peerListingId])
}

async function deletePeerListing (peerListingId) {
  return mySql.handleQuery(`
    DELETE FROM peer_listing
    WHERE id = ?
  `, [peerListingId])
}

async function getLoans (loanId) {
  return mySql.handleQuery(`
    SELECT *
    FROM loans
    WHERE id = ?
    AND loan_status = 1
  `, [loanId])
}

async function createLoan ({ peerListingId, interest, paymentDuration, loanBy, loanAmount, borrowBy, dueDate }) {
  return mySql.handleQuery(`
    INSERT INTO loans (user_id, loan_amount, loan_status, loaned_by, payment_duration, due_date, interest, peer_listing_id)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
  `, [borrowBy, loanAmount, 1, loanBy, paymentDuration, dueDate, interest, peerListingId])
}

async function acceptLoan (loanId, peerListId) {
  // Rejects all other loan requests made to the same peerListId
  await mySql.handleQuery(`
    UPDATE loans
    SET
    loan_status = 3
    WHERE peer_listing_id = ?
  `, [peerListId])

  // Accepts only the loan which the lender approves
  await mySql.handleQuery(`
    UPDATE loans
    SET
    loan_status = 2
    WHERE id = ?
  `, [loanId])
}

async function rejectLoan (loanId) {
  return mySql.handleQuery(`
    UPDATE loans
    SET
    loan_status = 3
    WHERE id = ?
  `, [loanId])
}

async function transferFastCashCredits ({ sourceUserId, sourceFinalAmount, destUserId, destFinalAmount }) {
  return Promise.all([
    mySql.handleQuery(`
      UPDATE fc_user
      SET
      credits = ?
      WHERE user_id = ?
    `, [sourceFinalAmount, sourceUserId]),

    mySql.handleQuery(`
      UPDATE fc_user
      SET
      credits = ?
      WHERE user_id = ?
    `, [destFinalAmount, destUserId])
  ])
}

module.exports = router
