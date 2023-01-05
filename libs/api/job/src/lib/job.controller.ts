import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { JobService } from './job.service'

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get_all_jobs')
  @CacheTTL(60)
  async getAll() {
    return this.jobService.getAll()
  }

  @Post()
  async createJob(@Body() data: CreateJobDto) {
    const job = await this.jobService.createJob(data)
    return { message: 'Job Created', job }
  }
}
