const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

/**
 * Retrieves all lenders amount
 */
router.get("/", async (req, res) => {
  let { accessToken } = req.query

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  try {
    const peerList = await getListings()
    return res.json({ status: 200, data: peerList })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

/**
 * Retrieves committed amount for a specific lender
 */
router.get("/:id", async (req, res) => {
  const { accessToken } = req.query
  const { id: userId } = req.params

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  if (!userId)
    return res.json({ status: 400, message: "No user provided." })

  try {
    const peerList = await getListings(userId)
    return res.json({ status: 200, data: peerList })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

/**
 * Post a peer-to-peer lending listing
 */
router.post("/", async (req, res) => {
  const { accessToken, committedAmount, interestRate } = req.body

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  const users = await getUser(accessToken.userID)
  if (users.length === 0)
    return res.json({ status: 401, message: "Unauthorized access." })

  if (!committedAmount || committedAmount < 250)
    return res.json({ status: 400, message: "Commit amount cannot be lower than $250." })

  if (!interestRate || interestRate < 1 || interestRate > 55)
    return res.json({ status: 400, message: "Interest rate cannot be lower than 1 and higher than 55." })

  try {
    const { credits, is_lender } = users[0]
    if (!is_lender)
      return res.json({ status: 400, message: "Lender features are not permitted for a borrower." })

    if (committedAmount > credits)
      return res.json({ status: 400, message: "Committed amount cannot be more than owned credits." })

    await createListing({ userId: accessToken.userID, committedAmount, interestRate })
    return res.json({ status: 200, message: "Successfully listed." })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

async function getUser(userId) {
  return mySql.handleQuery(`
    SELECT *
    FROM fc_user
    WHERE user_id = ?
  `, [userId])
}

async function getListings(userId = null) {
  if (userId)
    return mySql.handleQuery(`
      SELECT *
      FROM peer_listing
      WHERE listed_by = ?
      ORDER BY id;
    `, [userId])

  return mySql.handleQuery(`
    SELECT *
    FROM peer_listing;
  `)
}

async function createListing(record) {
  const { userId, committedAmount, interestRate } = record

  return mySql.handleQuery(`
    INSERT INTO peer_listing (commited_amount, interest_rate, listed_by)
    VALUES
    (?, ?, ?)
  `, [committedAmount, interestRate, userId])
}

module.exports = router
