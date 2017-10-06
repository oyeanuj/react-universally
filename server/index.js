/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import offlinePage from './middleware/offlinePage';
import errorHandlers from './middleware/errorHandlers';
import config from '../config';
import { log } from '../internal/utils';

// Create our express based server.
const app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security);

// Gzip compress the responses.
app.use(compression());

// Register our service worker generated by our webpack config.
// We do not want the service worker registered for development builds, and
// additionally only want it registered if the config allows.
if (process.env.BUILD_FLAG_IS_DEV === 'false' && config('serviceWorker.enabled')) {
  app.get(`/${config('serviceWorker.fileName')}`, serviceWorker);
  app.get(
    `${config('bundles.client.webPath')}${config('serviceWorker.offlinePageFileName')}`,
    offlinePage,
  );
}

// Configure serving of our client bundle.
app.use(config('bundles.client.webPath'), clientBundle);

// Configure static serving of our "public" root http path static files.
// Note: these will be served off the root (i.e. '/') of our application.
app.use(express.static(pathResolve(appRootDir.get(), config('publicAssetsPath'))));

/* Healthcheck route */
app.get('/health', (request, response) => {
  response.status(200).send("Everybody says I'm okay!");
});

// The React application middleware.
app.get('*', (request, response) => {
  log({
    title: 'Request',
    level: 'special',
    message: `Received for "${request.url}"`,
  });

  return reactApplication(request, response);
});

// Error Handler middlewares.
app.use(...errorHandlers);

// Create an http listener for our express app.
const listener = app.listen(config('port'), () =>
  log({
    title: 'server',
    level: 'special',
    message: `✓

      ${config('welcomeMessage')}

      ${config('htmlPage.defaultTitle')} is ready!

      with

      Service Workers: ${config('serviceWorker.enabled')}
      Polyfills: ${config('polyfillIO.enabled')} (${config('polyfillIO.features').join(', ')})

      Server is now listening on Port ${config('port')}
      You can access it in the browser at http://${config('host')}:${config('port')}
      Press Ctrl-C to stop.



    `,
  }),
);

// We export the listener as it will be handy for our development hot reloader,
// or for exposing a general extension layer for application customisations.
export default listener;
