import {Prefixes, ReqPrefixes} from './logger.decorator'
import {LoggerService} from './logger.service'
import Logger = require('bunyan')

export function getReqLoggerToken(name: string): symbol {
  for (const prefix of ReqPrefixes.values()) {
    if (prefix.name === name) return prefix.symbol
  }
}

export function getLoggerToken(name: string): symbol {
  for (const prefix of Prefixes.values()) {
    if (prefix.name === name) return prefix.symbol
  }
}

export function createLogger(name: string): symbol {
  const symbol = Symbol(`CustomLogger:${name}`)
  Prefixes.add({name, symbol})
  return symbol
}

export function createLoggerService(logger: Logger): LoggerService {
  return new LoggerService(logger)
}
