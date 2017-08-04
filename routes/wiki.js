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

  var tagArr = req.body.tags.split(' ');

  var page = Page.build({
    title: req.body.title,
    content: req.body.content,
    tags: tagArr
  })

  User.findOrCreate({
    where: {
      name: req.body.name
    }, defaults: {
      email: req.body.email
    }
  }).then(function(result) {
    return page.save().then(function() {
      return page.setAuthor(result[0]);
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
  })
  .then(function(page) {
    if (!page) return res.render('addpage');
      page.getAuthor().then(function(user){
      res.render('wikipage', { page: page, user: user});
    })
  })
  .catch(next)
});

router.get('/:urlTitle/similar', function(req, res){

  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(page){
    return Page.findAll({
      where: {
        tags: {
          $overlap: page.tags
        }
      }
    })
  })
  .then(function(result){
    var pieces = result.filter(function(ele){
      if (ele.urlTitle !== req.params.urlTitle) {
        return true;
      }
    })
    res.render('index', {pages: pieces})
  })


})

module.exports = router;
