import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT
  await app.listen(port)
  Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  Logger.log(`
Running in ${config.get('environment')} mode
`)
}

bootstrap()
