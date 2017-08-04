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

  var user = User.build({
    name: req.body.name,
    email: req.body.email
  })

  user.save().then(function() {
      return page.save;
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
    res.render('wikipage', { page })
  })
});


module.exports = router;
