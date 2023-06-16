const fs = require('fs');
const faqModule = require('../src/modules/faqModule');

describe('FAQ Module', () => {
  let mockApp;
  let mockFaqs;

  beforeEach(() => {
    mockApp = {
      command: jest.fn(),
      message: jest.fn(),
    };

    mockFaqs = {
      data: [
        {
          keyword: 'purpose',
          question: 'What is the purpose of this?',
          answer: 'The purpose is to...',
        },
        {
          keyword: 'usage',
          question: 'How do I use this?',
          answer: 'You can use it by...',
        },
      ],
    };

    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockFaqs));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should retrieve all FAQs from the faqsDB.json file', async () => {
    const mockCommand = {};
    const mockAck = jest.fn();
    const mockSay = jest.fn();

    await faqModule(mockApp);
    await mockApp.command.mock.calls[0][1]({
      command: mockCommand,
      ack: mockAck,
      say: mockSay,
    });

    expect(mockAck).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith(expect.objectContaining({
      blocks: expect.arrayContaining([
        expect.objectContaining({ text: expect.objectContaining({ text: 'What is the purpose of this?' }) }),
        expect.objectContaining({ text: expect.objectContaining({ text: 'The purpose is to...' }) }),
        expect.objectContaining({ text: expect.objectContaining({ text: 'How do I use this?' }) }),
        expect.objectContaining({ text: expect.objectContaining({ text: 'You can use it by...' }) }),
      ]),
    }));
  });

  it('Should retrieve FAQs with keyword "purpose" from the faqsDB.json file', async () => {
    const mockCommand = {};
    const mockSay = jest.fn();

    await faqModule(mockApp);
    await mockApp.message.mock.calls[0][1]({
      command: mockCommand,
      say: mockSay,
    });

    expect(mockSay).toHaveBeenCalledWith(expect.objectContaining({
      blocks: expect.arrayContaining([
        expect.objectContaining({ text: expect.objectContaining({ text: 'What is the purpose of this?' }) }),
        expect.objectContaining({ text: expect.objectContaining({ text: 'The purpose is to...' }) }),
      ]),
    }));
  });
});
