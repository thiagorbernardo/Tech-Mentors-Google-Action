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
            context: `Hi there, to get to know you better`,
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Hi again, ${name}. What do you want to know?`);
    }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        // If the user denied our request, go ahead with the conversation.
        conv.ask(`OK, no worries. What do you want to know?`);
        conv.ask(new Suggestions('Search for Star Wars', "What's the number of Fox?", "What's the grade in Telecine Premium?"));
    } else {
        // If the user accepted our request, store their name in
        // the 'conv.data' object for the duration of the conversation.
        conv.user.storage.userName = conv.user.name.display;
        conv.ask(`Thanks, ${conv.user.storage.userName}. What do you want to know?`);
        conv.ask(new Suggestions('Search for Star Wars', "What's the number of Fox?", "What's the grade in Telecine Premium?"));
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
// The intent collects a parameter named 'channelName'.
app.intent('FaturaPos', async (conv) => {
    if (!conv.user.storage.userName) {
        conv.ask(new Permission({
            context: `You need to let me see your name"`,
            permissions: 'NAME',
        }));
    } else {
        const name = conv.user.storage.userName;
        conv.ask(`${name}, which number do you want to know?`);
        conv.ask(new Suggestions('55 10 10 20 99', '55 10 20 40 88'));

    }
});
app.intent(['FaturaPos - 55 10 10 20 99'], async(conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 10 20 99"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(`<speak>The value of the invoice for ${deviceNumber} from May is ${bill}. Do you wanna send it to you email or prefer to receive it now?</speak>`);
    conv.ask(new Suggestions('E-mail', 'Now'));
});

app.intent(['FaturaPos - 55 10 20 40 88'], async(conv) => {
    const name = conv.user.storage.userName;
    const deviceNumber = "55 10 20 40 88"
    const bill = await getBillByName(name, deviceNumber)
    conv.ask(`<speak>The value of the invoice for ${deviceNumber} from May is ${bill}. Do you wanna send it to you email or prefer to receive it now?</speak>`);
    conv.ask(new Suggestions('E-mail', 'Now'));
});

// Handle the Dialogflow follow-up intents
app.intent(['Movie Search - yes', 'Channel Search - yes'], (conv) => {
    conv.ask('Do you want to search channels, grades or movies?');
    // If the user is using a screened device, display the carousel
    //if (conv.screen) return conv.ask(optionsCarousel());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);