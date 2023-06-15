const fs = require('fs').promises;
const updateModule = require('../src/modules/updateModule');

describe('Update Module', () => {
  let mockApp;

  beforeEach(() => {
    mockApp = {
      command: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should add a new FAQ and save to faqsDB.json', async () => {
    const mockCommand = {
      text: 'keyword | question | answer',
    };
    const mockAck = jest.fn();
    const mockSay = jest.fn();

    // Mock the readFile and writeFile functions with empty implementations
    fs.readFile = jest.fn().mockResolvedValue('');
    fs.writeFile = jest.fn().mockResolvedValue('');

    await updateModule(mockApp);
    await mockApp.command.mock.calls[0][1]({
      command: mockCommand,
      ack: mockAck,
      say: mockSay,
    });

    expect(mockAck).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith('You\'ve added a new FAQ with the keyword *keyword.*');

    // Verify that the readFile and writeFile functions were called
    expect(fs.readFile).toHaveBeenCalledWith('faqsDB.json', 'utf-8');
    expect(fs.writeFile).toHaveBeenCalledWith('faqsDB.json', expect.any(String));
  });

  it('Should handle errors and log them', async () => {
    const mockCommand = {
      text: 'keyword | question | answer',
    };
    const mockAck = jest.fn();
    const mockSay = jest.fn();

    console.log = jest.fn();
    console.error = jest.fn();

    // Mock the readFile function to throw an error
    fs.readFile = jest.fn().mockRejectedValue(new Error('Read error'));

    await updateModule(mockApp);
    await mockApp.command.mock.calls[0][1]({
      command: mockCommand,
      ack: mockAck,
      say: mockSay,
    });

    expect(mockAck).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('err');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    expect(console.error.mock.calls[0][0].message).toContain('Read error');
  });
});
