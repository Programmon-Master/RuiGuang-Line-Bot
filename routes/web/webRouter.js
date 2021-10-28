const express = require('express');
const router = express.Router();

router.get('/qrentry', function(req, res, next) {
    console.log(req.body);
    res.render('web/activity/welcomePartyTribeScanner', {
        title: '關主掃描器',
        cssList: ['/stylesheets/common/bootstrap.min.css', '/stylesheets/activity/welcomeParty.css'],
        jsList: ['/javascripts/component/jsQR.min.js', '/javascripts/activity/welcomePartyTribeScanner.js']
    });
});

module.exports = router;