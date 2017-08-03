const router = require('express').Router();
const wikiRouter = require('./wiki');

router.use('/wiki', wikiRouter);

router.get('/', function(req, res){
  res.render('index');
})

module.exports = router;
