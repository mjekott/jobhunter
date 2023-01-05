import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type JobDocument = HydratedDocument<Job>

export enum Industry {
  BUSINESS = 'Business',
  INFORMATION_TECHNOLOGY = 'Information Technology',
  BANKING = 'Banking',
  EDUCATION_TRAINING = 'Education/Training',
  OTHERS = 'Others',
}
export enum Degree {
  BSC = 'Bsc',
  MSC = 'Msc',
  PHD = 'PHD',
}
export enum Experience {
  '1Year' = '1 Year - 2 Years',
  '2Years-5Years' = '2 Years - 5 Years',
  '5Years+' = '5 Years+',
}

@Schema({
  timestamps: true,
})
export class Job {
  @Prop({ required: true })
  title: string

  @Prop()
  slug: number

  @Prop()
  description: string

  @Prop()
  address: string

  @Prop({ required: true })
  company: string

  @Prop()
  industry: Industry

  @Prop()
  degrees: Degree

  @Prop({ default: 1 })
  vacancies: number

  @Prop()
  experience: Experience

  @Prop()
  salary: number

  @Prop({ default: new Date().setDate(new Date().getDate() + 7) })
  lastDate: Date

  @Prop({ default: [] })
  noOfApplicants: number[]
}

export const JobSchema = SchemaFactory.createForClass(Job)
