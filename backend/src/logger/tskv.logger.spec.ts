import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function parseTskv(line: string): Record<string, string> {
    const trimmed = line.replace(/\n$/, '');
    const result: Record<string, string> = {};
    for (const pair of trimmed.split('\t')) {
      const [key, ...rest] = pair.split('=');
      result[key] = rest.join('=');
    }
    return result;
  }

  it('should write tab-separated key=value pairs ending with newline', () => {
    logger.log('Hello world');

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const output = stdoutSpy.mock.calls[0][0] as string;

    expect(output.endsWith('\n')).toBe(true);
    expect(output).toContain('\t');

    const fields = parseTskv(output);
    expect(fields.level).toBe('log');
    expect(fields.message).toBe('Hello world');
    expect(fields.timestamp).toBeDefined();
  });

  it('should route error() to stderr', () => {
    logger.error('Something broke');

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const fields = parseTskv(stderrSpy.mock.calls[0][0] as string);
    expect(fields.level).toBe('error');
    expect(fields.message).toBe('Something broke');
  });

  it('should escape tabs and newlines inside message values', () => {
    logger.log('line1\nline2\twithTab');

    const output = stdoutSpy.mock.calls[0][0] as string;
    const fields = parseTskv(output);

    expect(fields.message).toBe('line1\\nline2\\twithTab');

    expect(Object.keys(fields).length).toBe(4);
  });

  it('should include context field when provided', () => {
    logger.log('User created', 'UserService');

    const fields = parseTskv(stdoutSpy.mock.calls[0][0] as string);
    expect(fields.context).toBe('UserService');
  });
});
