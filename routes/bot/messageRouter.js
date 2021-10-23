const { router, text } = require('bottender/router');
const activityFlex = require('../../template/message/11010_activity_flex.json');

module.exports = async function messageRouter(context) {
    return router([
        text('最新消息', (context)=>{ context.sendText('最新消息'); }),
        text('關於青創', (context)=>{ context.sendText('關於青創'); }),
        text('周邊生活', (context)=>{ context.sendText('周邊生活'); }),
        text('瑞光社群', (context)=>{ context.sendText('瑞光社群'); }),
        text('活動專區', (context)=>{ context.replyFlex("請使用手機查看訊息", activityFlex); }),
        text('*', (context)=>{ context.sendText('我不曉得您的意思，如果有問題可以私訊我們的臉書專頁 https://fb.ruiguang.link'); })
    ]);
}