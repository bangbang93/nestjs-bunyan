import {Inject} from '@nestjs/common'
import {Constructor} from 'type-fest'
import {BunyanLogger, BunyanRequestLogger} from './logger.constant'

export function InjectLogger(name?: string): ReturnType<typeof Inject> {
  return (target: Constructor<unknown>, key: string | symbol, index?: number) => {
    name = name || target.constructor.name
    Inject(BunyanLogger)(target, key, index)
  }
}

export function ReqLogger(name?: string): ReturnType<typeof Inject> {
  return (target: Constructor<unknown>, key: string | symbol, index?: number) => {
    name = name || target.constructor.name
    Inject(BunyanRequestLogger)(target, key, index)
  }
}
