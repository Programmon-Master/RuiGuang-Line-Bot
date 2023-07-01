const { UserActivityHistory } = require('../model/activity/UserActivityHistory');

const baseUrl = process.env.BASE_URL;
const PICBDIR = 'public/images/welcomeparty_pointcard/';
const actName = '瑞光島登島慶典：冒險啟程';

const ErrorLogger =  (err) => {
  console.log(err);
}

module.exports = async function getPointCard(context) {
    const uid = context.session.user.id;

    console.log('uid:' + uid);

    UserActivityHistory.findOne({
        "uid": uid
    }, function (err, result) {
        if(err) { ErrorLogger('Query CommemorativeCard status error, ' + err); context.replyText('系統錯誤'); return;}
        if(!result) { ErrorLogger('Cannot get the uid!!'); context.replyText('您還沒參加過活動哦！'); return;}

        const act = result.activity.filter(act => act.name===actName);
        if(act.length !== 1) { ErrorLogger('Multiple same activity or cannot find activity'); context.replyText('您好像沒有參加這次的集點活動哦！'); return;}

        const pointcards = act[0].pointcard.cardField;
        let statusStr = "000000";

        for (let i = 0; i < pointcards.length; i++) {
            if (pointcards[i].value) {
                statusStr = statusStr.substr(0, i) + "1" + statusStr.substr(i + 1);
            }
        }

        const cardNum = parseInt(statusStr, 2);
        const output = PICBDIR + `commemorative_card/${ cardNum }.png`;
        const url = output.split('/').slice(1).join('/');

        const fullUrl = baseUrl + url;

        console.log(fullUrl);

        context.replyImage({
            originalContentUrl: fullUrl,
            previewImageUrl: fullUrl
        })
    })
}
