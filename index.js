const { router, line } = require('bottender/router');
const messageRouter = require('./routes/bot/messageRouter');

async function App(context) {
  return router([
    line.message(messageRouter),
    line.postback(HandlePostback),
    line.any(HandleLine)
  ]);
};

async function HandlePostback(context) {
  console.log(context);
}
async function HandleLine(context) {
  console.log(context);
}

module.exports = App;