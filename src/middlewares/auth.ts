import { FastifyPluginCallback } from "fastify";

const authPlugin: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.routerPath === '/register' || request.routerPath === '/login') {
      return;
    }
    try {
      await request.jwtVerify();
    } catch (err: any) {
      if (err.message === 'TokenExpiredError') {
        reply.code(401).send({ error: 'Token expired' });
      }
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  done();
}

export default authPlugin;