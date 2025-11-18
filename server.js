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
const utilities = require("./utilities/index")

/* ******************************************
 * View Engine
 ******************************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ******************************************
 * Middleware to set nav globally
 ******************************************/
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
  } catch (err) {
    console.error("Failed to set nav middleware:", err)
    res.locals.nav = '<ul><li><a href="/">Home</a></li></ul>'
  }
  next()
})

/* ******************************************
 * Routes
 ******************************************/
app.use(static)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/", utilRoute)

/* ******************************************
 * 404 Handler
 ******************************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ******************************************
 * Global Error Handler
 ******************************************/
app.use(async (err, req, res, next) => {
  let nav = '<ul><li><a href="/">Home</a></li></ul>'
  try {
    nav = await utilities.getNav()
  } catch (errNav) {
    console.error("Error loading nav for error page:", errNav)
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
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
  console.log(`App listening on ${host}:${port}`)
})
