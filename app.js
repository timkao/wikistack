const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const router = require('./routes');
const models = require('./models');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: true});

models.db.sync({force: true, logging: false})
.then(function(){
  return models.seed()
})
.then(function(){
  app.listen(port, function(){
    console.log(`listening on port ${3000}`);
  })
})
