const { Line } = require('messaging-api-line');
const { router, text } = require('bottender/router');
const activityFlex = require('../../template/message/11011_activity_flex.json');
const aboutUsFlex = require('../../template/message/aboutUs_flex.json');
const communityFlex = require('../../template/message/community_flex.json');
const underConstruction = require('../../template/message/underConstruction_flex.json');
const getPointCard = require('../../service/pointcard');

module.exports = async function messageRouter(context) {
    return router([
        text('最新消息', (context)=>{ context.replyFlex("請使用手機查看訊息", underConstruction); }),
        text('關於青創', (context)=>{ context.replyFlex("請使用手機查看訊息", aboutUsFlex); }),
        text('青創介紹', (context)=>{
            context.reply([
                Line.createImage({
                    originalContentUrl: 'https://bot.ruiguang.link/images/youngus/aboutus.jpg',
                    previewImageUrl: 'https://bot.ruiguang.link/images/youngus/aboutus.jpg',
                }),
                Line.createText('丨青創部落介紹丨\n今天隆重公開我們瑞光青創😜\n/\n🛖設計、藝術、平台、資訊\nNatalie｜瑞光永續品牌形象經營\n阿布｜光·和作用\n程鈞、RJ｜智慧瑞光好資在\nAnny｜瑞光藝起來\n\n🛖凹豆球球部落\n大倩｜敬山、進山、淨山之無痕山林計劃\nDaphneee｜來場湖光島大冒險 讓微冒險成為日常\nShawn｜城市裡的天文學家\n采疄Cailin｜瑞光社宅訪古淨山樂縱走計畫\n\n🛖運動動滋部落\nThompson｜瑞光熱血籃球魂\n嫺嫺、 Curry教練｜力與美的結合\nCola｜橄動瑞光 - 創造"心"連結 橄欖球體驗\n小楊教練、媛媛｜大人小孩的花式溜冰教學\n辰豪｜舞動瑞光，翻轉社區\n\n🛖法律圈圈部落\n芊雅、明垣｜瑞光社區營造法律諮詢計劃\n瑞娟、建豐｜瑞光社宅法律服務\n\n🛖花園水水部落\n柔慧｜綠藝陪伴計畫\n阿橋｜應用園藝治療營造居住環境促進居民身心健康\n小育｜心花入FUN\n\n🛖文創響響部落\n紗紗｜鉤針手作編織 療癒身心靈\nFino｜衣舊如新_衣櫥的循環經濟\nViola｜冰冰有禮\nNico｜瑞光行動文化宅計畫\n\n🛖醫療嗡嗡部落\n小李｜藥您開心=)計畫\n涵雯｜告老還家——居家長者健康支持計畫\n靖軒｜瑞光閃閃 長幼永續\n孟璇｜完美醫藥')
            ]);
        }),
        text('生活周邊', (context)=>{
            context.reply([
                Line.createImage({
                    originalContentUrl: 'https://bot.ruiguang.link/images/lifecircle/eatBreakfastCoffee.jpg',
                    previewImageUrl: 'https://bot.ruiguang.link/images/lifecircle/eatBreakfastCoffee.jpg',
                }),
                Line.createText('在努力上班前 先放鬆一下🥪\n吃早餐是你一天中第一個偷懶小時光\n吃早餐這麼重要！不能忽略它的重要性\n吃早餐這麼重要！要正大光明的吃\n吃早餐這麼重要！絕對不是因為上班前想再逃避一下\n美食地圖整理了各種好吃早餐\n傳統早餐 有儀式感的早餐...\n哪個早餐能吃比較久 就帶去公司吃吧😗\n/\n另外也整理了內湖咖啡廳給大家\n休息/休假時間必須耍廢\n住在忙碌的內科\n我們也必須學會讓自己慢下來哦'),
                Line.createImage({
                    originalContentUrl: 'https://bot.ruiguang.link/images/lifecircle/eatMarket.jpg',
                    previewImageUrl: 'https://bot.ruiguang.link/images/lifecircle/eatMarket.jpg',
                }),
                Line.createText('聽人家說 瑞光島是個島\n自給自足喔！是要去哪買菜啦？\n/\n除了正樓下的全聯福利中心Pxmart 內湖好鄰居\n還有這些地方當你的冰箱補貨區！\n\n📍 家樂福超市內湖江南店\n📍文德黃昏市場 \n📍內湖737市場\n📍西湖市場 \n📍湖光市場'),
                Line.createText('美食地圖傳送門：\nhttps://goo.gl/maps/miQag4WAyb7ii2Gv7')
            ]);
        }),
        text('瑞光社群', (context)=>{ context.replyFlex("請使用手機查看訊息", communityFlex); }),
        text('活動專區', (context)=>{ context.replyFlex("請使用手機查看訊息", activityFlex); }),
        text('我的闖關卡', getPointCard ),
        text('*', (context)=>{ context.sendText('歹勢～您輸入的指令我看不太懂耶❓👀'); })
    ]);
}