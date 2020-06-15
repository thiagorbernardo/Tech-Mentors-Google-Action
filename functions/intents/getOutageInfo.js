/* Commom functions */
const claroService = require("../services/claroService")
/* Variables */
module.exports = async function getOutageInfo() {
    const username = '36549586801';
    const passwd = 'M1nh@Claro';

    const user = await claroService.getTokenByLogin(username, passwd);
    const idmToken = user.idmToken
    const userInfo = user.userInfo

    const contracts = await claroService.getAllContracts(idmToken)
    const contract = contracts.contracts
    const operatorCode = contract[0].operatorCode
    const contractNumber = contract[0].contractNumber

    const data = await claroService.getDataOfContract(idmToken, operatorCode, contractNumber)
    let name = data["subscriber"]["name"].toLowerCase()
    // name = name.split()[0].capitalize()

    const wcpToken = await claroService.getWCPToken(contractNumber, operatorCode, userInfo)
    let outage = await claroService.getOutageFinal(wcpToken["token"], operatorCode, data["additionalData"]["node"], data["addresses"][0]["city"]["cityCode"], data["addresses"][0]["residenceCode"])
    console.log(outage)
    let finalMsg = `${name}, `
    outage.products.forEach(name => {
        prodName = name.productName.toLowerCase()
        status = name.status.toLowerCase()
        finalMsg += `${prodName} está ${status}. `
    });
    if (outage.defaultTitle != null) {
        msg = finalMsg + outage.defaultMessage//.substring(12,);
        return msg
    }

    return `${name}, não há problema com nenhum dos seus produtos.`
}