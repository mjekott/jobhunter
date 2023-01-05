import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JobController } from './job.controller'
import { JobService } from './job.service'
import { Job, JobSchema } from './schema/job.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService],
  exports: [],
})
export class JobModule {}
