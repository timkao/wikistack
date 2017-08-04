const router = require('express').Router();
const models = require('../models');
const Promise = require('bluebird');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  User.findAll({}).then(function(users) {
    res.render('users', { users: users });
  })
  .catch(next);
})

router.get('/:id', function(req, res, next) {

  var user = User.findById(req.params.id)
  var page = Page.findAll({where: {AuthorId: req.params.id}})

  Promise.all([user, page])
  .then(function(result){
    res.render('user', {user: result[0], pages: result[1]});
  })
  .catch(next)


})

module.exports = router;
