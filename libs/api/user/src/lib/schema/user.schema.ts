import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as bcryptjs from 'bcryptjs'
import { HydratedDocument } from 'mongoose'
export enum Role {
  USER = 'user',
  EMPLOYER = 'employer',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ type: String, slug: 'title', unique: true })
  email: string

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role

  @Prop({ required: true, select: false })
  password: string

  comparePassword: (password: string) => Promise<boolean>
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 10)
  }
  next()
})

UserSchema.methods.comparePassword = async function (plainPassword: string) {
  return await bcryptjs.compare(plainPassword, this.password)
}
