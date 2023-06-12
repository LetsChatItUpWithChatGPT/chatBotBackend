const { App } = require('@slack/bolt');
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

// OpenAI API configuration
const openAIEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const openAIHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Replace with your OpenAI API key
};

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

// Command handler for /hello
app.command('/hello', async ({ command, ack, say }) => {
  try {
    await ack();
    say('I am alive!!!');
  } catch (error) {
    console.error(error);
  }
});

// Command handler for /faqs
app.command('/faqs', async ({ command, ack, say }) => {
  try {
    await ack();
    const faqsRawData = await fs.readFile('./testDB.json', 'utf8');
    const faqs = JSON.parse(faqsRawData);
    let message = { blocks: [] };
    faqs.data.forEach((faq) => {
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
    console.error(error);
  }
});

// Command handler for /update
app.command('/update', async ({ command, ack, say }) => {
  try {
    await ack();
    const data = command.text.split('|');
    const newFAQ = {
      keyword: data[0].trim(),
      question: data[1].trim(),
      answer: data[2].trim(),
    };

    const faqsRawData = await fs.readFile('./testDB.json', 'utf8');
    const faqs = JSON.parse(faqsRawData);
    faqs.data.push(newFAQ);
    await fs.writeFile('./testDB.json', JSON.stringify(faqs));

    say(`You've added a new FAQ with the keyword *${newFAQ.keyword}*.`);
  } catch (error) {
    console.error(error);
  }
});

// Command handler for /helpai
app.command('/helpai', async ({ command, ack, say }) => {
  try {
    await ack();
    const response = await openAIChatCompletion(command.text);
    say(response);
  } catch (error) {
    console.error(error);
  }
});

// Function to process the OpenAI chat completion
async function openAIChatCompletion(message) {
  try {
    const response = await axios.post(openAIEndpoint, {
      prompt: message,
      max_tokens: 50,
      temperature: 0.7,
      n: 1,
    }, { headers: openAIHeaders });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error processing request with OpenAI:', error);
    return 'Oops! Something went wrong.';
  }
}

// Start the Slack bot
(async () => {
  const port = process.env.PORT || 3002;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
