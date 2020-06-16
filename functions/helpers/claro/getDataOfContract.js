/* Commom functions */
const getData = require("../../commom/getData.js");
/* Variables */
const PRD_CLARO = "https://prd-gw.claro.com.br"
module.exports = async function getDataOfContract(token, operatorCode, contractNumber) {
    const header = {
        'authorization': `Bearer ${token}@${operatorCode}${contractNumber}`
    }
    const contract_url = `${PRD_CLARO}/customercontracts/v2/contracts/information?gw-app-key=e9e24b40c78e013762d7000d3ac06d76`
    const dataOfContracts = await getData(contract_url, header)
    return dataOfContracts
}