const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
const fs = require("fs");
const stringify = require('json-stringify-safe');


function MatchData() {

  var MatchID = "dd060740-cafa-49fe-b147-509fbf3abf3a";
  valorantApi.getMatch(MatchID).then((response) => {

    let data = stringify(response.data);

    var writeStream = fs.createWriteStream("MatchData" + MatchID + ".json");
    writeStream.write(data);
    writeStream.end();
  });
}

function PlayerMatchData() {
  valorantApi.getPlayerMatchHistory(valorantApi.user_id).then((response) => {

    let data = stringify(response.data);

    var writeStream = fs.createWriteStream("PlayerInfo" + valorantApi.user_id + ".json");

    writeStream.write(data);
    writeStream.end();
  });
}

function PlayerMMR() {
  valorantApi.getPlayerMMR(valorantApi.user_id).then((response) => {

    let data = stringify(response.data.LatestCompetitiveUpdate);

    var writeStream = fs.createWriteStream("PlayerMMR" + valorantApi.user_id + ".json");

    writeStream.write(data);
    writeStream.end();
  });
}

function RUN() {

  var RiotUser = 'username here';
  var RiotPass = 'password here';
  valorantApi.authorize(RiotUser, RiotPass).then(() => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("Press 1 For MatchData / 2 For Player Match History / 3 For Player MMR : ", input => {

      switch (input) {
        case "1":
          MatchData();
          break;
        case "2":
          PlayerMatchData();
          break;
        case "3":
          PlayerMMR();
          break;
        default:
          console.log("Choose The Correct Option");
      }
      readline.close();
    });
  });
}


RUN();