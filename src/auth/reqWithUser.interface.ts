import { Request } from 'express'
import { User } from '@prisma/client'

interface ReqWithUser extends Request {
  user: User
}

export default ReqWithUser
