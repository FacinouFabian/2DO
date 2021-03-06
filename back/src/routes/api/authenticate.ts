import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import { PrismaClient } from '@prisma/client'

const api = Router()
const prisma = new PrismaClient()

api.post('/signup', async (req: Request, res: Response) => {
  const fields = ['firstname', 'lastname', 'email', 'password', 'passwordConfirmation', 'birthdate', 'gender']

  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const { firstname, lastname, email, password, passwordConfirmation, gender, birthdate } = req.body
    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        encryptedPassword: bcrypt.hashSync(password),
        birthdate: new Date(birthdate),
        gender,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    const payload = { id: user.id, firstname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
    res.status(CREATED.status).json(success(user, { token }))
  } catch (err) {
    console.log('ee')
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.post('/signin', async (req: Request, res: Response, next) => {
  const fields = ['email', 'password']
  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
      if (errorMessage) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error(errorMessage)))
        return
      }
      const payload: UserPayload = { id: user.id, firstname: user.firstname }
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
      req.user = payload
      res.status(OK.status).json(success(user, { token }))
    })

    authenticate(req, res, next)
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
