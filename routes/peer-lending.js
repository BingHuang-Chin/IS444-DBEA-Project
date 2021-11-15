const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

/**
 * Retrieves all lenders amount
 */
router.get("/", async (req, res) => {
  const { accessToken } = req.body

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
 * Post a peer-to-peer lending listing
 */
router.post("/", async (req, res) => {
  const { accessToken, committedAmount, interestRate } = req.body

  if (!accessToken)
    return res.json({ status: 401, message: "Unauthorized access." })

  if (!committedAmount || committedAmount < 250)
    return res.json({ status: 400, message: "Commit amount cannot be lower than $250." })

  if (!interestRate || interestRate < 1 || interestRate > 55)
    return res.json({ status: 400, message: "Interest rate cannot be lower than 1 and higher than 55." })

  try {
    await createListing({ userId: accessToken.userID, committedAmount, interestRate })
    return res.json({ status: 200, message: "Successfully listed." })
  } catch (e) {
    console.error(e)
    return res.json({ status: 500, message: "Internal server error" })
  }
})

async function getListings () {
  return mySql.handleQuery(`
    SELECT *
    FROM peer_listing;
  `)
}

async function createListing (record) {
  const { userId, committedAmount, interestRate } = record

  return mySql.handleQuery(`
    INSERT INTO peer_listing (commited_amount, interest_rate, listed_by)
    VALUES
    (?, ?, ?)
  `, [committedAmount, interestRate, userId])
}

module.exports = router
