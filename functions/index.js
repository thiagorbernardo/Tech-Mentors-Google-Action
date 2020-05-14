'use strict';
/* Modules */
const fetch = require('node-fetch');
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


// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', async (conv) => {
    const name = conv.user.storage.userName;
    if (!name) {
        // Asks the user's permission to know their name, for personalization.
        conv.ask(new Permission({
            context: `Hi there, to get to know you better`,
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Hi again, ${name}. What do you want to know?`);
        conv.ask(new Suggestions('My invoice', "News today"));
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        // If the user denied our request, go ahead with the conversation.
        conv.ask(`OK, no worries. What do you want to know?`);
        conv.ask(new Suggestions('My invoice', "News today"));
    } else {
        // If the user accepted our request, store their name in
        // the 'conv.data' object for the duration of the conversation.
        conv.user.storage.userName = conv.user.name.display;
        conv.ask(`Thanks, ${conv.user.storage.userName}. What do you want to know?`);
        conv.ask(new Suggestions('My invoice', "News today"));
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
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`<speak>${movie}.` +
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
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
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`<speak>${channel}` +
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
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
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`<speak>${grade}` +
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
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
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`<speak>${program}` +
            ` Would you like to search anything else?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    }
});
// Handle the Dialogflow intent named 'FaturaPos'.
app.intent('FaturaPos', async (conv) => {
    if (!conv.user.storage.userName) {
        conv.ask(new Permission({
            context: `You need to let me see your name"`,
            permissions: 'NAME',
        }));
    } else {
        const name = conv.user.storage.userName;
        conv.ask(`${name}, you have two numbers. Which one do you want to know about? The first number with the ending 20 9 9? Or the second number with final 40 8 8?`);
        conv.ask(new Suggestions('55 10 10 20 99', '55 10 20 40 88'));

    }
});

app.intent(['FaturaPos - 55 10 10 20 99'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 10 20 99"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(`<speak>The value of May is ${bill} pesos. Do you want me to send you your invoice?</speak>`);
    conv.ask(new Suggestions('By E-mail', 'By Smartphone', 'By SMS'));
});

app.intent(['FaturaPos - 55 10 10 20 99 - now'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 10 20 99"
    const bill = await getBillByName(name, deviceNumber);
    conv.ask("Ok, here's your invoice.");
    conv.ask(new BasicCard({
        text: `The value of May is ${bill} pesos.`,
        title: `Bill for ${deviceNumber}`,
        buttons: new Button({
            title: 'Download Bill',
            url: 'https://www.cinq.com.br/'
        }),
        image: new Image({
            url: "https://lh3.googleusercontent.com/W1Jwfw3dKIo8BsQFaLc0y4UflpgSUlDKiWn4LgjKXFW1Uxj1t8qfwYu987CnBDWdsENT",
            alt: "invoice-55-10-10-20-99",
        })
    }));
    conv.ask(new Suggestions('My invoice', "News today"));
});

app.intent(['FaturaPos - 55 10 20 40 88'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 20 40 88"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(`<speak>The value of May is ${bill} pesos. Do you want me to send you your invoice?</speak>`);
    conv.ask(new Suggestions('By E-mail', 'By Smartphone', 'By SMS'));
});

app.intent(['FaturaPos - 55 10 20 40 88 - now'], async (conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 20 40 88"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask("Ok, here's your invoice.");
    conv.ask(new BasicCard({
        text: `The value of May is ${bill} pesos.`,
        title: `Bill for ${deviceNumber}`,
        buttons: new Button({
            title: 'Download Bill',
            url: 'https://www.cinq.com.br/'
        }),
        image: new Image({
            url: "https://lh3.googleusercontent.com/W1Jwfw3dKIo8BsQFaLc0y4UflpgSUlDKiWn4LgjKXFW1Uxj1t8qfwYu987CnBDWdsENT",
            alt: "invoice-55-10-20-40-88",
        })
    }));
    conv.ask(new Suggestions('My invoice', "News today"));
});

app.intent('Latest News', async (conv) => {
    conv.ask("What news do you want to know? Entertainment, Lifestyle, Smartphones, Technology.");
    conv.ask(new Suggestions("Entertainment", "Lifestyle", "Smartphones", "Technology"));
});

app.intent('Latest News - Smartphones', async (conv) => {
    if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
        conv.ask('Sorry, this device does not support audio playback.');
        return;
    }
    conv.ask("Here is the latest news about Smartphones.")
    conv.ask(new MediaObject({
        name: 'The new Galaxy S20',
        url: 'http://cassadori.com.br/ClaroPromo_Internacional.mp3',
        description: "Get to know the advantages of Samsung's new smartphone."
    }));
    conv.ask("Do you would like to know more about Galaxy S20 or checking our other news?")
    conv.ask(new Suggestions(['More about Galaxy S20', 'Other news', 'Other matters']));
});

app.intent('Smartphone Price', async (conv) => {
    conv.ask("Galaxy S20 Ultra. 128GB 4G, costs 5,224,90 pesos. We have Gift. Would you like to know more about?");
    conv.ask(new Suggestions("Yes", "No"));
});

app.intent('Smartphone Price - yes', async (conv) => {
    conv.ask("Meet the Samsung Galaxy S20 Ultra 128GB 4G cell phone and take a free TV; If you are a Claro customer, change your financed Smartphone to 6,12,18 or 24 months on your bill. Get it in Kit Amigo and for your first recharge of 2000 or more, we will give you a Welcome Package.");
    conv.ask(new BasicCard({
        buttons: new Button({
            title: 'Buy now',
            url: 'https://tienda.claro.com.co/claro/celulares/samsung-galaxy-s20-128gb-ultra-4g-negro-con-obsequio'
        }),
        image: new Image({
            url: "https://tienda.claro.com.co/wcsstore/Claro/images/catalog/equipos/646x1000/70035008.jpg",
            alt: "Promo Samsung Galaxy S20 Ultra 128GB con Obsequio",
        })
    }));
    conv.ask(new Suggestions('My invoice', "News today"));
});

app.intent('Smartphone Price - no', async (conv) => {
    conv.ask("It's all right. Can I help you with someting else?");
    conv.ask(new Suggestions('My invoice', "News today"));
});

// Handle the Dialogflow follow-up intents
app.intent(['Movie Search - yes', 'Channel Search - yes'], (conv) => {
    conv.ask('Do you want to search channels, grades or movies?');
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);