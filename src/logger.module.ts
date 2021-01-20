import {DynamicModule, Module} from '@nestjs/common'
import {FactoryProvider} from '@nestjs/common/interfaces/modules/provider.interface'
import * as Logger from 'bunyan'
import {
  createLoggerExports, createLoggerProviders, createReqLoggerExports, createRequestLoggerProviders,
} from './logger.providers'

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
      }
    }
  ],
})
export class BunyanLoggerModule {
  public static forRoot(options: IOptions): DynamicModule {
    options.reqIdHeader ??= 'x-request-id'
    const loggerProviders = createLoggerProviders()
    const reqLoggerProviders = options.isEnableRequestLogger ? createRequestLoggerProviders(options.reqIdHeader, options.customRequestLogger) : []
    const reqLoggerExports = options.isEnableRequestLogger ? createReqLoggerExports(): []
    return {
      module: BunyanLoggerModule,
      providers: [{
        provide: 'BunyanOptions',
        useValue: options.bunyan,
      },
        ...loggerProviders,
        ...reqLoggerProviders,
      ],
      exports: [
        ...createLoggerExports(),
        ...reqLoggerExports
      ],
      global: options.isGlobal,
    }
  }

  public static forRootAsync(options: IAsyncOptions): DynamicModule {
    options.reqIdHeader ??= 'x-request-id'
    const loggerProviders = createLoggerProviders()
    const reqLoggerProviders = options.isEnableRequestLogger ? createRequestLoggerProviders(options.reqIdHeader, options.customRequestLogger) : []
    const reqLoggerExports = options.isEnableRequestLogger ? createReqLoggerExports(): []
    return {
      module: BunyanLoggerModule,
      providers: [{
        provide: 'BunyanOptions',
        ...options.bunyan,
      },
        ...loggerProviders,
        ...reqLoggerProviders,
      ],
      exports: [
        ...createLoggerExports(),
        ...reqLoggerExports,
      ],
      global: options.isGlobal,
    }
  }
}
