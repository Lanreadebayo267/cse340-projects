/* ******************************************
 * Primary server file
 ******************************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()

// ROUTES & CONTROLLERS
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilRoute = require("./routes/utilRoute")

// UTILITIES
const utilities = require("./utilities/index")  // <-- FORCE INDEX.JS EXPLICITLY

/* ******************************************
 * View Engine
 ******************************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ******************************************
 * Routes
 ******************************************/
app.use(static)

// HOME ROUTE
app.get("/", utilities.handleErrors(baseController.buildHome))

// INVENTORY ROUTES
app.use("/inv", inventoryRoute)

// UTIL ROUTES
app.use("/", utilRoute)

// 404 Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ******************************************
 * GLOBAL ERROR HANDLER
 ******************************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ******************************************
 * Start Server
 ******************************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
