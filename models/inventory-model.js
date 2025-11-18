// models/inventory-model.js
const pool = require("../database/")

/* ******************************************
 * Get all classifications
 ******************************************/
async function getClassifications() {
  return await pool.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
  )
}

/* ******************************************
 * Get inventory by classification id
 ******************************************/
async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_thumbnail, classification_name
     FROM public.inventory
     INNER JOIN public.classification 
     ON public.inventory.classification_id = public.classification.classification_id
     WHERE public.inventory.classification_id = $1`,
    [classification_id]
  )
  return data.rows
}

/* ******************************************
 * Get single vehicle by id
 ******************************************/
async function getVehicleById(inv_id) {
  const data = await pool.query(
    `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_color, 
            inv_description, inv_image, inv_thumbnail
     FROM public.inventory
     WHERE inv_id = $1`,
    [inv_id]
  )
  return data.rows[0]
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
}
