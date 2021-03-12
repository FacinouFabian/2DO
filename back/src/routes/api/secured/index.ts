import { Router } from 'express'
import users from './users'
import tasks from './tasks'

const api = Router()

api.use('/users', users)
api.use('/tasks', tasks)

export default api
