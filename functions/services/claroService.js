const getData = require("../commom/getData.js");
const postData = require("../commom/postData.js");

const PRD_CLARO = "https://prd-gw.claro.com.br"

class ClaroService {

    async getTokenByLogin(username, password) {
        const tokenHeaders = {
            'x-application-key': 'd806a5f0c42a01364e5e000d3ac06d76',
            'Content-type': 'application/json',
        }
        const tokenData = { "password": password, "username": username };
        const tokenUrl = `${PRD_CLARO}/authentication/v1/sign-in`;
        const data = await postData(tokenUrl, tokenData, tokenHeaders);
        return data;
    }
    async getAllContracts(token) {
        const header = {
            'authorization': `Bearer ${token}`
        }
        const contractUrl = `${PRD_CLARO}/customercontracts/v2/contracts?gw-app-key=2251d8c0a94601364c54000d3ac06d76`
        const allContracts = await getData(contractUrl, header)
        return allContracts
    }
    async getDataOfContract(token, operatorCode, contractNumber) {
        const header = {
            'authorization': `Bearer ${token}@${operatorCode}${contractNumber}`
        }
        const contract_url = `${PRD_CLARO}/customercontracts/v2/contracts/information?gw-app-key=e9e24b40c78e013762d7000d3ac06d76`
        const dataOfContracts = await getData(contract_url, header)
        return dataOfContracts
    }
    async getOutageFinal(wcpToken, operatorCode, contractNode, contractCodeCity, contractCodeImovel) {
        const header = {
            'x-wcp-token': wcpToken,
            'x-application-key': 'd62bf800c42a01364e5d000d3ac06d76',
        }
        const outage_url = `${PRD_CLARO}/technician/v2/outage/${operatorCode}/${contractNode}/${contractCodeCity}/${contractCodeImovel}`
        const outage = await getData(outage_url, header)
        return outage
    }
    async getWCPToken(contractNumber, operatorCode, userInfo) {
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
    
    async mockOutage() {
        const outage_url = 'https://mockclaronet.dextra.tech/technician/v2/outage/212/davi/5401/363579400'
        const outage = await getData(outage_url)
        return outage
    }
}

export default new ClaroService();
