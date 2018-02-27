const moment = require('moment');
moment.locale("fr");
const data = require('./data.json');

function formatDate(date) {
  switch (date.diff(moment().startOf('day'), 'day')) {
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

module.exports = {formatDate, startBy, fete, getName, getDate, nameExist, dateExist}
