'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const moment = require('moment');
moment.locale("fr");
const data = require('./data.json');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

function formatDate(date) {
  switch (date.diff(new Date(), 'day')) {
    case 0:
      return "aujourd'hui"
    case 1:
      return "demain"
    case -1:
      return "hier"
    default:
      return date.format('[le] D MMMM')
  }
}

function startBy(str) {
  return (str.startsWith("Saint")) ? `la ${str}` : str;
}

function fete(md, name) {
  var datefest = data.date[md];
  if (datefest && datefest.toLowerCase().indexOf(name) < 0) {
    return `nous fêtons ${startBy(data.date[md])}`;
  }
  return '';
}

/*
* Function to handle v2 webhook requests from Dialogflow
*/
function processV2Request (request, response) {
  // An action is a string used to identify what needs to be done in fulfillment
  let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
  // Parameters are any entites that Dialogflow has extracted from the request.
  let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
  // Contexts are objects used to track and store conversation state
  let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
  // Get the request source (Google Assistant, Slack, API, etc)
  let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
  // Get the session ID to differentiate calls from different users
  let session = (request.body.session) ? request.body.session : undefined;
  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'input.welcome': () => {
      sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      sendResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
    },
    'DATE': () => {
      getDate(parameters.date);
    },
    'NAME': () => {
      getName(parameters.name);
    },
    // Default handler for unknown or undefined actions
    'default': () => {
      let responseToUser = {
        //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
        //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
        fulfillmentText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
      };
      sendResponse(responseToUser);
    }
  };
  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }
  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();

  // Cherche la fête de la date
  function getDate(date) {
    if (!date) {
      date = new Date();
    }
    var momentDate = moment(date);
    var md = momentDate.format('MMDD');
    if (data.date[md]) {
      sendResponse(`${formatDate(momentDate)} nous fêtons ${startBy(data.date[md])}`);
    }
    else {
      sendResponse("Pas de saint à fêter pour ce jour là : " + momentDate.format('D MMMM'));
    }
  }

  //Cherche le nom et indique le jour de la fête.
  function getName(name) {
    if (!name) {
      sendResponse("Dites moi pour quel prénom vous voulez la fêtes.");
    }
    name = name.toLowerCase();
    if (data.name[name]) {
      var md = data.name[name];
      var momentDate = moment(data.name[name], "MMDD");
      sendResponse(`les ${name} sont fêtés ${formatDate(momentDate)} ${fete(md, name)}`);
    }
    else {
      sendResponse(`Le prénom ${name} n'a pas de fête associée.`);
    }
  }

  // Function to send correctly formatted responses to Dialogflow which are then sent to the user
  // Fonction utilitaire pour répondre envoyer une réponse.
  function sendResponse (responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {fulfillmentText: responseToUser}; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};
      // Define the text response
      responseJson.fulfillmentText = responseToUser.fulfillmentText;
      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      if (responseToUser.fulfillmentMessages) {
        responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
      }
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.outputContexts) {
        responseJson.outputContexts = responseToUser.outputContexts;
      }
      // Send the response to Dialogflow
      console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
      response.json(responseJson);
    }
  }
}