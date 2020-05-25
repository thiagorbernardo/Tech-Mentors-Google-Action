'use strict';
/* Modules */
const fetch = require('node-fetch');
const i18n = require('i18n');
/* Master Functions for Intents  */
const getChannelGradeNow = require("./intents/getChannelGradeNow");
const getChannelNumber = require("./intents/getChannelNumber");
const getMovie = require("./intents/getMovie");
const getNewExhibitions = require("./intents/getNewExhibitions");
const getBillByName = require("./intents/getBillByName");
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
    dialogflow,
    BasicCard,
    Permission,
    Suggestions,
    Button,
    Carousel,
    Image,
    MediaObject,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
// Configuration of locale
i18n.configure({
    directory: `${__dirname}/locales`,
    defaultLocale: 'en-us',
});
app.middleware((conv) => {
    i18n.setLocale(conv.user.locale);
});
// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', async (conv) => {
    console.log('Default NNOME' + conv.user.storage.userName)
    const name = conv.user.storage.userName;
    if (!name) {
        // Asks the user's permission to know their name, for personalization.
        conv.ask(new Permission({
            context: i18n.__('MSG_WELCOME_CONTEXT'),
            permissions: 'NAME',
        }));
    } else {
        conv.ask(i18n.__('MSG_WELCOME_NAME', { name: name }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        // If the user denied our request, go ahead with the conversation.
        conv.ask(i18n.__('MSG_PERMISSION_NO_PERM'));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
    } else {
        // If the user accepted our request, store their name in
        // the 'conv.data' object for the duration of the conversation.
        conv.user.storage.userName = conv.user.name.display;
        conv.ask(i18n.__('MSG_PERMISSION_PERM', { name: conv.user.storage.userName }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
    }
});

// Handle the Dialogflow intent named 'Movie Search'.
// The intent collects a parameter named 'movieName'.
app.intent('Movie Search', async (conv, { movieName }) => {
    const movie = await getMovie(movieName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(i18n.__('MSG_BACKEND', { response: movie }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    } else {
        conv.ask(i18n.__('MSG_BACKEND', { response: movie }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    }
});

// Handle the Dialogflow intent named 'Channel Search'.
// The intent collects a parameter named 'channelName'.
app.intent('Channel Search', async (conv, { channelName }) => {
    const channel = await getChannelNumber(channelName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(i18n.__('MSG_BACKEND', { response: channel }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[7]));
    } else {
        conv.ask(i18n.__('MSG_BACKEND', { response: channel }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[7]));
    }
});

// Handle the Dialogflow intent named 'Grade Search'.
// The intent collects a parameter named 'channelName'.
app.intent('Grade Search', async (conv, { channelName }) => {
    const grade = await getChannelGradeNow(channelName)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(i18n.__('MSG_BACKEND', { response: grade }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    } else {
        conv.ask(i18n.__('MSG_BACKEND', { response: grade }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    }
});

// Handle the Dialogflow intent named 'New Exhibitions'.
// The intent collects a parameter named 'channelName'.
app.intent('New Exhibitions', async (conv, { channelName, title }) => {
    const program = await getNewExhibitions(channelName, title)
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(i18n.__('MSG_BACKEND', { response: program }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    } else {
        conv.ask(i18n.__('MSG_BACKEND', { response: program }));
        conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[5], i18n.__('MSG_SUGGESTIONS')[6]));
    }
});
// Handle the Dialogflow intent named 'FaturaPos'.
app.intent('FaturaPos', async (conv) => {
    if (!conv.user.storage.userName) {
        conv.ask(new Permission({
            context: i18n.__('MSG_FATURA_POS_CONTEXT'),
            permissions: 'NAME',
        }));
    } else {
        const name = conv.user.storage.userName;
        conv.ask(i18n.__('MSG_FATURA_POS'));
        conv.ask(new Suggestions('55 10 10 20 99', '55 10 20 40 88'));

    }
});

app.intent(['FaturaPos - 55 10 10 20 99'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 10 20 99"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW', { bill: bill }));
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[2], i18n.__('MSG_SUGGESTIONS')[3]));
});

app.intent(['FaturaPos - 55 10 10 20 99 - now'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 10 20 99"
    const bill = await getBillByName(name, deviceNumber);
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW_NOW').before);
    conv.ask(new BasicCard({
        text: i18n.__('MSG_FATURA_POS_FOLLOW_NOW_TEXT', { bill: bill }),
        title: i18n.__('MSG_FATURA_POS_FOLLOW_NOW_TITLE', { deviceNumber: deviceNumber }),
        buttons: new Button({
            title: i18n.__('MSG_FATURA_POS_FOLLOW_NOW').button_title,
            url: 'https://www.cinq.com.br/'
        }),
        image: new Image({
            url: "https://lh3.googleusercontent.com/W1Jwfw3dKIo8BsQFaLc0y4UflpgSUlDKiWn4LgjKXFW1Uxj1t8qfwYu987CnBDWdsENT",
            alt: "invoice-55-10-10-20-99",
        })
    }));
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW_NOW').after);
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
});

app.intent(['FaturaPos - 55 10 20 40 88'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 20 40 88"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW', { bill: bill }));
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[2], i18n.__('MSG_SUGGESTIONS')[3]));
});

app.intent(['FaturaPos - 55 10 20 40 88 - now'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 20 40 88"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW_NOW').before);
    conv.ask(new BasicCard({
        text: i18n.__('MSG_FATURA_POS_FOLLOW_NOW_TEXT', { bill: bill }),
        title: i18n.__('MSG_FATURA_POS_FOLLOW_NOW_TITLE', { deviceNumber: deviceNumber }),
        buttons: new Button({
            title: i18n.__('MSG_FATURA_POS_FOLLOW_NOW').button_title,
            url: 'https://www.cinq.com.br/'
        }),
        image: new Image({
            url: "https://lh3.googleusercontent.com/W1Jwfw3dKIo8BsQFaLc0y4UflpgSUlDKiWn4LgjKXFW1Uxj1t8qfwYu987CnBDWdsENT",
            alt: "invoice-55-10-20-40-88",
        })
    }));
    conv.ask(i18n.__('MSG_FATURA_POS_FOLLOW_NOW').after);
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
});

app.intent('Latest News', async (conv) => {
    conv.ask(i18n.__('MSG_LATEST_NEWS'));
    conv.ask(new Suggestions(i18n.__('MSG_LATEST_NEWS_SUGGESTIONS')[0], i18n.__('MSG_LATEST_NEWS_SUGGESTIONS')[1], i18n.__('MSG_LATEST_NEWS_SUGGESTIONS')[2], i18n.__('MSG_LATEST_NEWS_SUGGESTIONS')[3]));
});

app.intent('Latest News - Smartphones', async (conv) => {
    if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
        conv.ask(i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES').no_audio);
        return;
    }
    conv.ask(i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES').before)
    conv.ask(new MediaObject({
        name: i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES').media_name,
        url: 'http://cassadori.com.br/Untitled%20Session%202_mixdown.mp3',
        description: i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES').media_description
    }));
    //conv.ask("Do you would like to know more about Galaxy S20 or checking our other news?")
    conv.ask(new Suggestions(i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES_SUGGESTIONS')[0], i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES_SUGGESTIONS')[1], i18n.__('MSG_LATEST_NEWS_FOLLOW_SMARTPHONES_SUGGESTIONS')[2]));
});

app.intent('Smartphone Price', async (conv) => {
    conv.ask(i18n.__('MSG_SMARTPHONE_PRICE'));
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[2], i18n.__('MSG_SUGGESTIONS')[3]));
});

app.intent('Smartphone Price - yes', async (conv) => {
    conv.ask(i18n.__('MSG_SMARTPHONE_PRICE_YES').before);
    conv.ask(new BasicCard({
        buttons: new Button({
            title: i18n.__('MSG_SMARTPHONE_PRICE_YES').button_title,
            url: 'https://tienda.claro.com.co/claro/celulares/samsung-galaxy-s20-128gb-ultra-4g-negro-con-obsequio'
        }),
        image: new Image({
            url: "https://tienda.claro.com.co/wcsstore/Claro/images/catalog/equipos/646x1000/70035008.jpg",
            alt: "Promo Samsung Galaxy S20 Ultra 128GB con Obsequio",
        })
    }));
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
});

app.intent('Smartphone Price - no', async (conv) => {
    conv.ask(i18n.__('MSG_SMARTPHONE_PRICE_NO'));
    conv.ask(new Suggestions(i18n.__('MSG_SUGGESTIONS')[0], i18n.__('MSG_SUGGESTIONS')[1]));
});

// Handle the Dialogflow follow-up intents
app.intent(['Movie Search - yes', 'Channel Search - yes'], (conv) => {
    conv.ask('Do you want to search channels, grades or movies?');
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);