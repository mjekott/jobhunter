import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findOne(email: string, fields = '-__v') {
    return this.userModel.findOne({ email }).select(fields)
  }

  async findById(id: string) {
    return this.userModel.findById(id)
  }

  async create(data: { email: string; name: string; password: string; role: string }) {
    const user = new this.userModel(data)
    return await user.save()
  }
}
