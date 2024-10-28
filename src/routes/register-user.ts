import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma";

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/register', {
    schema: {
      body: z.object({
        username: z.string().min(4),
        first_name: z.string().min(2),
        last_name: z.string().min(2),
        phone_number: z.string().min(10),
        email: z.string().email(),
        password: z.string().min(8)
      })
    }
  }, async (request, reply) => {
    const {
      username,
      first_name,
      last_name,
      phone_number,
      email,
      password
    } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword
      }
    });

    const token = app.jwt.sign({ id: user.id, email: user.email, phone_number: user.phone_number });
    reply.send({ token });
    // Logic to register the user goes here

    return { message: "User registered successfully" };
  })
}