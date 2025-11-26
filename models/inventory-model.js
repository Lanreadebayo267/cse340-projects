// models/inventory-model.js
const pool = require("../database/")

/* ===============================
   ADD CLASSIFICATION
================================ */
async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *;
  `
  const values = [classification_name]
  return pool.query(sql, values)
}

/* ===============================
   GET CLASSIFICATIONS
================================ */
async function getClassifications() {
  return pool.query("SELECT * FROM classification ORDER BY classification_name")
}

/* ===============================
   ADD INVENTORY
================================ */
async function addInventory(
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
) {
  const sql = `
    INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `
  const values = [
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  ]
  return pool.query(sql, values)
}

/* ===============================
   GET INVENTORY BY CLASSIFICATION ID
   returns rows array
================================ */
async function getInventoryByClassificationId(classification_id) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM inventory i
    JOIN classification c ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model
  `
  return pool.query(sql, [classification_id])
}

/* ===============================
   GET INVENTORY BY ID
================================ */
async function getInventoryById(inv_id) {
  const sql = `SELECT * FROM inventory WHERE inv_id = $1`
  return pool.query(sql, [inv_id])
}

module.exports = {
  addClassification,
  getClassifications,
  addInventory,
  getInventoryByClassificationId,
  getInventoryById,
}