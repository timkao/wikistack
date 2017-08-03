const router = require('express').Router();

router.use('/wiki', require('./wiki'));
router.use('/user', require('./user'));

router.get('/', function(req, res){
  res.render('index');
})

module.exports = router;
