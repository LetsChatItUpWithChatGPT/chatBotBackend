# Project: LetsChatItUpWithChatGPT

## Authors: Donna Ada, Kao Saelor, Kenya Womack, Hayden Cooper, Tricia Sawyer, Reece Renninger

## Description:

- We were tasked with generating a slackbot connected to OpenAI for students to utilize.  The initial goal is to allow students the ability to prompt the slack bot with lab instructions to receive feedback or help. We hope to expand the bots capabilities or even implement additional bots that provide different functionalities after we hit MVP on the initial request.

## Domain Modeling:

This will be modified as needed through the progression of the project.
![Domain Model of our slackbot project](assets/midTermProjectUML.png)

## User Stories:

1. As a user, I would like to be able to specify what language should be used for the lab

Feature Tasks

    Users can specify the language that will be used for the lab
    SlackBot & OpenAI will provide answers to questions specific to a language

Acceptance Tests

    Ensure that responses are specific to the language requested by the user
    Provide error message is Slack or OpenAI becomes unavailable

2. As a user, I want to be able to feed the SlackBot with lab assignments

Feature Tasks:

    Users should be able to paste in the lab assignment

Acceptance Tests

    Ensure that OpenAI sends a confirmation message when lab assignment received.
    Provide Error message if OpenAi is unavailable
    Provide Error message if SlackBot is unavailable

3. As a user, I want to be able to ask SlackBot a question that I might have regarding the lab assignment.

Feature Tasks:

    Users should be able to ask SlackBot questions about the assignment
    SlackBot should respond to the user with answers

Acceptance Tests

    Ensure that a response is generated after each question
    Provide Error message if OpenAi is unavailable
    Provide Error message if SlackBot is unavailable

4. As a user, I would like to be able to have SlackBot/ OpenAI provide clarification on a previous response

Feature Tasks:

    Users should be able to ask SlackBot/OpenAI to elaborate more on a previous response.

Acceptance Tests

    Ensure that OpenAI can remember its previous responses and explain/elaborate more/
    Provide Error message if OpenAi is unavailable
    Provide Error message if SlackBot is unavailable

5. As a user, I would like to be able to interact with ChatGPT from within a slack channel

Feature Tasks

    Users can interact with ChatGPT using a specific slash command example '/chatGPT'

Acceptance Task

    Provide error message if slash command fails to connect to OpenAI
    Ensure that slash commands are only enabled in specific chats (direct message vs channels)

### References

- [Slack API](https://api.slack.com/)
- [Open AI API](https://openai.com/product#made-for-developers)
- [Building a slack bot tutorial](https://blog.logrocket.com/build-a-slackbot-in-node-js-with-slacks-bolt-api/)
- [Slack bot for generating blogs](https://youtu.be/an_LouGafXc)
- Brook for coming up with the idea of a slack bot connected to Open AI to help students with lab work!

### Documentation

1. Set up a new Slack app:
   - Go to the Slack API website (https://api.slack.com/apps) and create a new app.
   - Add the necessary scopes and permissions to your app. In this case, you'll need the `chat:write` scope to allow the bot to send messages.
   - Install the app to your workspace.

2. Set up OpenAI 
  - Go to View API Keys
  - Create new secret key

3. Create a new Node.js project:
   - Set up a new Node.js project and initialize it with `npm init`.
   - Install the `@slack/bolt` library by running `npm install @slack/bolt`.

4. Write the code for the Slack bot:
   Create a file (e.g., `slackBot.js`) and add the following code:

```javascript
const { App } = require('@slack/bolt');
const { Configuration, OpenAIApi } = require('openai');

// OpenAI API configuration
const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY,});

const openai = new OpenAIApi(configuration);

// Slack App configuration
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

app.message('hello', async ({ message, say }) => {
  // Respond with "Hello, world!"
  await say('Hello, world!');
});
(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('Bot is running!');
})();
```

5. Set up environment variables:
   - Obtain your Slack app's signing secret and bot token from the Slack API website.
   - Set the environment variables `SLACK_SIGNING_SECRET` and `SLACK_BOT_TOKEN` with the corresponding values.

6. Run the bot:
   Start the bot by running `node slackBot.js`.

7. Add the bot to your Slack workspace:
   - Go to the Slack API website and navigate to your app's settings.
   - Under "OAuth & Permissions", click on "Install to Workspace" to add the bot to your workspace.