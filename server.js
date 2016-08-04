/* Offer endpoints following */
/*
 * POST /entry
 * PUT /entry/:id
 * DELETE /entry/:id
*/

var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , _ = require('lodash')
  , Faker = require('faker')
  ;

var bodyParser = require('body-parser');

var models = require('./models');
//  , routes  = require('./routes')

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.set('port', process.env.PORT || 3124);
app.set('views', __dirname + '/views');

// Promise
var dbsyncPromise = models.sequelize.sync({ force: true }).then(()=> {   // force: drop table if exists
  _.times(3, ()=> {
    return models.Author.create({
      name: Faker.name.firstName(),
      email: Faker.internet.email(),
    }).then(author => {
      return author.createEntry({
        title: `Sample post by ${author.name}`,
        content: 'here is some content',
        category: 'faker',
      });
    });
  });
});

/* Define routes */
app.get('/', function (req, res) {
  res.send('hello');
});

app.get('/entry', function (req, res) {
  models.Entry.findAll().then(e => {
    res.json(e);
  });
});

/* ユーザの作成 */

app.post('/author', (req, res) => {
  const { name, email } = req.body;
  models.Author.create({ name, email })
    .then(a => {
      res.json(a);
    })
    .catch(e => {
      throw new Error(e);
    });
});

/* 記事の作成 */
app.post('/entry', function (req, res) {
  const { user_id, title, content, category } = req.body;
  const entry = {
    title, content, category
  };
  console.dir('body', req.body);
  models.Author.findOne({ where: {id: user_id} }).then(author => {
    author.createEntry(entry)
      .then(result => {
        res.json(result);
      })
      .catch(e => {
        throw new Error(e);
      });
  });
});

dbsyncPromise.then(() => {
  models.sequelize.sync().then(function() {
    http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  });
});
