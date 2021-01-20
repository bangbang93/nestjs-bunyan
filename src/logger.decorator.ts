import {Constructor} from '@bangbang93/utils'
import {Inject} from '@nestjs/common'

interface ILoggerPrefix {
  name: string
  symbol: symbol
}
export const Prefixes: Set<ILoggerPrefix> = new Set()
export const ReqPrefixes: Set<ILoggerPrefix> = new Set()

export function Logger(prefix?: string): ReturnType<typeof Inject> {
  return (target: Constructor, key: string | symbol, index?: number) => {
    prefix = prefix || target.constructor.name
    const symbol = Symbol(`LoggerService:${prefix}`)
    Prefixes.add({name: prefix, symbol})
    Inject(symbol)(target, key, index)
  }
}

export function ReqLogger(prefix?: string): ReturnType<typeof Inject> {
  return (target: Constructor, key: string | symbol, index?: number) => {
    prefix = prefix || target.constructor.name
    const symbol = Symbol(`ReqLogger:${prefix}`)
    ReqPrefixes.add({name: prefix, symbol})
    Inject(symbol)(target, key, index)
  }
}
