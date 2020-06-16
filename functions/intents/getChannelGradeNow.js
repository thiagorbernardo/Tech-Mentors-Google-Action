/* Commom functions */
const getData = require("../commom/getData");
const setWordRequirements = require("../commom/setWordRequirements");
const setTimeUSFormat = require("../commom/setTimeUSFormat");
/* Variables */
const APIUrl = 'https://claromentors.azurewebsites.net'
module.exports = async function getChannelGradeNow(channelName) {
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/getChannelGradeNow?st_canal=${st_canal}&id_cidade=1`;
    let response = await getData(url);

    if (response.status == 200) {
        response = response.content;
        let title = response.titulo;
        let final = response.dh_fim.slice(11,16);
        return `Agora está passando ${title} até às ${final} no ${channelName}.`
    } else {
        return "Ocorreu um problema, tente novamente."
    }
}