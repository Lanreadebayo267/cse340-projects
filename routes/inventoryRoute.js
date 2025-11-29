const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const invValidate = require("../utilities/inventory-validation")

// Management View
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Add classification (GET)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Add Classification (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory (GET)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Add Inventory (POST)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Existing Classification Route
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Existing Inventory Detail Route
router.get(
  "/details/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
)

router.get("/test", (req, res) => {
  res.render("inventory/add-classification", {
    title: "Test",
    nav: "",
    notice: "",
    errors: [],
    classification_name: ""
  })
})


module.exports = router