const router = require('express').Router();
const models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res){
  Page.findAll({})
    .then(function(pages) {
      res.render('index', { pages });
    })
});

router.post('/', function(req, res){
  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  })

  User.findOrCreate({
    where: {
      name: req.body.name
    }, defaults: {
      email: req.body.email
    }
  }).then(function(result) {
    return page.save().then(function() {
      return page.setUser(result[0]);
    });
  }).then(function(savedPage) {
    res.redirect(savedPage.route);
  });
});

router.get('/add', function(req, res){
  res.render('addpage')
});

router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  }).then(function(page) {
    if (!page) return res.render('addpage');
    User.findOne({
      where: {
        id: page.userId
      }
    }).then(function(user) {
      res.render('wikipage', { page, user });
    })
  })
});


module.exports = router;
