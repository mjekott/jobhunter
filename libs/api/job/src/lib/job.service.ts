import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateJobDto } from './dto/create-job.dto'
import { Job, JobDocument } from './schema/job.schema'

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument>) {}
  async getAll() {
    return this.jobModel.find({})
  }
  async createJob(data: CreateJobDto) {
    const newJob = new this.jobModel(data)
    await newJob.save()
    return newJob
  }
}
