// Load HTTP module
const axios = require('axios');
const express = require('express');

const port = 8000;
const app = express();

// Create HTTP server
app.get('/hello', (req, res) => {
    res.send('fuck Sender');
});
app.get('/', (req, res) => {
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
            var teams = response.data.league.franchises.franchise;
            teams.forEach(team => {
                teamMap.set(team.id, team.name);
            });

            var config = {
                method: 'get',
                url: 'https://www54.myfantasyleague.com/2020/export?L=17959&JSON=1&TYPE=leagueStandings',
                headers: { 
                    'Cookie': 'MFL_LAST_LEAGUE_ID=17959'
                }
            };
  
            return axios(config);
        })
        .then(function (response) {
            var rankings = response.data.leagueStandings.franchise;
            var standings = [];
            rankings.forEach(rank => {
                standings.push(teamMap.get(rank.id));
            });
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(standings));
        });  
});

// Prints a log once the server starts listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
