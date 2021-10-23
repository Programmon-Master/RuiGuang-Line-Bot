const { router, text } = require('bottender/router');

module.exports = async function messageRouter(context) {
    return router([
        text('最新消息', (context)=>{ context.sendText('最新消息'); }),
        text('關於青創', (context)=>{ context.sendText('關於青創'); }),
        text('周邊生活', (context)=>{ context.sendText('周邊生活'); }),
        text('瑞光社群', (context)=>{ context.sendText('瑞光社群'); }),
        text('活動專區', (context)=>{ context.sendText('活動專區'); }),
        text('幹你娘', (context)=>{ context.sendText('不可'); }),
        text('*', (context)=>{ context.sendText('你在工三小'); })
    ]);
}