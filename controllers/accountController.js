import utilities from "../utilities/index.js"
import accountModel from "../models/account-model.js"
import bcrypt from "bcryptjs"

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    )
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  // Use hashed password instead of plain text
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 * Deliver Login View
 * *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 * Deliver Registration View
 * *************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

export { 
  buildLogin,
  buildRegister,
  registerAccount
}