/**************************************
 *  Account Validation
 *************************************/

const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

/* ******************************
 * Registration Validation Rules
 ****************************** */
const registrationRules = () => {
  return [
    // first name
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    // last name
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    // email (valid + cannot already exist)
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
      }),

    // password (at least 12 chars)
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
  ]
}

/* ******************************
 * Check Validation Results
 ****************************** */
const regValidate = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // keep entered values for sticky form
    let nav = await require("../utilities").getNav()

    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
  }

  next()
}

/* ******************************
 * EXPORTS
 ****************************** */
module.exports = { registrationRules, regValidate }
