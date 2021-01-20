import {Provider} from '@nestjs/common'
import {REQUEST} from '@nestjs/core'
import * as Logger from 'bunyan'
import {Request} from 'express'
import {Prefixes, ReqPrefixes} from './logger.decorator'

export function createLoggerProviders(): Provider<Logger>[] {
  const providers: Provider<Logger>[] = []
  for (const prefix of Prefixes.values()) {
    providers.push({
      provide: prefix.symbol,
      inject: [Logger],
      useFactory(logger: Logger) {
        return logger.child({components: prefix.name})
      }
    })
  }
  return providers
}

export function *createRequestLoggerProviders(reqIdHeader?: string, customizer?: (logger: Logger, req: unknown) => Logger): Iterable<Provider<Logger>> {
  for (const prefix of ReqPrefixes.values()) {
    yield {
      provide: prefix.symbol,
      inject: [Logger, REQUEST],
      useFactory(logger: Logger, req: Request) {
        const reqId = req['id'] || req.get(reqIdHeader)
        const childLogger = logger.child({components: prefix.name, reqId})
        if (customizer) return customizer(childLogger, req)
        return childLogger
      }
    }
  }
}

export function *createLoggerExports(): Iterable<symbol> {
  for (const prefix of Prefixes.values()) {
    yield prefix.symbol
  }
}

export function *createReqLoggerExports(): Iterable<symbol> {
  for (const prefix of ReqPrefixes.values()) {
    yield prefix.symbol
  }
}
