'use strict';
const fetch = require('node-fetch');
const APIUrl = 'https://google-claro.now.sh'

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
            context: `Olá, para conocerte mejor`,
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Hola. Que quieres saber?`);
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    // If the user accepted our request, store their name in
    // the 'conv.data' object for the duration of the conversation.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Gracias, ${conv.user.storage.userName}. Que quieres saber?`);
    conv.ask(new Suggestions('Quiero saber mi factura'));
});

// Handle the Dialogflow intent named 'Bill User'.
// The intent collects a parameter named 'movieName'.
app.intent('Bill User', async (conv) => {
    if (conv.user.storage.userName) {
        const user = await getBillofAUser(conv.user.storage.userName)
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, ` +
            `${user}.` +
            ` ¿Quieres buscar otra cosa?</speak>`);
        conv.ask(new Suggestions('Yes', 'Não'));
    } else {
        conv.ask("Necesitas dejarme ver tu nombre.");
    }
});
/*
// Handle the Dialogflow follow-up intents
app.intent(['Movie Search - yes', 'Channel Search - yes'], (conv) => {
    conv.ask('Deseja procurar canais, filmes ou programações?');
    // If the user is using a screened device, display the carousel
    //if (conv.screen) return conv.ask(optionsCarousel());
});*/


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

async function getBillofAUser(userName) {
    const url = `${APIUrl}/api/admin/user/getBillByName?userName=${userName}`;
    const response = await getData(url);

    if (response != false) {
        let len = response.billMonths.length
        let value = response.billMonths[len-1]
        return `El monto de su factura este mes es ${value} pesos.`
    } else {
        return `Ocorreu um problema, tente novamente.`
    }
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
