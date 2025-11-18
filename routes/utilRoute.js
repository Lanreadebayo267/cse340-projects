// routes/utilRoute.js
const express = require("express")
const router = new express.Router()

// THIS ROUTE FORCES A SERVER ERROR (500)
router.get("/causeError", (req, res, next) => {
  try {
    throw new Error("This is a forced 500 error for testing purposes.")
  } catch (error) {
    next(error)
  }
})

module.exports = router
