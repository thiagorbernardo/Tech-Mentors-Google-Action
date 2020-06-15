/* Commom functions */
const claroService = require("../services/claroService")
/* Variables */
module.exports = async function getMockOutageInfo() {
    let outage = await claroService.mockOutage()
    let finalMsg = 'Thiago, '
    outage.products.forEach(name => {
        prodName = name.productName.toLowerCase()
        status = name.status.toLowerCase()
        finalMsg += `${prodName} está ${status}. `
    });
    if (outage.defaultTitle != null) {
        msg = finalMsg + outage.defaultMessage.substring(12,);
        return msg
    }
    return 'Thiago, não há problema com nenhum dos seus produtos.'
}