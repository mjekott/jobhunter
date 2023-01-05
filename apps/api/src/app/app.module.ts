import { CoreModule } from '@jobhunter/api/core'
import { JobModule } from '@jobhunter/api/job'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [CoreModule, JobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
