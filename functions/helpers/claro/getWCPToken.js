/* Commom functions */
const getData = require("../../commom/getData.js");
/* Variables */
const PRD_CLARO = "https://prd-gw.claro.com.br"
module.exports = async function getWCPToken(contractNumber, operatorCode, userInfo) {
    let wcpHeaders = {
        'contract-number': contractNumber,
        'operator-code': operatorCode,
        'partner-account': 'NETAPPNOVO',
        'user-info': userInfo,
        'x-application-key': 'f2911760741e01375b1a000d3ac06d76'
    }
    let tokenUrl = `${PRD_CLARO}/security/v1/generate-token-by-userinfo/sms`
    wcpToken = await getData(tokenUrl, wcpHeaders)
    return wcpToken
}