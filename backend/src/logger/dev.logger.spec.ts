import { ConsoleLogger } from '@nestjs/common';
import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  it('should be an instance of ConsoleLogger', () => {
    const logger = new DevLogger();
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should expose the standard logger methods', () => {
    const logger = new DevLogger();
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });
});
