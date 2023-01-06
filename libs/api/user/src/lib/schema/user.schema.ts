import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum Role {
  USER = 'user',
  EMPLOYER = 'employer',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ type: String, slug: 'title', unique: true })
  email: string

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role

  @Prop({ required: true })
  password: string
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)
