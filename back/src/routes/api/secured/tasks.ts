import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../../core/constants/api'

import { PrismaClient, Task } from '@prisma/client'

const api = Router()

const prisma = new PrismaClient()

api.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const task: Task | null = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    })
    res.status(CREATED.status).json(success(task))

    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.get('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const task: Task | null = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    })

    if (task != null) {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          isComplete: !task.isComplete,
        },
      })

      res.status(OK.status).json(success(task))
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'tâche inexistante' })
    }
    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.post('/', async (req: Request, res: Response) => {
  const fields = ['content', 'userID']

  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const { content, userID } = req.body
    if (content == '') {
      throw new Error('No task content was provided.')
    }

    const task = await prisma.task.create({
      data: {
        content,
        isComplete: false,
        userId: parseInt(userID),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    res.status(CREATED.status).json(success(task))

    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:id/', async (req: Request, res: Response) => {
  const fields: string[] = ['content']
  try {
    const { id } = req.params

    const missings: string[] = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { content } = req.body

    const task: Task | null = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    })

    if (task != null) {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          content,
        },
      })

      res.status(OK.status).json(success(task))
    } else {
      res.status(BAD_REQUEST.status).json({ err: 'tâche inexistante' })
    }
    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const task: Task | null = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    })

    await prisma.task.delete({
      where: { id: parseInt(id) },
    })

    res.status(OK.status).json(success(task))

    await prisma.$disconnect()
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
