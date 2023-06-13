'use strict';

const { App } = require('@slack/bolt');
require('dotenv').config();
// require the fs module that's built into Node.js
const fs = require('fs');
// get the raw data from the faqsDB.json file
let raw = fs.readFileSync('./faqsDB.json');
// parse the raw bytes from the file as JSON
let faqs = JSON.parse(raw);

const faqModule = require('./src/modules/faqModule');
const updateModule = require('./src/modules/updateModule');


let { Configuration, OpenAIApi } = require('openai');

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

// testing simple message response
app.message(/hey/, async ({ command, say }) => { //regex to allow any type of string of hey work
  try {
    say('I noticed your hey, hey back.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

// users can access a faqs message from db we set up
// app.command('/faqs', async ({ command, ack, say }) => {
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


//grabs only two items from DB with keyword purpose
// app.message(/purpose/, async ({ command, say }) => {
//   try {
//     let message = { blocks: [] }; // adding string 
//     const purposeFAQs = faqs.data.filter((faq) => faq.keyword === 'purpose');

//     purposeFAQs.map((faq) => {
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

// //allow users to update our faqs via bot
// app.command('/update', async ({ command, ack, say }) => {
//   try {
//     await ack();
//     const data = command.text.split('|');
//     const newFAQ = {
//       keyword: data[0].trim(),
//       question: data[1].trim(),
//       answer: data[2].trim(),
//     };

//     // save data to db.json
//     fs.readFile('faqsDB.json', function (err, data) {
//       const json = JSON.parse(data);
//       json.data.push(newFAQ);
//       fs.writeFile('faqsDB.json', JSON.stringify(json), function (err) {
//         if (err) throw err;
//         console.log('Successfully saved to faqsDB.json!');
//       });
//     });
//     say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
//   } catch (error) {
//     console.log('err');
//     console.error(error);
//   }
// });

//** BRINGING IN MODULES */
const userConversations = new Map();
//!! faq is working with modularization @ 14:26 on 6/13
faqModule(app, faqs);

//!! update is working with modularization @ 14:26 on 6/13
updateModule(app, faqs);

// chatModule(app, userConversations);


app.event('message', async ({ event, ack, say }) => {
  const channelId = event.channel;

  let conversationHistory = userConversations.get(channelId) || [{ role: 'system', content: 'Provide response to questions without code unless requested by user.' }];

  if (event.channel_type === 'im') {
    console.log(event.text);
    console.log('event>>>>>', event);


    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openAI = new OpenAIApi(configuration);

    conversationHistory.push({ role: 'user', content: event.text });

    // Modify user message to then allow the ai to respond with just the steps and not the code
    const userMessage = event.text;
    const modifiedUserMessage = `Steps to solve this problem domain: ${userMessage}`;
    conversationHistory.push({ role: 'user', content: modifiedUserMessage });

    say({
      text: ':robot_face: AI is formulating a response...',
    });


    const response = await openAI.createChatCompletion({
      model: 'gpt-3.5-turbo', 
      temperature: 0.8,
      messages: conversationHistory,
      // stream: true,
      // max_tokens: 150,
      // stop: ['###', 'user', 'assistant'],
    });


    console.log('conversationHistory>>>>>', conversationHistory);

    const aiResponse = response.data.choices[0].message.content;

    conversationHistory.push({ role: 'assistant', content: aiResponse });

    userConversations.set(channelId, conversationHistory);

    console.log(response.data.choices);
    say({
      text: aiResponse,
    });


    if (conversationHistory.length > 0) {
      // Check if the user's message is a follow-up question...
      const isFollowUpQuestion = userMessage.includes('Further explanation');
      if (isFollowUpQuestion) {
        const followUpQuestion = userMessage.substring(userMessage.indexOf(':') + 1).trim();
        conversationHistory.push({ role: 'user', content: followUpQuestion });

        // Repeat the AI response generation with the follow-up question included
        const followUpResponse = await openAI.createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0.8,
          messages: conversationHistory,
        });

        const aiFollowUpResponse = followUpResponse.data.choices[0].message.content;
        conversationHistory.push({ role: 'assistant', content: aiFollowUpResponse });

        // Repeat
        userConversations.set(channelId, conversationHistory);

        console.log(followUpResponse.data.choices);
        say({
          text: aiFollowUpResponse,
        });
      }
    }


  }
});


//start up our bot
(async () => {
  const port = process.env.PORT || 3002;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

// let conversationHistory = [
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'assistant', content: 'Hello! Please provide your lab\'s problem domain?' },
//   { role: 'user', content: `Please provide steps to solve this problem domain: ${event.text}` },
// ];

// let conversationHistory = [
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'assistant', content: 'Hello! Please provide your lab\'s problem domain?' },
//   { role: 'user', content: 'Provide answers without code unless otherwise asked' },
// ];