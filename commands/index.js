// 'use strict';

// const { App } = require('@slack/bolt');
// // require the fs module that's built into Node.js
// const fs = require('fs');
// // get the raw data from the testDB.json file
// let raw = fs.readFileSync('./testDB.json'); 
// // parse the raw bytes from the file as JSON
// let faqs = JSON.parse(raw);

// // Initializes your app with your bot token and signing secret
// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   socketMode: true, // enable the following to use socket mode
//   appToken: process.env.APP_TOKEN,
// });

// const faqsCommand = app.command('/faqs', async ({ command, ack, say }) => {
//   try {
//     await ack();
//     let message = { blocks: [] }; // adding string breaks the server, leave blank regardless of "error" in terminal
//     faqs.data.map((faq) => {
//       message.blocks.push(
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: '*Question ❓*',
//           },
//         },
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: faq.question,
//           },
//         },
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: '*Answer ✔️*',
//           },
//         },
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: faq.answer,
//           },
//         },
//       );
//     });
//     say(message);
//   } catch (error) {
//     console.log('err');
//     console.error(error);
//   }
// });

// module.exports = { faqsCommand };