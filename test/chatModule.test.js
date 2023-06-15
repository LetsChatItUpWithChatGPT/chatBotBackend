require('dotenv').config(); // Load environment variables from .env file

const chatModule = require('../src/modules/chatModule');

describe('Chat Module', () => {
  let mockApp;
  let mockSay;
  let mockAck;
  let mockEvent;
  let mockOpenAI;
  let mockCreateChatCompletion;

  beforeEach(() => {
    // Mock implementation and data setup
    mockSay = jest.fn();
    mockAck = jest.fn();
    mockEvent = {
      event: {
        channel: 'C12345678', // Provide the necessary properties of the event object
        channel_type: 'im',
        text: 'Test message',
      },
    };
    mockOpenAI = jest.fn();
    mockCreateChatCompletion = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should respond with AI message', async () => {
    mockApp = {
      event: jest.fn((eventName, callback) => {
        callback({ event: mockEvent.event, ack: mockAck, say: mockSay });
      }),
    };

    chatModule(mockApp);

    const callback = mockApp.event.mock.calls[0][1]; // Retrieve the callback function

    await callback(); // Invoke the callback function

    expect(mockCreateChatCompletion).toHaveBeenCalledWith({
      // Expected API parameters
    });
    expect(mockSay).toHaveBeenCalledWith({ text: 'AI response' });
  });
});
