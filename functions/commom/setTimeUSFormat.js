module.exports = function setTimeUSFormat(date){
    let hours  = date.getUTCHours()
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let minutes = date.getUTCMinutes();
    return (hours + ":" + minutes + " " + AmOrPm)
}