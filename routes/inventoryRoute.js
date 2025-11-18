// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

// Inventory by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail route
router.get(
  "/details/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
)

module.exports = router
