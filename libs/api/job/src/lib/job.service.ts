import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateJobDto } from './dto/create-job.dto'
import { Job, JobDocument } from './schema/job.schema'
import { ApiFilters } from './utils/apiFilters'
import geoCoder from './utils/geocoder'

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument>) {}
  async getAll(query: { [key: string]: string }) {
    const apiFilters = new ApiFilters(this.jobModel.find(), query)
      .filter()
      .sort()
      .limitFields()
      .searchByQuery()
      .pagination()
    const jobs: any = await apiFilters.query
    return { count: jobs.length, jobs }
  }
  async createJob(data: CreateJobDto, creator: string) {
    const newJob = new this.jobModel({ ...data, creator })
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

  async updateJob(id: string, data: CreateJobDto, currentUser: string) {
    const job = await this.findJobOrFail(id)
    this.authorizeUser(job.creator.id, currentUser)
    return this.jobModel.findByIdAndUpdate(id, data, {
      new: true,
    })
  }

  async deleteJob(id: string, currentUser: string) {
    const job = await this.findJobOrFail(id)

    this.authorizeUser(job.creator.id, currentUser)

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
    const job = await this.jobModel.findById(id).populate('creator')
    if (!job) {
      throw new NotFoundException(`Job not found`)
    }
    return job
  }

  private authorizeUser(creatorId: string, currentUserID) {
    if (creatorId !== currentUserID) {
      throw new ForbiddenException('No access to this resource')
    }
  }
}
