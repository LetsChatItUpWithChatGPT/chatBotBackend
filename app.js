'use strict';

const { App } = require('@slack/bolt');
require('dotenv').config();
const fs = require('fs');
let raw = fs.readFileSync('./faqsDB.json');
let faqs = JSON.parse(raw);

const faqModule = require('./src/modules/faqModule');
const updateModule = require('./src/modules/updateModule');
const chatModule = require('./src/modules/chatModule');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, 
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command('/live', async ({ command, ack, say }) => {
  try {
    console.log('command>>>>>', command);
    await ack();
    say('I am alive!!!');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

app.message(/hey/, async ({ command, say }) => { 
  try {
    say('I noticed your hey, hey back.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

//** BRINGING IN MODULES */
faqModule(app, faqs);
updateModule(app, faqs);
chatModule(app);

(async () => {
  const port = 3002;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();




