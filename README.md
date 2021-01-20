# nestjs-bunyan

Inject bunyan logger via decorator

## Usage
app.ts
```typescript
@Module({
  imports: [
    BunyanLoggerModule.forRoot({
      isGlobal: true,
      isEnableRequestLogger: true,
      bunyan: {
        name: 'some awesome app',
      },
    }),
  ],
})
export class AppModule {}
```
some.controller.ts
```typescript
@Controller()
export class SomeController {
  @ReqLogger() private readonly logger: Bunyan
}
```
some.service.ts

```typescript
import {Injectable} from '@nestjs/common'

@Injectable()
export class SomeService {
  @Logger() private readonly logger: Bunyan
}
```

## Customize Request Logger
app.ts
```typescript
@Module({
  imports: [
    BunyanLoggerModule.forRoot({
      isGlobal: true,
      isEnableRequestLogger: true,
      customRequestLogger(logger: Bunyan, req: Request) {
        return logger.child({userId: req.session.uid})
      },
      bunyan: {
        name: 'some awesome app',
      },
    }),
  ],
})
export class AppModule {}
```
