'use strict';

const fs = require('fs');

const updateModule = (app, faqs) => {
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

      // save data to db.json
      fs.readFile('faqsDB.json', function (err, data) {
        const json = JSON.parse(data);
        json.data.push(newFAQ);
        fs.writeFile('faqsDB.json', JSON.stringify(json), function (err) {
          if (err) throw err;
          console.log('Successfully saved to faqsDB.json!');
        });
      });

      say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
    } catch (error) {
      console.log('err');
      console.error(error);
    }
  });
};

module.exports = updateModule;