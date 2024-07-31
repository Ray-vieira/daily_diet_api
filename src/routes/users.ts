import { FastifyInstance } from 'fastify' 
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'


export async function UsersRoutes(app: FastifyInstance) {
    
    app.post('/', async (request, reply) => {
        const createUsersBodySchema = z. object({
            name:  z.string(),
            email: z.string().email(),
        })

        const { name, email } = createUsersBodySchema.parse(
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

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}