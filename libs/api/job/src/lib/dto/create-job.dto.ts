import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Degree, Experience, Industry } from '../schema/job.schema'

export class CreateJobDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly title: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly description: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly address: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly company: string

  @ApiProperty({ enum: Object.values(Industry) })
  @IsNotEmpty()
  @IsEnum(Industry, { message: 'Please enter correct Industry option' })
  readonly industry: Industry

  @ApiProperty({ enum: Object.values(Degree) })
  @IsNotEmpty()
  @IsEnum(Degree, { message: 'Please enter correct Degree option' })
  readonly degree: Degree

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  readonly vacancies: number

  @ApiProperty({ enum: Object.values(Experience) })
  @IsNotEmpty()
  @IsEnum(Experience, { message: 'Please enter correct Experience option' })
  readonly experience: Experience

  @ApiProperty({})
  @IsString()
  @IsOptional()
  readonly salary: number

  @ApiProperty({})
  @IsDate()
  @IsOptional()
  readonly lastDate: Date
}
