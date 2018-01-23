'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const app = express();

const omdbApiKey = '6309d892';

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/get-movie-details', function (req, res) {

    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'Blade Runner';
    let reqUrl = encodeURI('https://www.omdbapi.com/?apikey='+ omdbApiKey +'&t=' + movieToSearch);

    request(reqUrl, function(error, response, body) {

      var movie = JSON.parse(body);

      if(movie.Response == 'True') {

        let dataToSend = movieToSearch === 'Blade Runner' ? 'I don\'t have the required info on that. Here\'s some info on \'Blade Runner\' instead.\n' : '';
        dataToSend = movie.Title + ' is a ' + movie.Year + ' ' + movie.Genre + ' movie, directed by ' + movie.Director + '.';

        res.json({
          speech: dataToSend,
          displayText: dataToSend,
          source: 'get-movie-details'
        });

        console.log(movie);

    } else {

      let dataToSend = 'We could not find any entry in the database, sorry.';

      res.json({
        speech: dataToSend,
        displayText: dataToSend,
        source: 'get-movie-details'
      });

    }

  });

});

app.listen(app.get('port'), function() {
	console.log('Running on port', app.get('port'));
})
