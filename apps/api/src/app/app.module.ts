import { AuthModule } from '@jobhunter/api/auth'
import { CoreModule } from '@jobhunter/api/core'
import { JobModule } from '@jobhunter/api/job'
import { UserModule } from '@jobhunter/api/user'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [CoreModule, UserModule, JobModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
