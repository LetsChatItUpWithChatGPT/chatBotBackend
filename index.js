'use strict';

const { App } = require('@slack/bolt');
require('dotenv').config();
//tracking information from live requests
import LogRocket from 'logrocket';
LogRocket.init('bh9qol/slackbotchatgpt');
// require the fs module that's built into Node.js
const fs = require('fs');
// get the raw data from the testDB.json file
let raw = fs.readFileSync('testDB.json');
// parse the raw bytes from the file as JSON
let faqs = JSON.parse(raw);

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // enable the following to use socket mode
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

// users can access a faqs message from db we set up
app.command('/faqs', async ({ command, ack, say }) => {
  try {
    await ack();
    let message = { blocks: [] };
    faqs.data.map((faq) => {
      message.blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Question ❓*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.question,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Answer ✔️*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.answer,
          },
        },
      );
    });
    say(message);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

//grabs only two items from DB with keyword purpose
app.message(/purpose/, async ({ command, say }) => {
  try {
    let message = { blocks: [] };
    const purposeFAQs = faqs.data.filter((faq) => faq.keyword === 'purpose');

    purposeFAQs.map((faq) => {
      message.blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Question ❓*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.question,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Answer ✔️*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.answer,
          },
        },
      );
    });

    say(message);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

//allow users to update our faqs via bot
app.command('/update', async ({ command, ack, say }) => {
  try {
    await ack();
    const data = command.text.split('|');
    const newFAQ = {
      keyword: data[0].trim(),
      question: data[1].trim(),
      answer: data[2].trim(),
    };
    // save data to db.json
    fs.readFile('testDB.json', function (err, data) {
      const json = JSON.parse(data);
      json.data.push(newFAQ);
      fs.writeFile('testDB.json', JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('Successfully saved to testDB.json!');
      });
    });
    say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

// testing simple message response
app.message(/hey/, async ({ command, say }) => { //regex to allow any type of string of hey work
  try {
    say('I received your hey, hey back.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

(async () => {
  const port = process.env.PORT || 3002;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

