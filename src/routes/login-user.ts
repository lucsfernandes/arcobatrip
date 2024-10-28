import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    const token = app.jwt.sign(
      { id: user.id, email: user.email, phone_number: user.phone_number },
      { expiresIn: '10s' }
    );
    reply.send({ token });

    return { message: "Logged in successfully" };
  });
}