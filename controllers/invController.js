// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}

/* ******************************************
 * Build inventory by classification view
 ******************************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()

    let className = "Inventory"
    if (data.length > 0) {
      className = data[0].classification_name
    }

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error building classification view:", error)
    next(error)
  }
}

/* ******************************************
 * Build vehicle detail view
 ******************************************/
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getVehicleById(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const vehicleHTML = utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    })
  } catch (error) {
    console.error("Error building detail view:", error)
    next(error)
  }
}

module.exports = invCont
