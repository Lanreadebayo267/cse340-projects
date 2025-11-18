// utilities/index.js
const invModel = require("../models/inventory-model")

/* ******************************************
 * Navigation Builder
 ******************************************/
async function getNav() {
  try {
    const data = await invModel.getClassifications()
    const rows = data.rows || []

    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    rows.forEach((row) => {
      list += `<li>
        <a href="/inv/type/${row.classification_id}"
        title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}</a>
      </li>`
    })

    list += "</ul>"
    return list
  } catch (err) {
    console.error("Failed to build nav:", err)
    return '<ul><li><a href="/">Home</a></li></ul>'
  }
}

/* ******************************************
 * Classification Grid Builder
 ******************************************/
async function buildClassificationGrid(data) {
  let grid = ""

  if (data && data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="/inv/details/${vehicle.inv_id}">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inv/details/${vehicle.inv_id}">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>
      `
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

/* ******************************************
 * Error Handler Wrapper
 ******************************************/
const handleErrors =
  (fn) =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

/* ******************************************
 * Vehicle Detail HTML Builder
 ******************************************/
function buildVehicleDetail(vehicle) {
  try {
    const price = Number(vehicle.inv_price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })

    const miles = Number(vehicle.inv_mileage || 0).toLocaleString("en-US")

    return `
      <section class="vehicle-detail">
        <img src="${vehicle.inv_image || vehicle.inv_thumbnail}" 
        alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        
        <div class="vehicle-info">
          <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p class="price">${price}</p>
          <p><strong>Mileage:</strong> ${miles} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </section>
    `
  } catch (err) {
    console.error("Failed to build vehicle detail:", err)
    return "<p class='notice'>Vehicle details unavailable.</p>"
  }
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetail,
  handleErrors,
}
