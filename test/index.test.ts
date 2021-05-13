import {Controller, Get, Inject, Injectable, Module, OnModuleInit, Req, Scope} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {stdSerializers} from 'bunyan'
import {Request} from 'express'
import {BunyanLoggerModule, InjectLogger} from '../src'
import {BunyanLogger, BunyanRequestLogger} from '../src/logger.constant'
import {randomBytes} from 'crypto'
import Logger = require('bunyan')
import supertest = require('supertest')

@Injectable()
export class AppService implements OnModuleInit {
  @InjectLogger() public readonly logger: Logger

  public onModuleInit(): any {
    this.logger.info('success')
  }
}

@Controller({scope: Scope.REQUEST})
export class AppController {
  @Inject(BunyanRequestLogger) private readonly logger: Logger

  @Get()
  public async log(@Req() req: Request): Promise<void> {
    this.logger.info({req})
  }
}

@Module({
  imports: [
    BunyanLoggerModule.forRoot({
      bunyan: {
        name: 'bunyan-logger-test',
      },
      isGlobal: true,
      isEnableRequestLogger: true,
      customRequestLogger(childLogger: Logger, request: unknown): Logger {
        childLogger.addSerializers(stdSerializers)
        return childLogger
      },
    })
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}

describe('nestjs-bunyan', function () {
  it('bootstrap', async function () {
    const app = await NestFactory.create(AppModule)
    const logger = await app.resolve(BunyanLogger)
    logger.info('custom logger')
    await app.init()
    const agent = supertest.agent(app.getHttpServer())
    await agent.get('/').set({'x-request-id': randomBytes(16).toString('hex')}).expect(200)
    await app.close()
  })
})
