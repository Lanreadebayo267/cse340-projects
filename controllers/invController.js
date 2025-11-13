const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    try {
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()

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
        console.error("Error building classification view: ", error)
        res.redirect("/")
    }
}

module.exports = invCont
