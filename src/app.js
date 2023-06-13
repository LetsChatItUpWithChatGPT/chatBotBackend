'use strict';

const { App } = require('@slack/bolt');
require('dotenv').config();

const faqModule = require('./modules/faqModule');
const updateModule = require('./modules/updateModule');
const chatModule = require('./modules/chatModule');
const { getFAQsFromDB } = require('./utils/database');

// get the raw data from the testDB.json file
const faqs = getFAQsFromDB();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
});

//!! PROOF OF LIFE MESSAGE
app.command('/hello', async ({ command, ack, say }) => {
  try {
    await ack();
    say('I am alive!!!');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

// ... (rest of the code)

// Create the modules
faqModule(app, faqs);
updateModule(app, faqs);
chatModule(app, userConversations, database);

// Start the app
(async () => {
  const port = process.env.PORT || 3002;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
