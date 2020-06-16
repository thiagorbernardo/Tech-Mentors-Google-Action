/* Commom functions */
const postData = require("../../commom/postData");
/* Variables */
const PRD_CLARO = "https://prd-gw.claro.com.br"
module.exports = async function getTokenByLogin(username, password) {
    const tokenHeaders = {
        'x-application-key': 'd806a5f0c42a01364e5e000d3ac06d76',
        'Content-type': 'application/json',
    }
    const tokenData = { "password": password, "username": username };
    const tokenUrl = `${PRD_CLARO}/authentication/v1/sign-in`;
    const data = await postData(tokenUrl, tokenData, tokenHeaders);
    return data;
}