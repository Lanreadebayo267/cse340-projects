// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ****************************************
*  Deliver Inventory Management View
**************************************** */
async function buildManagementView(req, res, next) {
  const nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications()
  const classificationSelect = utilities.buildClassificationList(classificationData.rows)

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect
  })
}

/* ****************************************
*  Build inventory by classification view
**************************************** */
async function buildByClassificationId(req, res, next) {
  const classificationId = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classificationId)

  const vehicles = data.rows || []
  const grid = utilities.buildClassificationGrid(vehicles)

  const name = vehicles.length > 0
    ? vehicles[0].classification_name
    : "No Results"

  const nav = await utilities.getNav()

  res.render("./inventory/classification", {
    title: `${name} Vehicles`,
    nav,
    grid
  })
}

/* ****************************************
*  Build vehicle detail view
**************************************** */
async function buildDetailView(req, res, next) {
  const inv_id = req.params.inv_id

  const data = await invModel.getInventoryById(inv_id)

  if (!data.rows.length) {
    throw new Error("Vehicle not found")
  }

  const vehicle = data.rows[0]
  const detail = utilities.buildVehicleDetail(vehicle)

  const nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail
  })
}

/* ****************************************
*  Build add classification view
**************************************** */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process add classification
**************************************** */
async function addClassification(req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  const addResult = await invModel.addClassification(classification_name)

  if (addResult.rowCount > 0) {
    req.flash("notice", "New classification added successfully.")
    return res.redirect("/inv")
  }

  req.flash("notice", "Failed to add classification.")
  res.status(500).render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Build add inventory view
**************************************** */
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications()
  const classificationSelect = utilities.buildClassificationList(classificationData.rows)

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationSelect
  })
}

/* ****************************************
*  Process add inventory
**************************************** */
async function addInventory(req, res) {
  const nav = await utilities.getNav()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (addResult.rowCount > 0) {
    req.flash("notice", "New vehicle added successfully.")
    return res.redirect("/inv")
  }

  req.flash("notice", "Failed to add vehicle.")
  const classificationData = await invModel.getClassifications()
  const classificationSelect = utilities.buildClassificationList(classificationData.rows, classification_id)

  res.status(500).render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationSelect
  })
}

module.exports = {
  buildManagementView,
  buildByClassificationId,
  buildDetailView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
}