const fetch = require("node-fetch")
const constant = require("../utils/constants")
const TBANK_ENDPOINT = "http://tbankonline.com/SMUtBank_API/Gateway"

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

    return fetch(`${TBANK_ENDPOINT}?Header=${headerObj}&Content=${contentObj}`, { method: "POST" })
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

  async transfer (txRef, sourceAccount, amount, description = "", destAccount = constant.merchantAccount) {
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
    console.log(results)
  }

}