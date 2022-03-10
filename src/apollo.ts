import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import logger from './helper/logger';
import { typeDefApp } from './apollo/typedef';
import { resolverApp } from './apollo/resolver';
import { config } from './helper/config';

const server = new ApolloServer({
  typeDefs: typeDefApp,
  resolvers: resolverApp,
  introspection: true,
});

(async () => {
  const app = express();
  await server.start();

  app.use(cors());

  server.applyMiddleware({ app });

  app.listen(config.serviceBindAddress, () => {
    logger.info(
      `Now browse to http://${config.serviceBindAddress.host}:${config.serviceBindAddress.port}${server.graphqlPath}`,
    );
  });
})();

const handler = async (signal: string) => {
  logger.info(`Received ${signal} terminating`, process.pid);
  await server.stop();
  process.exit(0);
};

process.on('SIGTERM', handler);
process.on('SIGINT', handler);
