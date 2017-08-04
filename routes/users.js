const router = require('express').Router();
const models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  User.findAll({}).then(function(users) {
    res.render('users', { users: users });
  })
})

router.get('/:id', function(req, res, next) {
  console.log('hit');
  Page.findAll({
    where: {
      userId: req.params.id*1
    }
  }).then(function(pages) {
    res.render('index', { pages });
  })

})

module.exports = router;
