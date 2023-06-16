// 'use strict';

// Not completed canvas connection

// require('dotenv').config();
// const { Configuration, OpenAIApi } = require('openai');
// const axios = require('axios');

// const canvasToken = process.env.CANVAS_API_TOKEN;
// const openaiApiKey = process.env.SLACK_BOT_TOKEN;

// const canvasApiUrl = 'https://canvas.instructure.com/api/v1';
// const courseId = '6745251';

// const chatModule = async (app) => {
//   const userConversations = new Map();
//   let conversationHistory = [];

//   app.event('message', async ({ event, ack, say }) => {
//     const channelId = event.channel;
//     conversationHistory = userConversations.get(channelId) || [
//       { role: 'system', content: 'You are an assistant that helps code school students figure out the basic steps to their lab or code challenge assignments. Please provide the problem domain or question you need help with, and I will provide you with a general answer or step-by-step guide without code or examples unless asked.' },
//     ];

//     if (event.channel_type === 'im' && !event.subtype) {
//       console.log(event.text);
//       console.log('event>>>>>', event);

//       const configuration = new Configuration({ apiKey: openaiApiKey });
//       const openAI = new OpenAIApi(configuration);

//       if (!conversationHistory.some((msg) => msg.content === event.text)) {
//         conversationHistory.push({ role: 'user', content: event.text });
//       }

//       say({
//         text: ':robot_face: AI is formulating a response...',
//       });

//       const lastRole = conversationHistory[conversationHistory.length - 1].role;

//       if (lastRole !== 'assistant') {
//         const response = await openAI.createChatCompletion({
//           model: 'gpt-3.5-turbo',
//           temperature: 0.8,
//           messages: conversationHistory,
//           max_tokens: 200,
//           n: 1,
//         });

//         console.log('response>>>>>', response.data.usage.prompt_tokens);

//         console.log('conversationHistory>>>>>', conversationHistory);

//         const aiResponse = await response.data.choices[0].message.content;

//         conversationHistory.push({ role: 'assistant', content: aiResponse });

//         userConversations.set(channelId, conversationHistory);

//         console.log('length ', response.data.choices[0].finish_reason);
//         await say({
//           text: aiResponse,
//         });

//         if (response.data.choices[0].finish_reason === 'length') {
//           say({
//             text: ':bangbang: Type `CONTINUE` to continue the conversation.',
//           });
//           return;
//         }
//         if (response.data.choices[0].finish_reason === 'stop') {
//           say({
//             text: ':robot_face: Can I help you with anything else?',
//           });
//           return;
//         }
//       }
//     }
//   });
// };


// // Fetch assignments from Canvas API
// async function getAssignments() {
//   try {
//     const response = await axios.get(`${canvasApiUrl}/courses/${courseId}/assignments`, {
//       headers: {
//         'Authorization': `Bearer ${canvasToken}`,
//       },
//     });

//     return response.data;
//   } catch (err) {
//     console.error('Error fetching assignments:', err);
//     throw err;
//   }
// }

// // Format assignments for the response
// function formatAssignments(assignments) {
//   let formattedMessage = 'Here are the upcoming assignments:\n';
//   for (const assignment of assignments) {
//     formattedMessage += `- ${assignment.name} (Due: ${assignment.due_at})\n`;
//   }
// }


// module.exports = { chatModule, getAssignments, formatAssignments };