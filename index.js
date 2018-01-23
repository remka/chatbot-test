const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');

const apiKey = '6309d892';

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', function (req, res) {

    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'Blade Runner';
    let reqUrl = encodeURI('https://www.omdbapi.com/?apikey='+ apiKey +'&t=' + movieToSearch);

    /*
    request(reqUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         res.json(body);
      } else {
        return res.json({
          speech: 'Something went wrong!',
          displayText: 'Something went wrong!',
          source: 'get-movie-details'
        });
      }
    })
    */

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
      //res.send(movie);
    });

    /*
    request
    .get('https://www.omdbapi.com/?apikey=6309d892&t=gojira')
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    })
    */

    /*
    request('https://jsonplaceholder.typicode.com/users', function(error, response, body) {
      var jsonBody = JSON.parse(body);
      var first = jsonBody[0];
      res.send(first);
    });
    */



});

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});
