const fetch = require('node-fetch');
module.exports = async function getData(url, header = {}) {
    return await fetch(url, { method: 'GET', headers: header })
        .then(res =>
            res.json()
        ) // expecting a json response
        .then(json => {
            return json;
        })
        .catch(err => {
            console.log(err);
        });
}