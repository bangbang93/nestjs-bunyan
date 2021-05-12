import {Controller, Get, Injectable, Module, OnModuleInit, Req, Scope} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {Request} from 'express'
import {BunyanLoggerModule, InjectLogger, ReqLogger} from '../src'
import Logger = require('bunyan')

@Injectable()
export class AppService implements OnModuleInit {
  @InjectLogger() private readonly logger: Logger

  public onModuleInit(): any {
    this.logger.info('success')
  }
}

@Controller({scope: Scope.REQUEST})
export class AppController {
  @ReqLogger() private readonly logger: Logger

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
    })
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}

describe('nestjs-bunyan', function () {
  it('bootstrap', async function () {
    const app = await NestFactory.create(AppModule)
    const logger = app.get('Logger')
    logger.info('custom logger')
  })
})
