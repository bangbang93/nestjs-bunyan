import {LoggerService} from './logger.service'
import Logger = require('bunyan')

export function createLoggerService(logger: Logger): LoggerService {
  return new LoggerService(logger)
}
