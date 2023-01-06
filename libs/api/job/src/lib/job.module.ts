import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as schemaPlugin from 'mongoose-slug-generator'
import { JobController } from './job.controller'
import { JobService } from './job.service'
import { Job, JobSchema } from './schema/job.schema'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Job.name,
        useFactory: () => {
          const schema = JobSchema
          schema.plugin(schemaPlugin)
          return schema
        },
      },
    ]),
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [],
})
export class JobModule {}
