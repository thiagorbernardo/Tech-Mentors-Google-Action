/* Commom functions */
const getData = require("../commom/getData");
const setWordRequirements = require("../commom/setWordRequirements");
const setTimeUSFormat = require("../commom/setTimeUSFormat");
/* Variables */
const APIUrl = 'https://claromentors.now.sh'
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const prefixNames = ["st", "nd", "rd", "th"]
module.exports = async function getNewExhibitions(channelName, title){
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    
    const url = `${APIUrl}/api/admin/channels/getNewExhibitions?st_canal=${st_canal}&title=${title}&id_cidade=1`
    const response = await getData(url);
    if(response != false){
        let title = response.titulo;
        let date_start = new Date(response.dh_inicio)
        let date_end = new Date(response.dh_fim)
        let time_start = setTimeUSFormat(date_start)
        let time_end = setTimeUSFormat(date_end)
        let month = date_start.getUTCMonth()
        let day = response.dh_inicio.slice(8,10)
        if(day <= 3){
            day = day + prefixNames[day-1]
        }else{
            day = day + prefixNames[3]
        }
        return `${title} will be on ${channelName} again on ${monthNames[month]} ${day} from ${time_start} to ${time_end}.` 
    } else {
        return "There was a problem, please try again."
    }
}