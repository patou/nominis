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

module.exports = {formatDate, startBy, fete, getName, getDate, nameExist, dateExist, joinList}
