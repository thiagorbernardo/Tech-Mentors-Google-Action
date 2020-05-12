/* Commom functions */
const getData = require("../commom/getData");
const getDataText = require("../commom/getDataText");
const setWordRequirements = require("../commom/setWordRequirements");
/* Variables */
const APIUrl = 'https://claromentors.now.sh'
module.exports = async function getChannelNumber(channelName) {
    let st_canal = channelName.toLowerCase()
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/admin/channels/getIDChannelByName?st_canal=${st_canal}&id_cidade=1`
    let response_ID = await getDataText(url)
    //return (`I get here with ${response_ID} and ${st_canal}` )
    if (response_ID != false) {
        const new_url = `${APIUrl}/api/admin/channels/getChannelByID?id_revel=${response_ID}`
        let response = await getData(new_url)
        if (response != false) {
            const name = response.nome
            const number = response.cn_canal
            return `The channel ${name} is the ${number}.`
        } else {
            return `There was a problem, please try again.`
        }
    } else {
        return "There was a problem finding the channel, please try again."
    }
}