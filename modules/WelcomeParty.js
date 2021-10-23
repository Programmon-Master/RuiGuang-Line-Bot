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
  },
  '闖關完成': {
    stamp: PICBDIR + 'finished.png',
    coord: [100, 81]
  }
}
const ErrorLogger =  (err, status, res) => {
  console.log(err)
  res.status(status).send({msg: err});
}

module.exports = class WelcomeParty {
  #req; #res;

  constructor(req, res) {
    this.#req = req;
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


  Composite(pointcard, output, stage, res) {
    const tmp = output.split('.')[0]+'_tmp.png';
    const url = output.split('/').slice(1).join('/');

    sharp.cache(false);
    sharp(pointcard)
      .composite([{ 
        input: stamp[stage].stamp, 
        left: stamp[stage].coord[0],
        top: stamp[stage].coord[1],
      }])
      .toFile(tmp, (err, info) => {
        if(err) { ErrorLogger('Composite error, '+err, 400, res); return; }

        fs.rename(tmp, output, (err) => {
          if(err) { ErrorLogger('Rename file error, '+err, 400, res); return; }

          console.log('Stamped!!')
          res.status(200).send({msg: 'success!!', url: url});
        });
      });
  }


  #UpdateCardStatus(Composite, pointcard, output, uid, stage, res) {
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
      if(err) { ErrorLogger('Update pointcard status error, '+err, 400, res); return; }

      console.log('Update pointcard status success!!');
      Composite(pointcard, output, stage, res);
    });
  }


  Stamped() {
    const uid = this.#req.body.uid;
    const stage = this.#req.body.stage;
    const newUserActivity = this.#NewUserActivity(uid);
    const UpdateCardStatus = this.#UpdateCardStatus;
    const Composite = this.Composite;
    const res = this.#res;

    UserActivityHistory.findOne({ uid: uid }, function (err, userActivity) {
      if(err) { ErrorLogger('Query uid error, '+err, 400, res); return; }
  
      if(!userActivity) {
        // create user and activity (async)
        UserActivityHistory.create(newUserActivity, function (err, newUserActivity) {
          if(err) { ErrorLogger('Create new user error, '+err, 400, res); return; }

          // create success!
          console.log('Create new user success!!');
          const output = PICBDIR + `users/${ uid }.png`;
          UpdateCardStatus(Composite, rawPointcard, output, uid, stage, res);
        });
      } else {
        const output = PICBDIR + `users/${ uid }.png`;
        const pointcard = PICBDIR + `users/${ uid }.png`;
        UpdateCardStatus(Composite, pointcard, output, uid, stage, res);
      }
    });
  }


  GetPointcard() {
    const uid = this.#req.body.uid;
    const newUserActivity = this.#NewUserActivity(uid);
    const res = this.#res;

    UserActivityHistory.findOne({ uid: uid }, function (err, userActivity) {
      if(err) { ErrorLogger('Query uid error, '+err, 400, res); return; }
      
      const output = PICBDIR + `users/${ uid }.png`;
      const url = output.split('/').slice(1).join('/');
      if(!userActivity) {
        // create user and activity (async)
        UserActivityHistory.create(newUserActivity, function (err, newUserActivity) {
          if(err) { ErrorLogger('Create new user error, '+err, 400, res); return; }

          // create success!
          console.log('Create new user success!!');
          sharp.cache(false);
          sharp(rawPointcard)
            .toFile(output, (err, info) => {
              if(err) { ErrorLogger('Create pointcard error, '+err, 400, res); return; }     
              res.status(200).send({msg: 'success!!', url: url});
            });
        });
      } else {
        res.status(200).send({msg: 'success!!', url: url});
      }
    });
  }


  Drawed() {
    const uid = this.#req.body.uid;
    const res = this.#res;
    const Composite = this.Composite;

    UserActivityHistory.findOne({ 
      "uid": uid
    }, function (err, result) {
      if(err) { ErrorLogger('Query drawed status error, '+err, 400, res); return; } 
      if(!result) { ErrorLogger('Cannot get the uid!!', 400, res); return; }

      const act = result.activity.filter(act => act.name===actName);
      if(act.length !== 1) { ErrorLogger('Multiple same activity', 400, res); return; }

      const point = act[0].pointcard.cardField.filter(card => card.value===true);
      if(point.length !== 6) { ErrorLogger('Do not collect 6 stamp!!', 400, res); return; }
      if(act[0].pointcard.status === 1) { ErrorLogger('Already drawed!!', 400, res); return; }

      act[0].pointcard.status = true;
      result.save().then(savedDoc => {
        if(savedDoc !== result) { ErrorLogger('Drawed status update error', 400, res); return; }

        const output = PICBDIR + `users/${ uid }.png`;
        const pointcard = PICBDIR + `users/${ uid }.png`;
        const stage = '闖關完成';
        Composite(pointcard, output, stage, res);
      });
    })
  }
}