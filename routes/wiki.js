const router = require('express').Router();
const models = require('../models');
var Page = models.Page;
var User = models.User;

// title: {
// urlTitle: {
// content: {
// status: {
// date: {

router.get('/', function(req, res){
  res.redirect('/');
});

router.post('/', function(req, res){
  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  })

  page.save().then(function() {
    res.json(page);
  })
});

router.get('/add', function(req, res){
  res.render('addpage')
});

module.exports = router;
