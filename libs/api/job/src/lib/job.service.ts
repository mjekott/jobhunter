import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateJobDto } from './dto/create-job.dto'
import { Job, JobDocument } from './schema/job.schema'
import geoCoder from './utils/geocoder'

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

  async getJobsInRadius(data: { zipCode: number; distance: number }) {
    const loc = await geoCoder.geocode(data.zipCode)
    const latitude = loc[0].latitude
    const longitude = loc[0].longitude
    const radius = data.distance / 3963
    return await this.jobModel.find({
      location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } },
    })
  }

  async updateJob(id: string, data: CreateJobDto) {
    await this.findJobOrFail(id)

    return this.jobModel.findByIdAndUpdate(id, data, {
      new: true,
    })
  }

  async deleteJob(id: string) {
    await this.findJobOrFail(id)

    return this.jobModel.findByIdAndDelete(id)
  }
  async getJobById(id: string) {
    return await this.findJobOrFail(id)
  }

  async getJobBySlug(slug: string) {
    return await this.jobModel.findOne({ slug })
  }

  async getStatistics(topic: string) {
    const stats = await this.jobModel.aggregate([
      {
        $match: { $text: { $search: '"' + topic + '"' } },
      },
      {
        $group: {
          _id: { $toUpper: '$experience' },
          totalJobs: { $sum: 1 },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
          avgSalary: { $avg: '$salary' },
        },
      },
    ])

    return stats
  }

  private async findJobOrFail(id: string) {
    const job = await this.jobModel.findById(id)
    if (!job) {
      throw new NotFoundException(`Job not found`)
    }
    return job
  }
}
