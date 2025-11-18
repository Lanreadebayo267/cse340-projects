// controllers/errorController.js
async function throwError(req, res, next) {
    throw new Error("Intentional Server Crash for Testing")
}

module.exports = { throwError }
