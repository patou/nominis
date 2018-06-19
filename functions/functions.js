const moment = require('moment');
moment.locale("fr");
const data = require('./data.json');

function formatDate(date) {
  var momentDate = typeof(date) === "string" && date.length == 4 ? moment(date, "MMDD") : moment(date);
  switch (momentDate.startOf("day").diff(moment().startOf('day'), 'day')) {
    case 0:
      return "aujourd'hui"
    case 1:
      return "demain"
    case -1:
      return "hier"
    default:
      return momentDate.format('[le] D MMMM')
  }
}

function joinList(list = []) {
  var ret;
  switch (list.length) {
    case 0:
      ret = '';
      break;
    case 1:
      ret = list[0];
      break;
    default:
      var last = list.pop();
      ret = list.join(", ") + " et " + last;
  }
  return ret;
}

function startBy(str) {
  return (str.startsWith("Saint")) ? `la ${str}` : str;
}

function fete(md, name) {
  var datefest = getDate(md);
  if (datefest && datefest.saint && datefest.saint.toLowerCase().indexOf(name.toLowerCase()) < 0) {
    return `nous fêtons ${startBy(datefest.saint)}`;
  }
  return '';
}

function getName(name) {
  return data.names[name];
}

function getDate(date) {
  return data.date[date];
}

function nameExist(name) {
  return !!data.names[name];
}

function dateExist(date) {
  return !!data.date[date];
}

function toUrl(uri) {
  return "https://nominis.cef.fr" + uri;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buildMessageDate(msg, data) {
  msg = capitalizeFirstLetter(msg);
  return {
    fulfillmentText: msg,
    fulfillmentMessages: [
      {
        "platform": "ACTIONS_ON_GOOGLE",
        "simple_responses" : {
          "simple_responses": [{
              "textToSpeech" : msg
          }]
        }
      },
      {
        "platform": "ACTIONS_ON_GOOGLE",
        "basic_card": {
          "title": capitalizeFirstLetter(formatDate(data.date)),
          "subtitle": capitalizeFirstLetter(startBy(data.saint)),
          "formattedText": msg,
          "image": {
            "imageUri": toUrl(data.image),
            "accessibility_text": capitalizeFirstLetter(startBy(data.saint))
          },
          "buttons": [
            {
              "title": "Plus d'informations",
              "openUriAction": {
                 "uri": toUrl(data.url),
              },
            }
          ],
        }
      },
      {
        "platform": "FACEBOOK",
        "card": {
          "title": capitalizeFirstLetter(formatDate(data.date)),
          "subtitle": capitalizeFirstLetter(startBy(data.saint)),
          "imageUri": toUrl(data.image),
          "buttons": [
            {
              "text": "Plus d'informations",
              "postback": toUrl(data.url),
            }
          ],
        }
      }
    ]
  };
}

function buildMessageName(msg, data) {
  msg = capitalizeFirstLetter(msg);
  var messages = [
    {
      "platform": "ACTIONS_ON_GOOGLE",
      "simple_responses" : {
        "simple_responses": [{
            "textToSpeech" : msg
        }]
      }
    }
  ];
  var dates = Array.isArray(data.date) ? data.date : [data.date];
  var basicCard;
  dates.forEach(date => {
    var dataDate = getDate(date);
    if (!basicCard) {
      basicCard = {
        "platform": "ACTIONS_ON_GOOGLE",
        "basic_card": {
          "title": capitalizeFirstLetter(formatDate(date)),
          "subtitle": capitalizeFirstLetter(startBy(dataDate.saint)),
          "formattedText": msg,
          "image": {
            "imageUri": toUrl(dataDate.image),
            "accessibility_text": capitalizeFirstLetter(startBy(dataDate.saint))
          },
          "buttons": [
          ],
        }
      };
    }
    basicCard["basic_card"].buttons.push({
      "title": capitalizeFirstLetter(formatDate(date)),
      "openUriAction": {
         "uri": toUrl(dataDate.url),
      },
    }
    );
    messages.push({
      "platform": "FACEBOOK",
      "card": {
        "title": capitalizeFirstLetter(formatDate(date)),
        "subtitle": capitalizeFirstLetter(startBy(dataDate.saint)),
        "imageUri": toUrl(dataDate.image),
        "buttons": [
          {
            "text": "Plus d'informations",
            "postback": toUrl(dataDate.url),
          }
        ],
      }
    });
  });
  messages.push(basicCard);
  return {
    fulfillmentText: msg,
    fulfillmentMessages: messages
  };
}

module.exports = {formatDate, startBy, fete, getName, getDate, nameExist, dateExist, joinList, buildMessageDate, buildMessageName, capitalizeFirstLetter}
