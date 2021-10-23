var express = require('express');
var router = express.Router();
const WelcomeParty = require('../../../modules/WelcomeParty');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Stamped
router.post('/checkpoint', function(req, res, next) {
  const welcomParty = new WelcomeParty(req, res);
  welcomParty.Stamped();
});


// Drawed
router.post('/drawed', function(req, res, next) {
  const welcomParty = new WelcomeParty(req, res);
  welcomParty.Drawed();
});


module.exports = router;

