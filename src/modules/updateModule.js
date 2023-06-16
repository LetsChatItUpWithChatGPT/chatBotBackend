'use strict';

const fs = require('fs').promises; //modified to use promises for testing

const updateModule = (app) => {
  // allow users to update our faqs via bot
  app.command('/update', async ({ command, ack, say }) => {
    try {
      await ack();
      const data = command.text.split('|');
      const newFAQ = {
        keyword: data[0].trim(),
        question: data[1].trim(),
        answer: data[2].trim(),
      };

      // save data to faqsDB.json
      const faqsData = await fs.readFile('faqsDB.json', 'utf-8');
      const faqs = JSON.parse(faqsData);
      faqs.data.push(newFAQ);
      await fs.writeFile('faqsDB.json', JSON.stringify(faqs));

      say(`You've added a new FAQ with the keyword *${newFAQ.keyword}*.`);
    } catch (error) {
      console.log('err');
      console.error(error);
    }
  });
};

module.exports = updateModule;