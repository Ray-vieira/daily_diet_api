import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { app } from './app'
import { env } from './env'
import { MealsRoutes } from './routes/meals'
import { UsersRoutes } from './routes/users'

const app = fastify()

app.register(cookie)
app.register(mealsRoutes, UsersRoutes, {
    prefix: 'routes'
})