import {Prefixes, ReqPrefixes} from './logger.decorator'

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
