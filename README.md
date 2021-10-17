# RuiGuang Line Bot

This bot is design for user who live in "Neihu District, Taipei" or [RuiGuang Social Housing](https://english.gov.taipei/News_Content.aspx?n=A11F01CFC9F58C83&sms=DFFA119D1FD5602C&s=1CFB5F5A2FFB9F72). Hope this proect can be useful for everyone who live together in Neihu.

## About us

We are a part of member in [Youth Innovation and Feedback Program](https://dosw.gov.taipei/News_Content.aspx?n=96CA70B5FC3C3D56&sms=C04230CB75259A56&s=BE95D373CBA73D55) which program is design for bring more young, differential profession power into social housing and community.

- [More About Youth Innovation and Feedback Program](https://www.facebook.com/JKPublicContribution)

## Introduction

TBD;

## Development

### How to start

1. Run `node server.js` open http server on 5000 port.
    > Web API: /api
    > Bot API: /webhook/{platform}
2. Run `ngrok http {5000 || port}` for HTTPS reverse proxy using ngrok.
    > Reference: [Ngrok Official](https://ngrok.com/docs)
3. Setting Line bot webhook url `https://{ngrok url}/webhook/line` to [Line Developer Console](https://developers.line.biz/console/) (in Message-API tab).

## Reference

- [Express](https://expressjs.com/en/starter/installing.html)
- [Bottender](https://bottender.js.org/docs/en/getting-started)
- [Mongoose](https://mongoosejs.com/docs/guide.html)