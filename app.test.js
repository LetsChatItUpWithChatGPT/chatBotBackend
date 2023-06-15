const { app } = require('./app');

describe('Slack Bot', () => {
  let mockSay;

  beforeEach(() => {
    mockSay = jest.fn().mockImplementation(({ text }) => {
      console.log(text);
    });
    app.client.chat.postMessage = mockSay;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should respond with "I am alive!!!" when the /hello command is invoked', async () => {
    const commandPayload = {
      command: '/hello',
      text: '',
      user_id: 'U12345678',
      team_id: 'T12345678',
    };

    await app.command(commandPayload);

    expect(mockSay).toHaveBeenCalledWith({
      channel: 'U12345678',
      text: 'I am alive!!!',
    });
  });

  test('Should respond with "I noticed your hey, hey back." when a message containing "hey" is received', async () => {
    const messagePayload = {
      type: 'message',
      text: 'hey there',
      user: 'U12345678',
      channel: 'C12345678',
      event_ts: '1234567890.123456',
    };

    await app.event('message', messagePayload);

    expect(mockSay).toHaveBeenCalledWith({
      channel: 'C12345678',
      text: 'I noticed your hey, hey back.',
    });
  });
});
