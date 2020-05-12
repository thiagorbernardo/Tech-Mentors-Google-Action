const fetch = require('node-fetch');
module.exports = async function getDataText(url) {
    return await fetch(url)
        .then(res => res.text()) // expecting a json response
        .then(json => {
            return json;
        })
        .catch(err => {
            console.log(err);
        });
}