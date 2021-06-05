import {createLogger, LoggerOptions} from 'bunyan'
import {LoggerService} from './logger.service'
import Logger = require('bunyan')

export function createLoggerService(optionsOrLogger: LoggerOptions | Logger): LoggerService {
  if (optionsOrLogger instanceof Logger) {
    return new LoggerService(optionsOrLogger)
  } else {
    return new LoggerService(createLogger(optionsOrLogger))
  }
}
