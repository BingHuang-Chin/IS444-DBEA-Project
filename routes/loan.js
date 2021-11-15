const express = require("express")
const router = express.Router()
const mySql = require("../lib/mysql-wrapper")

/**
 * Retrieves loans which belongs to the user
 */
router.get("/", async (req, res) => {
  res.json({ initial: "implementation "})
})

/**
 * Borrowers requests loans from lender
 */
router.post("/request", async (req, res) => {
  res.json({ initial: "implementation "})
})

/**
 * Lenders approve a loan request
 */
router.post("/request/:id/approve", async (req, res) => {
  res.json({ initial: "implementation "})
})

/**
 * Lenders reject a loan request
 */
 router.post("/request/:id/reject", async (req, res) => {
  res.json({ initial: "implementation "})
})

/**
 * Borrowers repay loans one-shot
 */
router.post("/repay", async (req, res) => {
  res.json({ initial: "implementation "})
})

module.exports = router
