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

function fetchPage(pageNumber = 1, commit = new Commit()) {
  request
    .get(`http://bj.58.com/pinpaigongyu/pn/${pageNumber}/?minprice=${program.minimum}_${program.maximum}`)
    .end(function (err, data) {
      if (!err && data) {
        if (data.status === 200) {
          let $ = cheerio.load(data.text);
          if (haveContent($)) {
            fetchPage(pageNumber + 1, commit);
          }

          let arr = pageParser($);
          if (arr.length > 0) {
            Promise.all(arr.map(x => {
              let house = new House(x);
              return house.save();
            }))
              .then(houses => {
                commit.data = commit.data.concat(houses.map(house => house._id));
                console.log(pageNumber, 'one finish');
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            commit.save()
              .then(x => {
                console.log('finish');
              })
              .catch(erro => {
                console.log(erro);
              })
          }
        } else {
          console.log('status is' + data.status);
        }
      } else {
        console.log(err)
      }
    });
}

fetchPage();