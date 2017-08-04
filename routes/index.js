const router = require('express').Router()
const models = require('../models');
const Promise = require('bluebird');
var Page = models.Page;
var User = models.User;


router.use('/wiki', require('./wiki'))
router.use('/users', require('./users'))

router.get('/', function(req, res){
  res.render('index')
})

router.get('/search', function(req, res){
  Page.findByTag(req.query.tagsearch)
  .then(function(pages){

    var pagesPromises = pages.map(function(page){
      return page.getAuthor()
    })

    Promise.all(pagesPromises)
    .then(function(users){
      res.render('tagsearch', {
        pages: pages,
        users: users,
        currentTag: req.query.tagsearch
      });
    })
  })
})


module.exports = router
