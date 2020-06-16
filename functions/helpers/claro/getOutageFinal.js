/* Commom functions */
const getData = require("../commom/getData.js");
/* Variables */
const PRD_CLARO = "https://prd-gw.claro.com.br"
module.exports = async function getOutageFinal(wcpToken, operatorCode, contractNode, contractCodeCity, contractCodeImovel) {
    const header = {
        'x-wcp-token': wcpToken,
        'x-application-key': 'd62bf800c42a01364e5d000d3ac06d76',
    }
    const outage_url = `${PRD_CLARO}/technician/v2/outage/${operatorCode}/${contractNode}/${contractCodeCity}/${contractCodeImovel}`
    const outage = await getData(outage_url, header)
    return outage
}