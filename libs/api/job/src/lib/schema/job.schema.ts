import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import geoCoder from '../utils/geocoder'
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

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string

  @Prop({ index: '2dsphere' })
  coordinates: number[]

  formattedAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Job {
  @Prop({ required: true, index: true })
  title: string

  @Prop({ type: String, slug: 'title', unique: true })
  slug: string

  @Prop({ index: true })
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

  @Prop({ type: Object, ref: 'Location' })
  location?: Location
}

export const JobSchema = SchemaFactory.createForClass(Job)
JobSchema.index({ title: 'text', description: 'text' })

JobSchema.pre('save', async function (next) {
  if (this.isModified('address')) {
    const loc = await geoCoder.geocode(this.address)
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipCode: loc[0].zipCode,
      country: loc[0].countryCode,
    }
  }
  next()
})
