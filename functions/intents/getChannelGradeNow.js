/* Commom functions */
const getData = require("../commom/getData");
const setWordRequirements = require("../commom/setWordRequirements");
const setTimeUSFormat = require("../commom/setTimeUSFormat");
/* Variables */
const APIUrl = 'https://claromentors.now.sh'
module.exports = async function getChannelGradeNow(channelName) {
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/admin/channels/getChannelGradeNow?st_canal=${st_canal}&id_cidade=1`;
    const response = await getData(url);

    if (response != false) {
        let title = response.titulo;
        let final = new Date(response.dh_fim);
        let hours = setTimeUSFormat(final)
        return `${title} will be on ${channelName} until ${hours}.`
    } else {
        return "There was a problem, please try again."
    }
}