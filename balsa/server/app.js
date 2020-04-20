import process from 'process';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { createConnection } from 'typeorm';
import http from 'http';
// import {devLog, commonLog} from './logging/core';
import jwtStrategy from './middleware/auth';
import { apolloServer } from './graphql';
import { Configurations } from './entities/configurations';
import { BalsaFile } from './entities/balsaFile';
import { FOLDER } from './constants';

dotenv.config();
createConnection()
  .then(async connection => {
    const app = express();

    const PORT = process.env.SERVER_PORT || 3000;

    // Logging
    // app.use(devLog);
    // app.use(commonLog);
    app.use(bodyParser.json(), cors());

    let config = await Configurations.findOne();
    if (!config) {
      config = new Configurations();
      await config.save();
    }

    /*
      Data migration for deprecation of isFolder
     */
    const files = await BalsaFile.find({ isFolder: true });
    if (files) {
      for (const file of files) {
        file.fileType = FOLDER;
        file.isFolder = false;
        await file.save();
      }
    }

    passport.use('jwt', jwtStrategy);
    app.use('/graphql', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
          req.user = user;
        }

        next();
      })(req, res, next);
    });

    app.use('/uploads', express.static('uploads'));

    const path = '/graphql';
    apolloServer.applyMiddleware({ app, path });

    const httpServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
    });
  })
  .catch(error => console.log(error));
