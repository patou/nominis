var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var removeAccents = require('remove-accents');
var sleep = require('system-sleep');

var data = {date: {}, names:{}};
var dataNames = [];

function convert(name) {
  //var output = iconv.decode(name, "iso-8859-1");
  //var str = iconv.encode(output, "UTF-8");
  return name;
}

function toId(name) {
  return cleanName(removeAccents(name).toLowerCase());
}

function cleanName(name) {
  return name.replace(/\(.*\)/g,'').replace(/\s/g, '-');
}

function getSynonyms(name) {
  var names = [];
  var nameCleaned = cleanName(name);
  names.push(nameCleaned);
  names.push(removeAccents(nameCleaned));
  names.push(toId(nameCleaned));
  var alternate = name.replace(/[\(\)]/g, '');
  if (alternate !== nameCleaned) {
    names.push(alternate);
    names.push(removeAccents(alternate));
    names.push(toId(alternate));
  }
  return names;
}

function getName(link, major) {
  var gender = {"sexe0": "female", "sexe1": "male", "sexe2": "mixte"};
  var name = link.text();

  var kind = gender[link.attr('class')];
  //console.log(kind);
  var linkHref = link.attr('href');
  var obj = {id : toId(name), name, kind, link: linkHref, synonyms:getSynonyms(name)};
  if (major) {
    obj.major = major;
  }
  return obj;
}

function findNames(html) {
  var names = [];
  var $ = cheerio.load(convert(html));
  var title = $(".span5 > h3");
  var image = $('img.img-polaroid').attr('src');
  if (title.text() === "Bonne Fête !") {
    var container = title.next().children("dl");
    var major = "";
    container.children().each(function (i, el) {
      switch (el.name) {
        case "dt":
          var name = getName($(this).children("a"));
          major = name.name;
          names.push({...name, image});
          break;
        case "dd":
          $(this).find("a").each(function(i, el) {
            var name = getName($(this), major);
            names.push({...name, image});
          });
          break;
        default:
      }
    });
  }
  /*$(".sexe1").each(function(i, element){
    var name = $(this).text().toLowerCase();
    data.name[name] = date;
    names.push(name);
  });
  $(".sexe0").each(function(i, element){
    var name = $(this).text().toLowerCase();
    data.name[name] = date;
    names.push(name);
  });*/
  return names;
}

function load(url) {
  return  new Promise(function(resolve, reject) {
      request({url, encoding: 'latin1'}, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        resolve(findNames(html));
      }
      else {
        console.error(`${response.statusCode}: ${url} ${error}`);
        reject(error);
      }
    });
  });
}

function grabDataFromAEvent(elem, index, array) {
    // Grab the data from the game object you need
    var dateWithYear = elem['DTSTART;VALUE=DATE'];
    var date = dateWithYear.substring(4);
    var summary = elem['SUMMARY'];
    var saint = summary.substring(0, summary.lastIndexOf("-")-1);
    var description = elem['DESCRIPTION'];
    var url = description.substring(description.lastIndexOf("\\n")+2);
    sleep(50);
    return load(url).then(names => {
      console.log(`Load ${date} with ${names.length} names`);
      var dateObj = {date, saint, url, names : []}
      names.forEach(name => {
          data.names[name.id] = {...name, date};
          if (!name.major) {
            dateObj.names.push(name.name);
            dateObj.image = name.image;
          }
          dataNames.push({
              "value": toId(name.name),
              "synonyms": name.synonyms
          });
      });
      data.date[date] = dateObj;
    });
}

function saveToFile(){
    var promises = [];
    console.log(`Save to ./functions/data.json`);
    var file = fs.openSync('./functions/data.json', 'w');
    promises.push(fs.writeSync(file, JSON.stringify(data)));
    console.log(`Save to ./functions/names.json`);
    var fileNames = fs.openSync('./functions/names.json', 'w');
    promises.push(fs.writeSync(fileNames, JSON.stringify(dataNames)));
    return Promise.all(promises);
}

function main() {
  var results = JSON.parse(fs.readFileSync('nominis2018.json', 'utf8'));
  var events = results['VCALENDAR'][0]['VEVENT'];
  console.log(`Convert ${events.length} events`);
  Promise.all(events.map(grabDataFromAEvent)).then(saveToFile).catch(error => {
    console.error("Erreur de conversion :", error);
  });
}


module.exports = {findNames, toId, getSynonyms, grabDataFromAEvent, load, convert, main};
