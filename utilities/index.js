const invModel = require("../models/inventory-model")

const utilities = {}

/* ===============================
   BUILD NAVIGATION MENU
================================ */
utilities.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let nav = "<ul>"

    data.rows.forEach(row => {
      nav += `
        <li>
          <a href="/inv/type/${row.classification_id}">
            ${row.classification_name}
          </a>
        </li>`
    })

    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("Navigation Build Error:", error)
    return "<ul><li><a href='#'>Error Loading Navigation</a></li></ul>"
  }
}

/* ===============================
   BUILD CLASSIFICATION SELECT LIST
================================ */
utilities.buildClassificationList = function (classificationData, selectedId) {
  let select = `<select name="classification_id" id="classification_id" required>`
  select += `<option value="">Choose a Classification</option>`

  classificationData.forEach(row => {
    const isSelected = selectedId == row.classification_id ? "selected" : ""
    select += `<option value="${row.classification_id}" ${isSelected}>
                 ${row.classification_name}
               </option>`
  })

  select += `</select>`
  return select
}

/* ===============================
   BUILD CLASSIFICATION GRID
================================ */
utilities.buildClassificationGrid = function (vehicles) {
  let grid = '<div class="vehicle-grid">'

  vehicles.forEach(vehicle => {
    grid += `
      <div class="vehicle-card">
        <a href="/inv/details/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <h3>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h3>
        <p>Price: $${vehicle.inv_price}</p>
      </div>
    `
  })

  grid += "</div>"
  return grid
}

/* ===============================
   BUILD VEHICLE DETAIL PAGE
================================ */
utilities.buildVehicleDetail = function (vehicle) {
  return `
    <section class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p>${vehicle.inv_description}</p>
      <p><strong>Price:</strong> $${vehicle.inv_price}</p>
      <p><strong>Miles:</strong> ${vehicle.inv_miles}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    </section>
  `
}

/* ===============================
   ERROR HANDLER WRAPPER
================================ */
utilities.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = utilities