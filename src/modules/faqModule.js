'use strict';
const fs = require('fs');
// get the raw data from the faqsDB.json file

const faqModule = (app, faqs) => {
  let raw = fs.readFileSync('./faqsDB.json');
  // parse the raw bytes from the file as JSON
  faqs = JSON.parse(raw);

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
};
  
module.exports = faqModule;
  