const express = require('express');
const router = express.Router();
const WelcomeParty = require('../../modules/WelcomeParty');
const tempPassword = process.env.TEMP_PWD;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Stamped
router.post('/checkpoint', function(req, res, next) {
  if(!req.body.password || req.body.password !== tempPassword) res.status(401).send({ msg: 'Password error' });
  const welcomParty = new WelcomeParty(req, res);
  welcomParty.Stamped();
});


// GetPointcard
router.post('/getpointcard', function(req, res, next) {
  const welcomParty = new WelcomeParty(req, res);
  welcomParty.GetPointcard();
});


// Drawed
router.post('/drawed', function(req, res, next) {
  if(!req.body.password || req.body.password !== tempPassword) res.status(401).send({ msg: 'Password error' });
  const welcomParty = new WelcomeParty(req, res);
  welcomParty.Drawed();
});


module.exports = router;

