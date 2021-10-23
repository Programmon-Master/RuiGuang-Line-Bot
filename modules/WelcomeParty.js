const sharp = require('sharp');
const fs = require('fs');
const { UserActivityHistory } = require('../model/activity/UserActivityHistory');

const PICBDIR = 'public/images/welcomeparty_pointcard/';
const rawPointcard = PICBDIR + 'pointcard.png';
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
  }
}

module.exports = class WelcomeParty {
  #uid; #stage; #res;
  constructor(req, res) {

    this.#uid = req.body.uid;
    this.#stage = req.body.stage;
    this.#res = res;
  }


  #NewUserActivity(uid) {
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


  #Composite(pointcard, output, uid, stage, res) {
    UserActivityHistory.updateOne({
      'uid': uid
    }, 
    {'$set': {
      'activity.$[actId].pointcard.cardField.$[cardId].value': true
    }}, 
    { "arrayFilters": [
      { "actId.name": actName },
      { "cardId.name": stage }
    ] }, function(err, result) {
      if(err) {
        console.log('Update pointcard status error, '+err);
        res.status(400).send({msg: err});
      }
      console.log('Update pointcard status success!!');

      const tmp = output.split('.')[0]+'_tmp.png';
      sharp.cache(false);
      sharp(pointcard)
        .composite([{ 
          input: stamp[stage].stamp, 
          left: stamp[stage].coord[0],
          top: stamp[stage].coord[1],
        }])
        .toFile(tmp, (err, info) => {
          if(!err) {
            fs.rename(tmp, output, (err) => {
              if(err) {
                console.log('Rename file error!!')
                res.status(400).send({msg: err});
              } else {
                console.log('Stamped!!')
                res.status(200).send({msg: 'success!!'});
              }
            });
          } else {
            console.log('Composite error!!')
            res.status(400).send({msg: err});
          }
        });
      return;
    });
  }


  Stamped() {
    const uid = this.#uid;
    const newUserActivity = this.#NewUserActivity(uid);
    const Composite = this.#Composite;
    const res = this.#res;
    const stage = this.#stage;

    UserActivityHistory.findOne({ uid: uid }, function (err, userActivity) {
      if(err) {
        console.log('Query uid error, '+err);
        res.status(400).send({msg: err});
        return;
      }
  
      if(!userActivity) {
        // create user and activity (async)
        UserActivityHistory.create(newUserActivity, function (err, newUserActivity) {
          if(err) {
            console.log('Create new user error, '+err);
            res.status(400).send({msg: err});
            return;
          }
          // create success!
          console.log('Create new user success!!');

          const output = PICBDIR + `users/${ uid }.png`;
          Composite(rawPointcard, output, uid, stage, res);
        });
      } else {
        const output = PICBDIR + `users/${ uid }.png`;
        const pointcard = PICBDIR + `users/${ uid }.png`;
        Composite(pointcard, output, uid, stage, res);
      }
    });
  }
}