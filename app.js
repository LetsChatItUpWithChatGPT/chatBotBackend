'use strict';

const { App, AwsLambdaReceiver } = require('@slack/bolt');
require('dotenv').config();
// require the fs module that's built into Node.js
const fs = require('fs');
// get the raw data from the faqsDB.json file
let raw = fs.readFileSync('./faqsDB.json');
// parse the raw bytes from the file as JSON
let faqs = JSON.parse(raw);

const faqModule = require('./src/modules/faqModule');
const updateModule = require('./src/modules/updateModule');
const chatModule = require('./src/modules/chatModule');

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

//!! PROOF OF LIFE MESSAGE
app.command('/hello', async ({ command, ack, say }) => {
  try {
    console.log('command>>>>>', command);
    await ack();
    say('I am alive!!!');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

// testing simple message response
app.message(/hey/, async ({ command, say }) => { //regex to allow any type of string of hey work
  try {
    say('I noticed your hey, hey back.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

//** BRINGING IN MODULES */
//!! faq is working with modularization @ 14:26 on 6/13
faqModule(app, faqs);

//!! update is working with modularization @ 14:26 on 6/13
updateModule(app, faqs);

//!! chat is working with modularization @ 15:41 on 6/13
chatModule(app);

// Handle the Lambda function event

// module.exports.handler = async (event, context, callback) => {
//   const handler = await awsLambdaReceiver.start();
//   return handler(event, context, callback);
// };

const handler = async (event, context, callback) => {
  const receiverHandler = await awsLambdaReceiver.start();
  return receiverHandler(event, context, callback);
};

module.exports = {
  app,
  handler,
};

module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

