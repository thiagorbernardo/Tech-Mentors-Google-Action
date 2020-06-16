/* Commom functions */
const getTokenByLogin = require("../helpers/claro/getTokenByLogin");
const getAllContracts = require("../helpers/claro/getAllContracts");
const getDataOfContract = require("../helpers/claro/getDataOfContract");
const getOutageFinal = require("../helpers/claro/getOutageFinal");
const getWCPToken = require("../helpers/claro/getWCPToken");
/* Variables */
module.exports = async function getOutageInfo() {
    const username = '36549586801';
    const passwd = 'M1nh@Claro';

    const user = await getTokenByLogin(username, passwd);
    const idmToken = user.idmToken
    const userInfo = user.userInfo

    const contracts = await getAllContracts(idmToken)
    const contract = contracts.contracts
    const operatorCode = contract[0].operatorCode
    const contractNumber = contract[0].contractNumber

    const data = await getDataOfContract(idmToken, operatorCode, contractNumber)
    let name = data["subscriber"]["name"].toLowerCase()
    // name = name.split()[0].capitalize()

    const wcpToken = await getWCPToken(contractNumber, operatorCode, userInfo)
    let outage = await getOutageFinal(wcpToken["token"], operatorCode, data["additionalData"]["node"], data["addresses"][0]["city"]["cityCode"], data["addresses"][0]["residenceCode"])
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