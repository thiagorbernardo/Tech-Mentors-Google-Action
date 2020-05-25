/* Commom functions */
const getData = require("../commom/getData");
const setWordRequirements = require("../commom/setWordRequirements");
/* Variables */
const APIUrl = 'https://claromentors.now.sh'
module.exports = async function getChannelNumber(channelName) {
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/admin/channels/getIDChannelByName?st_canal=${st_canal}&id_cidade=1`;
    let response_ID = await getData(url);
    if (response_ID.status == 200) {
        const new_url = `${APIUrl}/api/admin/channels/getChannelByID?id_revel=${response_ID.content}`;
        let response = await getData(new_url);
        if (response.status == 200) {
            response = response.content;
            const name = response.nome;
            const number = response.cn_canal;
            return `O canal ${name} é o ${number}.`;
        } else {
            return "Ocorreu um problema, tente novamente.";
        }
    } else {
        return "Houve um problema procurando o canal, please try again.";
    }
}