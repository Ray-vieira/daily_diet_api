
import { FastifyInstance } from 'fastify' 
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function MealsRoutes(app: FastifyInstance) {
    
    app.post('/', async (request, reply) => {
        const createMealsBodySchema = z. object({
            name:  z.string(),
            description: z.string(),
            isOndiet: z.boolean(),
            date:z.coerce.date(),
        })

        const { name, description, isOndiet, date } = createMealsBodySchema.parse(
            request.body,
          )

          let sessionId = request.cookies.sessionId

          if (!sessionId) {
              sessionId = randomUUID()
  
              reply.cookie('sessionId', sessionId, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              })
          }
  
          await knex('meals').insert({
              id: randomUUID(),
              name,
              session_id: sessionId,
          })
  
          return reply.status(201).send()
      })
  }

    app.get(
      '/', 
    {
      preHandler: [checkSessionIdExists], 
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .select()

      return { meals } 
    })
