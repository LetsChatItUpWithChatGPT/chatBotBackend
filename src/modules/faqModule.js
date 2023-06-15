'use strict';
const fs = require('fs');

const faqModule = (app, faqs) => {
  let raw = fs.readFileSync('./faqsDB.json');
  faqs = JSON.parse(raw);

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
  