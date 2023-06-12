# Software Requirements

## Vision

**What is the vision of this product?**

Our vision is to upgrade the Code Fellows educational experience by harnessing the power of AI and connecting it with student needs. By developing a Slack bot integrated with OpenAI, we aim to provide seamless assistance to students struggling with lab work, enabling them to receive real-time guidance and support in their coding endeavors. Our product seeks to bridge the gap between academia and technology, empowering students to excel in their coursework and foster a deeper understanding of complex problems presented throughout their journey at Code Fellows.

**What pain point does this project solve?**

The pain point we are aiming to solve is students struggling with lab work. We recognize that students often encounter difficulties while conducting their labs on a daily basis at times. By providing a Slack bot connected to OpenAI, the product offers a solution to this problem by offering real-time help and guidance to students, effectively supporting them in overcoming challenges and enhancing their understanding and performance in the labs.

## Why should we care about your product?

**IN -** 

    1. Our chat bot will allow students to paste in their entire lab and be able to receive a checklist of things to accomplish.
    2. Our chat bot will be able to have commands that users can do to pull up a faq with pre generated answers to questions about the bot.
    3. Students will be able to have access to the bot from anywhere in the workspace.
    4. Students will be able to ask other in depth questions about their lab by simply calling on the bot and asking questions directly in the message.

**OUT -** 

    1. This will never be turned into a phone app.
    2. This will never be a replacement to actually completing your own lab work.
    3. This will never be more than a tool for developers to lean on when hitting walls within their labs/assignments.
  
## Minimum Viable Product vs

Our MVP will be a working chat bot within a Slack workspace that allows for users to copy paste in their lab instructions and get feedback from the Open AI API for assistance.

**Stretch**

Our main stretch goal would be to implement a database that houses all the labs and allow for students to use some type of /help command use a keyword reference to grab the information to that specific lab.  
If possible to get that portion running, we want to explore utilizing the canvas api to possibly dynamically grab the lab information if possible instead of having to call a DB that would need to be updated as labs change.  

## Data Flow

Since our project is a slack bot sending requests to Open AI API, ideally the flow of data would be the student going into their workspace of Slack where the bot lives.  Upon issuing a command such as /help and following that lab information, it would ping the API to take in that information and come back with response of a todo list of sorts or guidance on the lab based on the student input.  The student could then continue to ask questions with the lab reference in place for more clarification on portions needed.
The domain model image can be referenced in the [README.md](./README.md).

## Non-Functional Requirements (301 & 401 only)

Our chat bot will be set up for testability by the ability for it to conduct its API ping and bring back valid information regarding the lab instructions it was prompted.  This will occur synchronously as we develop the bot.  We will be testing the bot at each stage of completion to ensure it is able to complete the requested/ response cycle with the appropriate return of information we are seeking.

Performance will be another measure we will be attempting to record.  Since we are trying to possibly build a DB to pull lab information from to then send over to our Open AI API we will need to take into account speed if using a free service.  We may pay for a limited time to have an enhanced API for making calls faster if we see that there is considerable downtime being request and response.  We will also want to test on performance based on the file size of what we are sending for response. Ideally we would like to aim for the API response to be under 5 seconds since Chat GPT itself can sometimes take a few seconds to generate a response even when typing directly into their chat web page.
