module.exports = {
  BusinessException (status, message) {
    const error = new Error(message)
    error.customError = true
    error.status = status
    return error
  }
}