import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipants } from "./routes/get-participants";
import { env } from "./env";
import { registerUser } from "./routes/register-user";
import { login } from "./routes/login-user";
import authPlugin from "./middlewares/auth";
const app = fastify({
  logger: true
});

app.register(cors, {
  origin: '*'
});

app.register(jwt, {
  secret: env.JWT_SECRET
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(authPlugin, async function (fastifyInstance) {
  app.register(registerUser);
  app.register(login);

  //Trip
  createTrip(fastifyInstance);
  confirmTrip(fastifyInstance);
  getTripDetails(fastifyInstance);
  updateTrip(fastifyInstance);

  //Participant
  confirmParticipant(fastifyInstance);
  getParticipants(fastifyInstance);

  //Activity
  createActivity(fastifyInstance);
  getActivity(fastifyInstance);

  //Link
  createLink(fastifyInstance);
  getLinks(fastifyInstance);

  //Invite
  createInvite(fastifyInstance);
});

const port = env.PORT || 3000;

app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`server is running on port ${port}`)
})