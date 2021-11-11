const fetch = require("node-fetch")
const constant = require("../utils/constants")
const { BusinessException } = require("../utils/business-exception")

const TBANK_ENDPOINT = "http://tbankonline.com/SMUtBank_API/Gateway"
const TBANK_ERROR_CODES = {
  otpExpired: "010041",
  success: "010000",
  insufficientFunds: "010011"
}

module.exports = {

  async addBeneficiary (accessToken, account = { AccountID: constant.merchantAccount, Description: "FastCache Pte Ltd." }) {
    const contentObj = JSON.stringify({
      Content: {
        ...account
      }
    })

    const headerObj = JSON.stringify({
      Header: {
        ...accessToken,
        serviceName: "addBeneficiary"
      }
    })

    const response = await fetch(`${TBANK_ENDPOINT}?Header=${headerObj}&Content=${contentObj}`, { method: "POST" })
    const results = await response.json()
    const errorId = results.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID

    if (errorId === TBANK_ERROR_CODES.otpExpired)
      throw BusinessException(400, results.Content.ServiceResponse.ServiceRespHeader.ErrorText)
    else if (errorId !== TBANK_ERROR_CODES.success) {
      throw BusinessException(500, "Failed to add merchant beneficiary.")
    }
  },

  /**
   * Don't bother with this endpoint... it's fucked.
   * @param {*} accessToken - user access token to access SMU tBank
   * @returns 
   */
  async getBeneficiaries (accessToken) {
    const headerObj = JSON.stringify({
      Header: {
        ...accessToken,
        serviceName: "getBeneficiaryList"
      }
    })

    const response = await fetch(`${TBANK_ENDPOINT}?Header=${headerObj}`, { method: "POST" })
    const results = await response.json()

    if (Object.entries(results).length === 0)
      return { error: null, data: null }

    if (ErrorText.includes("invocation successful"))
      return { error: null, data: ServiceResponse.BeneficiaryList.Beneficiary }

    return { error: ErrorText }
  },

  async transfer ({ accessToken, txRef, sourceAccount, amount, description = "", destAccount = constant.merchantAccount }) {
    const headerObj = JSON.stringify({
      Header: {
        ...accessToken,
        serviceName: "creditTransfer"
      }
    })

    const contentObj = JSON.stringify({
      accountFrom: sourceAccount,
      accountTo: destAccount,
      transactionAmount: amount,
      transactionReferenceNumber: txRef,
      narrative: description
    })

    const response = await fetch(`${TBANK_ENDPOINT}?Header=${headerObj}&Content=${contentObj}`, { method: "POST" })
    const results = await response.json()
    const errorId = results.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID

    if (errorId === TBANK_ERROR_CODES.insufficientFunds)
      throw BusinessException(400, results.Content.ServiceResponse.ServiceRespHeader.ErrorDetails)
    else if (errorId !== TBANK_ERROR_CODES.success)
      throw BusinessException(500, "Failed to transfer to merchant account.")
  }

}