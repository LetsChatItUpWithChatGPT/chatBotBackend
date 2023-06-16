const fs = require('fs').promises;
const updateModule = require('../src/modules/updateModule');

describe('Update Module', () => {
  let mockApp;
  let mockSay;
  let mockReadFile;
  let mockWriteFile;

  beforeEach(() => {
    mockSay = jest.fn();
    mockReadFile = jest.spyOn(fs, 'readFile');
    mockWriteFile = jest.spyOn(fs, 'writeFile');

    mockApp = {
      command: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  

  test('Should add a new FAQ and save to faqsDB.json', async () => {
    const mockAck = jest.fn();
    const mockSay = jest.fn();
    const mockReadFile = jest.fn().mockResolvedValue('');
    const mockWriteFile = jest.fn().mockResolvedValue();

    jest.spyOn(fs.promises, 'readFile').mockImplementation(mockReadFile);
    jest.spyOn(fs.promises, 'writeFile').mockImplementation(mockWriteFile);

    const command = {
      text: 'keyword | question | answer',
    };

    await updateModule({ command, ack: mockAck, say: mockSay });

    expect(mockAck).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith(
      expect.stringContaining("You've added a new FAQ with the keyword")
    );
    expect(mockReadFile).toHaveBeenCalledWith('faqsDB.json', 'utf-8');
    expect(mockWriteFile).toHaveBeenCalledWith(
      'faqsDB.json',
      expect.any(String),
      expect.any(Function)
    );
  });

  it('Should handle errors and log them', async () => {
    const mockCommand = {
      text: 'keyword | question | answer',
    };
    const mockAck = jest.fn();

    console.log = jest.fn();
    console.error = jest.fn();

    // Mock the readFile function to throw an error
    mockReadFile.mockRejectedValue(new Error('Read error'));

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
    expect(mockReadFile).toHaveBeenCalledWith('faqsDB.json', 'utf-8');
  });
});