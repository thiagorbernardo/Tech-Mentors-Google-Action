/* Commom functions */
const getData = require("../../commom/getData.js");
/* Variables */
const PRD_CLARO = "https://prd-gw.claro.com.br"
module.exports = async function getAllContracts(token) {
    const header = {
        'authorization': `Bearer ${token}`
    }
    const contractUrl = `${PRD_CLARO}/customercontracts/v2/contracts?gw-app-key=2251d8c0a94601364c54000d3ac06d76`
    const allContracts = await getData(contractUrl, header)
    return allContracts
}