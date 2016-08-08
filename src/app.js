require('../config.js')();

let request = require('superagent');
let cheerio = require('cheerio');

let program = require('commander');

let Commit = require('./models/commit');
let House = require('./models/house');

let pageParser = require('./parser/pageParser').parsePage;
let haveContent = require('./parser/pageParser').haveContent;

program
  .version('0.0.1')
  .option('-i, --minimum [min]', 'cheapest house')
  .option('-a, --maximum [max]', 'most exclusive house')
  .parse(process.argv);

function parsePos(content) {
  const lonMatch = "____json4fe.lon = '";
  const latMatch = "____json4fe.lat = '";
  let lonPos = content.indexOf(lonMatch);
  let lonEnd = content.indexOf("';", lonPos);
  let latPos = content.indexOf(latMatch);
  let latEnd = content.indexOf("';", latPos);
  let lon = content.substring(lonPos + lonMatch.length, lonEnd);
  let lat = content.substring(latPos + latMatch.length, latEnd);
  return { lon: Number(lon), lat: Number(lat) };
}

function fetchPosition(house) {
  return new Promise(function (resolve, reject) {
    request
      .get(`http://bj.58.com${house.url}`)
      .end(function (err, data) {
        if (!err && data) {
          let content = data.text;
          let {lon, lat} = parsePos(content);
          house.lon = lon;
          house.lat = lat;
          resolve(house);
        } else {
          reject(err + ' ' + house.url);
        }
      })
  })
}

function fetchPage(pageNumber = 1, commit = new Commit()) {
  request
    .get(`http://bj.58.com/pinpaigongyu/pn/${pageNumber}/?minprice=${program.minimum}_${program.maximum}`)
    .end(function (err, data) {
      if (!err && data) {
        if (data.status === 200) {
          let $ = cheerio.load(data.text);

          let arr = pageParser($);
          if (arr.length > 0) {
            Promise
              .all(arr.map(x => {
                let house = new House(x);
                return fetchPosition(house)
                  .then(house => {
                    return house.save();
                  });
              }))
              .then(houses => {
                commit.data = commit.data.concat(houses.map(house => house._id));
                console.log(pageNumber, 'finish');

                if (haveContent($)) {
                  return fetchPage(pageNumber + 1, commit);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            commit.save()
              .then(x => {
                console.log('all finish');
              })
              .catch(erro => {
                console.log(erro);
              })
          }
        } else {
          console.log('status is' + data.status);
        }
      } else {
        console.log(err);
      }
    });
}

fetchPage();