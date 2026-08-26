// src/logger/json.logger.spec.ts
import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should write a valid JSON object to console.log on log()', () => {
    logger.log('Hello world');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('Hello world');
    expect(parsed.optionalParams).toEqual([]);
  });

  it('should route error() to console.error', () => {
    logger.error('Something broke');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('Something broke');
  });

  it('should route warn() to console.warn', () => {
    logger.warn('careful');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('warn');
  });

  it('should route debug() to console.debug', () => {
    logger.debug('debugging');

    expect(debugSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(debugSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('debug');
  });

  it('should include extra arguments inside optionalParams', () => {
    logger.log('User created', 'UserService');

    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(parsed.optionalParams).toEqual(['UserService']);
  });

  it('should collect multiple optional params in order', () => {
    logger.log('Order failed', 'OrderService', { orderId: 42 });

    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(parsed.optionalParams).toEqual(['OrderService', { orderId: 42 }]);
  });

  it('should produce valid JSON for verbose/fatal too', () => {
    logger.verbose('verbose msg');
    logger.fatal('fatal msg');

    expect(() => JSON.parse(logSpy.mock.calls[0][0] as string)).not.toThrow();
    expect(() => JSON.parse(errorSpy.mock.calls[0][0] as string)).not.toThrow();
  });
});
