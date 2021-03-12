import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

import { PrismaClient, User } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

/**
 * Local strategy
 */

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, next) => {
      try {
        /* const user = await User.findOne({ email },{ relations: ["rank"] })*/
        const user: User | null = await prisma.user.findFirst({
          where: { email },
        })

        if (!user) {
          next(`Sorry, login is incorrect 💩💩`, null)
          return
        }

        if (!bcrypt.compareSync(password, user.encryptedPassword)) {
          next(`Sorry, login is incorrect 💩💩 `, null)
          return
        }

        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)

/**
 * JSON Web Token strategy
 */

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION as string,
    },
    async (jwtPayload, next) => {
      try {
        const { id } = jwtPayload

        const user: User | null = await prisma.user.findFirst({
          where: { id },
        })

        if (!user) {
          next(`User ${id} doesn't exist`)
          return
        }

        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)
