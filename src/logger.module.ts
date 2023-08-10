import {DynamicModule, Module, Scope} from '@nestjs/common'
import {FactoryProvider} from '@nestjs/common/interfaces/modules/provider.interface'
import {INQUIRER, REQUEST} from '@nestjs/core'
import * as Logger from 'bunyan'
import {Request} from 'express'
import {Constructor} from 'type-fest'
import {BunyanLogger, BunyanRequestLogger} from './logger.constant'
import {LoggerService} from './logger.service'

interface IOptions {
  bunyan: Logger.LoggerOptions
  isGlobal?: boolean
  isEnableRequestLogger?: boolean
  reqIdHeader?: string

  customRequestLogger?(childLogger: Logger, request: unknown): Logger
}

interface IAsyncOptions extends Omit<IOptions, 'bunyan'> {
  bunyan: Omit<FactoryProvider<Logger.LoggerOptions>, 'provide'>
}

@Module({
  providers: [
    {
      provide: Logger,
      inject: ['BunyanOptions'],
      useFactory(bunyanOptions: Logger.LoggerOptions) {
        return Logger.createLogger(bunyanOptions)
      },
    }, {
      provide: BunyanLogger,
      scope: Scope.TRANSIENT,
      inject: [Logger, INQUIRER],
      useFactory(logger: Logger, a: Constructor<unknown>) {
        return logger.child({context: a?.constructor.name})
      },
    }, {
      provide: BunyanRequestLogger,
      scope: Scope.REQUEST,
      inject: [Logger, INQUIRER, REQUEST, 'Options'],
      useFactory(logger: Logger, a: Constructor<unknown>, req: Request, options: IOptions) {
        logger = logger.child({context: a?.constructor.name, reqId: req?.headers[options.reqIdHeader]})
        if (options.customRequestLogger) {
          logger = options.customRequestLogger(logger, req)
        }
        return logger
      },
    },
    LoggerService,
  ],
  exports: [
    Logger,
    LoggerService,
    BunyanLogger,
    BunyanRequestLogger,
  ],
})
export class BunyanLoggerModule {
  public static forRoot(options: IOptions): DynamicModule {
    options.reqIdHeader ??= 'x-request-id'
    return {
      module: BunyanLoggerModule,
      providers: [{
        provide: 'BunyanOptions',
        useValue: options.bunyan,
      }, {
        provide: 'Options',
        useValue: options,
      }],
      global: options.isGlobal,
    }
  }

  public static forRootAsync(options: IAsyncOptions): DynamicModule {
    options.reqIdHeader ??= 'x-request-id'
    return {
      module: BunyanLoggerModule,
      providers: [{
        provide: 'BunyanOptions',
        ...options.bunyan,
      }, {
        provide: 'Options',
        useValue: options,
      }],
      global: options.isGlobal,
    }
  }
}
