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

  test('Should respond with AI message', async () => {
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

    expect(mockCreateChatCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that helps code school students figure out the basic steps to their lab or code challenge assignments. Please provide the problem domain or question you need help with, and I will provide you with a general answer or step-by-step guide without code or examples unless asked.',
          },
          { role: 'user', content: 'Test message' },
        ],
        max_tokens: 100,
      }),
    );
    expect(mockSay).toHaveBeenCalledWith('AI response');
  });
});
