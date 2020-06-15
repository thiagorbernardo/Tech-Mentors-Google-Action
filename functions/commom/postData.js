const fetch = require('node-fetch');
module.exports = async function postData(url, content, headers) {
    return await fetch(url, {
        method: 'post',
        body: JSON.stringify(content),
        headers: headers,
    })
        .then(res => res.json())
        .then(json => { return json; })
        .catch(err => {
            console.log(err);
        });
}