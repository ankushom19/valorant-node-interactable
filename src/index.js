const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
const fs = require("fs");
const stringify = require('json-stringify-safe');

app();

function app() {


  var RiotUser = 'user id';
  var RiotPass = 'pass';
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

    var writeStream = fs.createWriteStream("PlayerHistory" + valorantApi.user_id + ".json");

    writeStream.write(data);
    writeStream.end();
  });
}

function PlayerMMR() {

  function calculateElo(tier, progress) {
    return ((tier * 100) - 300) + progress;
  }

  valorantApi.getPlayerMMR(valorantApi.user_id).then((response) => {
    if (response.data.LatestCompetitiveUpdate) {
      const update = response.data.LatestCompetitiveUpdate;
      var elo = calculateElo(update.TierAfterUpdate, update.RankedRatingAfterUpdate);


      var writeStream = fs.createWriteStream("PlayerMMR" + valorantApi.user_id + ".txt");

      writeStream.write("Make Sure Your Last Game Was competitive" + '  /  ' + `Movement: ${update.CompetitiveMovement}` + ' , ' + `Current Tier: ${update.TierAfterUpdate}(${Valorant.Tiers[update.TierAfterUpdate]})` + ' , ' + `Current Tier Progress:${update.RankedRatingAfterUpdate}/100` + ' , ' + `Total Elo: ${elo}`);
      writeStream.end()
    } else {
      console.log("No competitive update available. Have you played a  competitive match yet ? ");
    }

  });
}