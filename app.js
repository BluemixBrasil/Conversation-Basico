/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path'),
fs = require('fs');

var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
var cloudant = require('cloudant')('https://00875567-fecf-466b-8992-bc616a7a698a-bluemix:933c2d8d3d11473e408cc5ee864814a9834ab32b398ac22deeec663e5d49e09e@00875567-fecf-466b-8992-bc616a7a698a-bluemix.cloudant.com');
cloudant = cloudant.db.use('vaidb');

var watson = require('watson-developer-cloud');

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

app.get('/', routes.index);

var conversation = watson.conversation({
  username:'6f8b8ad7-c4b1-4c59-ac56-034744df982d',
  password:'BHiRNqxo8EXH',
  version: 'v1',
  version_date: '2016-07-11'
});

// var tone_analyzer = new ToneAnalyzerV3({
//   username: 'a7369f85-8719-4912-aa66-2121a9271a4a',
//   password: 'VzogJsqlxlJ6',
//   version_date: '2016-05-19'
// });

// tone_analyzer.tone({ text: 'Greetings from Watson Developer Cloud!' },
//   function(err, tone) {
//     if (err)
//       console.log(err);
//     else
//       console.log(JSON.stringify(tone, null, 2));
// });


// var language_translation = watson.language_translation({
//   username: 'aea90495-46a8-4a07-b7ba-0d12fc96ab26',
//   password: 'XyrwWZksVk7W',
//   version: 'v2'
// });
// language_translation.translate({
//     text: 'hello',
//     source: 'pt',
//     target: 'en'
//   }, function(err, translation) {
//     if (err)
//       console.log(err)
//     else
//       console.log(translation);
// });

var workspace = '271654e5-008e-486e-9242-c294be080bdc';


app.post('/converse', function(req, res, next) {
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };
  
  if (req.body) {
    if ( req.body.input ) {
      payload.input = {text: req.body.input};
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }
  }else{
    payload = {};
      }
  conversation.message(payload, function(err, data){
    if ( err ) {
      console.log(err);
    }else{

      // if(!data.output.text[0]){
      //   data.output.text[0] = resposta[data.intents[0].intent];
      // }
      return res.json(data);
    }
  });

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

