// import express from 'express';
import cors from 'cors';
import config from '../config';
import express from 'express';
import { createServer } from 'http';

import server from './graphql/server';
const app = express();

// not sure this is necessary anymore
app.use('*', cors({ origin: `http://localhost:${config.serverPort}` }));
const httpServer = createServer(app);

server.applyMiddleware({ app, path: '/graphql' });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: config.serverPort }, () => {
  console.log(`apollo Server on http://localhost:${config.serverPort}/graphql`);
});