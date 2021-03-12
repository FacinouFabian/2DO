import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import bcrypt from 'bcryptjs'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'
import { PrismaClient, User, Task } from '@prisma/client'
import generator from 'generate-password'

const api = Router()

const prisma = new PrismaClient()

api.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user: User | null = await prisma.user.findFirst({
      where: { id: parseInt(id) },
    })
    res.status(CREATED.status).json(success(user))
    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.get('/:id/tasks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const tasks: Task[] | null = await prisma.task.findMany({
      where: { userId: parseInt(id) },
    })

    res.status(CREATED.status).json(success(tasks))

    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:id/', async (req: Request, res: Response) => {
  const fields: string[] = []
  try {
    const { id } = req.params

    const missings: string[] = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { firstname, lastname, email, birthdate, gender, password } = req.body

    const user: User | null = await prisma.user.findFirst({
      where: { id: parseInt(id) },
    })

    if (user != null) {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          firstname: firstname ? firstname : user.firstname,
          lastname: lastname ? lastname : user.lastname,
          email: email ? email : user.email,
          encryptedPassword: password ? password : user.encryptedPassword,
          birthdate: birthdate ? new Date(birthdate) : user.birthdate,
          gender: gender ? gender : user.gender,
        },
      })

      res.status(OK.status).json(success(user))

      await prisma.$disconnect()
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user: User | null = await prisma.user.findFirst({
      where: { id: parseInt(id) },
    })

    await prisma.user.delete({
      where: { id: parseInt(id) },
    })

    res.status(OK.status).json(success(user))

    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:email/resetPassword', async (req: Request, res: Response) => {
  try {
    const { email } = req.params

    const password = generator.generate({
      length: 10,
      numbers: true,
    })

    const user: User | null = await prisma.user.findFirst({
      where: { email },
    })

    if (user) {
      const passwordHash = bcrypt.hashSync(password)
      if (!bcrypt.compareSync(password, user.encryptedPassword)) {
        await prisma.user.update({
          where: { email },
          data: {
            encryptedPassword: passwordHash,
          },
        })
        res.status(OK.status).json(success(user))
        console.log('Nouveau mot de passe : ', password)
      } else {
        res.status(BAD_REQUEST.status).json({
          err: 'mot de passe courant identique au nouveau mot de passe',
        })
      }
      await prisma.$disconnect()
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'user inexistant' })
    }
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
