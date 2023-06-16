require('dotenv').config(); // Load environment variables from .env file

const chatModule = require('../src/modules/chatModule');
const { OpenAIApi } = require('openai');

describe('Chat Module', () => {
  let mockApp;
  let mockSay;
  let mockAck;
  let mockEvent;
  let mockCreateChatCompletion;

  beforeEach(() => {
    // Mock implementation and data setup
    mockSay = jest.fn();
    mockAck = jest.fn();
    mockEvent = {
      channel: 'C12345678', // Provide the necessary properties of the event object
      channel_type: 'im',
      text: 'Test message',
    };
    mockCreateChatCompletion = jest.fn(async () => ({
      data: {
        choices: [
          {
            message: {
              content: 'AI response',
            },
          },
        ],
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should check if in Channel Type IM', async () => {
    mockApp = {
      event: jest.fn((eventName, callback) => {
        callback({ event: mockEvent, ack: mockAck, say: mockSay });
      }),
    };

    // Mock OpenAIApi class and createChatCompletion method
    const mockOpenAI = {
      createChatCompletion: mockCreateChatCompletion,
    };
    jest.mock('openai', () => ({
      OpenAIApi: jest.fn(() => mockOpenAI),
    }));

    chatModule(mockApp);

    const callback = mockApp.event.mock.calls[0][1]; // Retrieve the callback function

    await callback({ event: mockEvent, ack: mockAck, say: mockSay }); // Pass the necessary arguments to the callback function

    expect(mockEvent.channel_type).toBe('im');
  });
});