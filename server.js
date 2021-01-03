// Load HTTP module
const http = require("http");
const querystring = require("querystring");
const axios = require('axios');

// const JSON = 

const hostname = "localhost";
const port = 8000;

// Create HTTP server
const server = http.createServer((req, res) => {

  var config = {
    method: 'get',
    url: 'https://www54.myfantasyleague.com/2020/export?L=17959&JSON=1&TYPE=league',
    headers: { 
      'Cookie': 'MFL_LAST_LEAGUE_ID=17959'
    }
  };
  var teamMap = new Map();
  axios(config)
  .then(function (response) {
    // Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, {'Content-Type': 'application/json'});
    // res.end();
    // Send the response body "Hello World"
    var teams = response.data.league.franchises.franchise
    teams.forEach(team => {
       teamMap.set(team.id, team.name)
    });

    var config = {
      method: 'get',
      url: 'https://www54.myfantasyleague.com/2020/export?L=17959&JSON=1&TYPE=leagueStandings',
      headers: { 
        'Cookie': 'MFL_LAST_LEAGUE_ID=17959'
      }
    };
  
    return axios(config)
  })
  .then(function (response) {
    var rankings = response.data.leagueStandings.franchise;
    var standings = [];
    rankings.forEach(rank => {
      standings.push(teamMap.get(rank.id))
    }) // render on server side html list, handlebars
    res.end(JSON.stringify(standings));
  })  
});

// Prints a log once the server starts listening
server.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})

// 