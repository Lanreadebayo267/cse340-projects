const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

/* ****************************************
 *  Classification Rules
 **************************************** */
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters.")
  ]
}

/* ****************************************
 *  Inventory Rules
 **************************************** */
const inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required"),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required"),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Valid year is required"),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number"),

    body("inv_mileage")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a valid number"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required"),

    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification")
  ]
}

/* ****************************************
 *  Classification Error Check
 **************************************** */
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }
  next()
}

/* ****************************************
 *  Inventory Error Check
 **************************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classifications = await utilities.getClassifications()

    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: errors.array(),
      classifications,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_mileage: req.body.inv_mileage,
      inv_description: req.body.inv_description,
      classification_id: req.body.classification_id
    })
  }
  next()
}

/* ****************************************
 *  Exports
 **************************************** */
module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData
}