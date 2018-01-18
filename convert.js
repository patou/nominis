var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');


var results = JSON.parse(fs.readFileSync('nominis2018.json', 'utf8'));
var events = results['VCALENDAR'][0]['VEVENT'];

var data = {date: {}, name:{}};

function convert(name) {
  //var output = iconv.decode(name, "iso-8859-1");
  //var str = iconv.encode(output, "UTF-8");
  return name;
}

function load(url, date) {
  return  new Promise(function(resolve, reject) {
      request({url, encoding: 'latin1'}, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(convert(html));
        var names = [];
        $(".sexe1").each(function(i, element){
          var name = $(this).text().toLowerCase();
          data.name[name] = date;
          names.push(name);
        });
        $(".sexe0").each(function(i, element){
          var name = $(this).text().toLowerCase();
          data.name[name] = date;
          names.push(name);
        });
        resolve(names);
      }
      else {
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
    data.date[date] = saint;
    return load(url, date);
}

function saveToFile(){
    var gameFile = fs.openSync('./functions/data.json', 'w');
    fs.writeSync(gameFile, JSON.stringify(data));
}
Promise.all(events.map(grabDataFromAEvent)).then(saveToFile).catch(error => {
  console.error("Erreur de conversion :", error);
});
