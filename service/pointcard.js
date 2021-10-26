const sharp = require('sharp');
const fs = require('fs');
const { UserActivityHistory } = require('../model/activity/UserActivityHistory');

const baseUrl = process.env.BASE_URL;

const PICBDIR = process.cwd() + '/images/welcomeparty_pointcard/';
const LOCALPICBDIR = process.cwd() + '/public/images/welcomeparty_pointcard/';
const rawPointcard = process.cwd() + '/public/images/welcomeparty_pointcard/pointcard.png';
const actName = '瑞光島登島慶典：冒險啟程';
const stamp = {
  '法律圈圈部落': {
    stamp: PICBDIR + 'stamp_law.png',
    coord: [191, 178]
  },
  '醫療嗡嗡部落': {
    stamp: PICBDIR + 'stamp_health.png',
    coord: [240, 81]
  },
  '花園水水部落': {
    stamp: PICBDIR + 'stamp_garden.png',
    coord: [142, 81]
  },
  '凹豆球球部落': {
    stamp: PICBDIR + 'stamp_outdoor.png',
    coord: [93, 178]
  },
  '文創響響部落': {
    stamp: PICBDIR + 'stamp_creative.png',
    coord: [44, 81]
  },
  '運動動茲部落': {
    stamp: PICBDIR + 'stamp_sport.png',
    coord: [289, 178]
  },
  '闖關完成': {
    stamp: PICBDIR + 'finished.png',
    coord: [100, 81]
  }
}

const ErrorLogger =  (err, status) => {
  console.log(err);
}

function newUserActivity(uid) {
    return {
        uid: uid,
        activity: [{
        name: actName,
        startDateTime: new Date(2021, 9, 30, 10),
        endDateTime: new Date(2021, 9, 30, 12),
        pointcard: {
            status: false,
            cardField:[
            {
                name: Object.keys(stamp)[0],
                type: 'Bool',
                value: false
            },
            {
                name: Object.keys(stamp)[1],
                type: 'Bool',
                value: false
            },
            {
                name: Object.keys(stamp)[2],
                type: 'Bool',
                value: false
            },
            {
                name: Object.keys(stamp)[3],
                type: 'Bool',
                value: false
            },
            {
                name: Object.keys(stamp)[4],
                type: 'Bool',
                value: false
            },
            {
                name: Object.keys(stamp)[5],
                type: 'Bool',
                value: false
            },
            ]
        }
        }]
    }
}

module.exports = async function getPointCard(context) {
    const uid = context.session.user.id;
    const newUser = newUserActivity(uid);

    UserActivityHistory.findOne({ uid: uid }, function (err, userActivity) {
      if(err) { ErrorLogger('Query uid error, '+err, 400); return; }

      const output = LOCALPICBDIR + `users/${ uid }.png`;
      const url = output.replace(process.cwd(), '').split('/').slice(1).join('/');

      console.log(url);
      console.log((baseUrl + url).replace('public/', ''));
      if(!userActivity) {
        // create user and activity (async)
        UserActivityHistory.create(newUser, function (err, userActivity) {
          if(err) { ErrorLogger('Create new user error, '+err, 400); return; }

          // create success!
          console.log('Create new user success!!');
          sharp.cache(false);
          sharp(rawPointcard)
            .toFile(output, (err, info) => {
              if(err) { ErrorLogger('Create pointcard error, '+err, 400); return; }
              // send image
              context.sendImage({
                originalContentUrl: (baseUrl + url).replace('public', ''),
                previewImageUrl: (baseUrl + url).replace('public', ''),
              });
            });
        });
      } else {
        // send image
        context.sendImage({
            originalContentUrl: (baseUrl + url).replace('public', ''),
            previewImageUrl: (baseUrl + url).replace('public', ''),
        });
      }
    });
}