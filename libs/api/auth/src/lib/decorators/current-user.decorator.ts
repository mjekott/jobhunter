import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'libs/api/user/src/lib/schema/user.schema'

export const CurrentUser = createParamDecorator((data, context: ExecutionContext): User => {
  const req = context.switchToHttp().getRequest()
  return req.user
})
