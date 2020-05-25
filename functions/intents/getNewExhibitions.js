/* Commom functions */
const getData = require("../commom/getData");
const setWordRequirements = require("../commom/setWordRequirements");
const setTimeUSFormat = require("../commom/setTimeUSFormat");
/* Variables */
const APIUrl = 'https://claromentors.now.sh'
const monthsOfYear = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];
module.exports = async function getNewExhibitions(channelName, title) {
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);

    const url = `${APIUrl}/api/admin/channels/getNewExhibitions?st_canal=${st_canal}&title=${title}&id_cidade=1`
    let response = await getData(url);
    console.log(response)
    if (response.status == 200) {
        response = response.content;
        let title = response.titulo;
        let time_start = response.dh_inicio.slice(11, 16);
        let time_end = response.dh_fim.slice(11, 16);
        let date_start = new Date(response.dh_inicio);
        let month = date_start.getUTCMonth();
        let day = response.dh_inicio.slice(8, 10)
        return `Irá passar ${title} novamente dia ${day} de ${monthsOfYear[month]} das ${time_start} até às ${time_end} no ${channelName}.`
    } else {
        return "Ocorreu um problema, tente novamente."
    }
}