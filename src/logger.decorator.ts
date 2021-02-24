import {Constructor} from '@bangbang93/utils'
import {Inject} from '@nestjs/common'

interface ILoggerPrefix {
  name: string
  symbol: symbol
}
export const Prefixes: Set<ILoggerPrefix> = new Set()
export const ReqPrefixes: Set<ILoggerPrefix> = new Set()

export function InjectLogger(name?: string): ReturnType<typeof Inject> {
  return (target: Constructor, key: string | symbol, index?: number) => {
    name = name || target.constructor.name
    const symbol = Symbol(`LoggerService:${name}`)
    Prefixes.add({name: name, symbol})
    Inject(symbol)(target, key, index)
  }
}

/** @deprecated use @InjectLogger */
export const Logger = InjectLogger

export function ReqLogger(name?: string): ReturnType<typeof Inject> {
  return (target: Constructor, key: string | symbol, index?: number) => {
    name = name || target.constructor.name
    const symbol = Symbol(`ReqLogger:${name}`)
    ReqPrefixes.add({name: name, symbol})
    Inject(symbol)(target, key, index)
  }
}

export function RegisterLogger(name?: string): ClassDecorator {
  return (target: Function) => {
    name = name || target.name
    const symbol = Symbol(`ReqLogger:${name}`)
    ReqPrefixes.add({name: name, symbol})
  }
}

export function createLogger(name: string): symbol {
  const symbol = Symbol(`CustomLogger:${name}`)
  Prefixes.add({name, symbol})
  return symbol
}
