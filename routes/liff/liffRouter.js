const express = require('express');
const router = express.Router();

router.get('/qrdisplay', function(req, res, next) {
    res.render('liff/activity/welcomePartyQRDisplay', {
        title: '冒險者 QR Code',
        cssList: ['/stylesheets/common/bootstrap.min.css', '/stylesheets/activity/welcomeParty.css'],
        jsList: ['/javascripts/component/liff.min.js', '/javascripts/component/qrious.min.js', '/javascripts/activity/welcomePartyQRDisplay.js']
    });
});

module.exports = router;
