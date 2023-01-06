import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { IdValidationPipe } from './../../../shared/src/lib/pipes/id.validation.pipe'
import { CreateJobDto } from './dto/create-job.dto'
import { JobService } from './job.service'

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @ApiOperation({ summary: 'Get Jobs' })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get_all_jobs')
  @CacheTTL(60)
  async getAll(@Query() query: { [key: string]: string }) {
    return this.jobService.getAll(query)
  }

  @Get('/slug/:slug')
  async getJobBySlug(@Param('slug') slug: string) {
    return this.jobService.getJobBySlug(slug)
  }

  @Get('/statistics/:topic')
  async getStatistics(@Param('topic') topic: string) {
    return this.jobService.getStatistics(topic)
  }

  @Get('/:zipCode/:distance')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get_jobs_within_distance')
  @CacheTTL(60)
  async getJobsInRadius(@Param('zipCode') zipCode: number, @Param('distance') distance: number) {
    return this.jobService.getJobsInRadius({ zipCode, distance })
  }

  @Post()
  @HttpCode(201)
  async createJob(@Body() data: CreateJobDto) {
    return this.jobService.createJob(data)
  }

  @Get('/:id')
  async getJobById(@Param('id', IdValidationPipe) id: string) {
    return this.jobService.getJobById(id)
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'The ID of the job',
  })
  @ApiOkResponse({
    description: 'OK',
    type: CreateJobDto,
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
  })
  async updateJob(@Param('id', IdValidationPipe) id: string, @Body() data: CreateJobDto) {
    return this.jobService.updateJob(id, data)
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the job',
  })
  @ApiOkResponse({
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
  })
  @HttpCode(204)
  async deleteJob(@Param('id', IdValidationPipe) id: string) {
    return this.jobService.deleteJob(id)
  }
}
