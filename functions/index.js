'use strict';
const fetch = require('node-fetch');
const API_KEYDB = '33b98784c91a88fdf6bf36da722e8ece'
const APIUrl = 'https://claromentors.now.sh'
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const prefixNames = ["st", "nd", "rd", "th"]
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
    dialogflow,
    BasicCard,
    Permission,
    Suggestions,
    Carousel,
    Image,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });


// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', async (conv) => {
    const name = conv.user.storage.userName;
    if (!name) {
        // Asks the user's permission to know their name, for personalization.
        conv.ask(new Permission({
            context: `Olá, para te conhecer melhor`,
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Olá, ${name}. O que você deseja procurar?`);
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        // If the user denied our request, go ahead with the conversation.
        conv.ask(`OK, sem problemas. O que deseja saber?`);
        conv.ask(new Suggestions('Procurar Star Wars', "Qual o número da Fox?", "O que está passando no Telecine Premium?"));
    } else {
        // If the user accepted our request, store their name in
        // the 'conv.data' object for the duration of the conversation.
        conv.user.storage.userName = conv.user.name.display;
        conv.ask(`Obrigado, ${conv.user.storage.userName}. O que deseja saber?`);
        conv.ask(new Suggestions('Procurar Star Wars', "Qual o número da Fox?", "O que está passando no Telecine Premium?"));
    }
});

// Handle the Dialogflow intent named 'Movie Search'.
// The intent collects a parameter named 'movieName'.
app.intent('Movie Search', async (conv, { movieName }) => {
    const movie = await getMovie(movieName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, ` +
            `${movie}.` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Yes', 'Não'));
    } else {
        conv.ask(`<speak>${movie}.` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Yes', 'Não'));
    }
});

// Handle the Dialogflow intent named 'Channel Search'.
// The intent collects a parameter named 'channelName'.
app.intent('Channel Search', async (conv, { channelName }) => {
    const channel = await getChannelNumber(channelName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, ` +
            `${channel}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    } else {
        conv.ask(`<speak>${channel}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    }
});

// Handle the Dialogflow intent named 'Grade Search'.
// The intent collects a parameter named 'channelName'.
app.intent('Grade Search', async (conv, { channelName }) => {
    const grade = await getChannelGradeNow(channelName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, ` +
            `${grade}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    } else {
        conv.ask(`<speak>${grade}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    }
});

// Handle the Dialogflow intent named 'New Exhibitions'.
// The intent collects a parameter named 'channelName'.
app.intent('New Exhibitions', async (conv, { channelName, title }) => {
    const program = await getNewExhibitions(channelName, title)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, ` +
            `${program}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    } else {
        conv.ask(`<speak>${program}` +
            ` Deseja procurar mais alguma coisa?</speak>`);
        conv.ask(new Suggestions('Sim', 'Não'));
    }
});

// Handle the Dialogflow follow-up intents
app.intent(['Movie Search - yes', 'Channel Search - yes'], (conv) => {
    conv.ask('Deseja procurar canais, filmes ou programações?');
    // If the user is using a screened device, display the carousel
    //if (conv.screen) return conv.ask(optionsCarousel());
});


async function getMovie(movieName) {
    const language = 'pt-BR';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEYDB}&language=${language}&query=${movieName}`;
    let response = await getData(url);

    if (response.results != []) {
        return response.results[0].overview;
    } else {
        return "Não achei este filme"
    }
}

async function getData(url) {
    return await fetch(url)
        .then(res => res.json()) // expecting a json response
        .then(json => {
            return json;
        })
        .catch(err => {
            console.log(err);
        });
}

async function getDataText(url) {
    return await fetch(url)
        .then(res => res.text()) // expecting a json response
        .then(json => {
            return json;
        })
        .catch(err => {
            console.log(err);
        });
}

function setWordRequirements(word) {
    let final = "";
    let words = word.split(" ");
    for (let i = 0; i < words.length; i++) {
        final += words[i] + "_";
    }
    return final.slice(0, final.length - 1);
}
function setTimeUSFormat(date){
    let hours  = date.getUTCHours()
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let minutes = date.getUTCMinutes();
    return (hours + ":" + minutes + " " + AmOrPm)
}
async function getChannelNumber(channelName) {
    let st_canal = channelName.toLowerCase()
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/admin/channels/getIDChannelByName?st_canal=${st_canal}&id_cidade=1`
    let response_ID = await getDataText(url)
    if (response_ID != false) {
        const new_url = `${APIUrl}/api/admin/channels/getChannelByID?id_revel=${response_ID}`
        let response = await getData(new_url)
        if (response != false) {
            const name = response.nome
            const number = response.cn_canal
            return `O canal ${name} é o ${number}.`
        } else {
            return `Ocorreu um problema, tente novamente.`
        }
    } else {
        return "Ocorreu um problema procurando pelo canal."
    }
}

async function getChannelGradeNow(channelName) {
    let st_canal = channelName.toLowerCase();
    if (st_canal.length > 1)
        st_canal = setWordRequirements(st_canal);
    const url = `${APIUrl}/api/admin/channels/getChannelGradeNow?st_canal=${st_canal}&id_cidade=1`;
    const response = await getData(url);

    if (response != false) {
        let title = response.titulo;
        let final = new Date(response.dh_fim);
        let hours  = final.getUTCHours()
        //let hours = setTimeUSFormat(final)
        return `${title} irá passar no ${channelName} até às ${hours}.`
    } else {
        return `Ocorreu um problema, tente novamente.`
    }
}

async function getNewExhibitions(channelName, title){
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
        /*if(day <= 3){
            day = day + prefixNames[day-1]
        }else{
            day = day + prefixNames[3]
        }*/
        return `${title} estará noa${channelName} novamente dia ${day}/${month+1} das ${time_start} às ${time_end}.` 
    } else {
        return `Ocorreu um problema, tente novamente.`
    }
}
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
