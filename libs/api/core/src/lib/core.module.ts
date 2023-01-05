import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as redisStore from 'cache-manager-redis-store'
import { configuration } from './config/configuration'
import { validationSchema } from './config/validation'

@Module({
  imports: [
    CacheModule.register<any>({
      isGlobal: true,
      store: redisStore,
      URL: 'rediss://red-cerhtkp4reb229l8etmg:Gi1w22LpCDLIv4z38r0Z6Um9GyhvYAAa@oregon-redis.render.com:6379',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
