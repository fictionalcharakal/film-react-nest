import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n');
  }

  private stringifyMessage(message: any): string {
    if (typeof message === 'string') return message;
    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }

  private formatMessage(
    level: string,
    message: any,
    optionalParams: any[],
  ): string {
    const fields: Record<string, string> = {
      tskv_format: 'nest-log',
      timestamp: new Date().toISOString(),
      level,
      message: this.stringifyMessage(message),
    };

    const context = optionalParams.find((p) => typeof p === 'string');
    if (context) {
      fields.context = context;
    }

    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${this.escape(value)}`)
        .join('\t') + '\n'
    );
  }

  log(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('log', message, optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    process.stderr.write(this.formatMessage('error', message, optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, optionalParams),
    );
  }

  fatal(message: any, ...optionalParams: any[]) {
    process.stderr.write(this.formatMessage('fatal', message, optionalParams));
  }
}
