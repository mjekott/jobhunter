import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Degree, Experience, Industry } from '../schema/job.schema'

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string

  @IsNotEmpty()
  @IsString()
  readonly description: string

  @IsNotEmpty()
  @IsString()
  readonly address: string

  @IsNotEmpty()
  @IsString()
  readonly company: string

  @IsNotEmpty()
  @IsEnum(Industry, { message: 'Please enter correct Industry option' })
  readonly industry: Industry

  @IsNotEmpty()
  @IsEnum(Degree, { message: 'Please enter correct Degree option' })
  readonly degree: Degree

  @IsOptional()
  @IsNumber()
  readonly vacancies: number

  @IsNotEmpty()
  @IsEnum(Experience, { message: 'Please enter correct Experience option' })
  readonly experience: Experience

  @IsString()
  @IsOptional()
  readonly salary: number

  @IsDate()
  @IsOptional()
  readonly lastDate: Date
}
