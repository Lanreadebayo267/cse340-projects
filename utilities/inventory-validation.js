const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("./")

const invValidate = {}

/* ===============================
   CLASSIFICATION RULES
================================ */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Classification name must contain only letters and spaces.")
      .isLength({ min: 3 })
      .withMessage("Classification must be at least 3 characters."),
  ]
}

/* ===============================
   CHECK CLASSIFICATION ERRORS
================================ */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    })
  }
  next()
}

/* ===============================
   INVENTORY RULES
================================ */
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a valid number."),
    body("inv_price")
      .isNumeric()
      .withMessage("Price must be numeric."),
    body("classification_id")
      .isInt()
      .withMessage("You must select a classification."),
  ]
}

/* ===============================
   CHECK INVENTORY ERRORS
================================ */
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationsData = await invModel.getClassifications()
    const classificationsSelect = utilities.buildClassificationList(
      classificationsData.rows,
      req.body.classification_id
    )

    return res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationsSelect,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
      errors: errors.array(),
      messages: req.flash(),
    })
  }
  next()
}

module.exports = invValidate