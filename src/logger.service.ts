import {Injectable, LoggerService as NestLoggerService} from '@nestjs/common'
import Logger = require('bunyan')

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    private readonly logger: Logger
  ) {}

  public debug(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.debug({...message, context})
    } else {
      this.logger.debug({context}, message)
    }
  }

  public error(message: any, trace?: string, context?: string): void {
    if (typeof message === 'object') {
      this.logger.error({...message, trace, context})
    } else {
      this.logger.error({trace, context}, message)
    }
  }

  public log(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.info({...message, context})
    } else {
      this.logger.info({context}, message)
    }
  }

  public verbose(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.trace({...message, context})
    } else {
      this.logger.trace({context}, message)
    }
  }

  public warn(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.warn({...message, context})
    } else {
      this.logger.warn({context}, message)
    }
  }
}
