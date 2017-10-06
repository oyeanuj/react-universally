import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducer from '../reducers';

function configureStore(initialState) {
  // Initialising redux-thunk with extra arguments will pass the below
  // arguments to all the redux-thunk actions. Below we are passing a
  // preconfigured axios instance which can be used to fetch data with.
  // @see https://github.com/gaearon/redux-thunk

  const middlewares = [thunk.withExtraArgument({ axios })];

  // Enable redux-logger in development mode, with specially composed options.
  // This shows redux action logs in the console
  if (process.env.BUILD_FLAG_IS_DEV) {
    let logger;

    /* eslint-disable no-undef */
    if (__SERVER__) {
      /* eslint-disable-next-line global-require */
      const createCLILogger = require('redux-cli-logger').default;
      logger = createCLILogger({});
    } else {
      /* eslint-disable-next-line global-require */
      const { createLogger } = require('redux-logger');

      logger = createLogger({
        logger: console,
        duration: true,
        diff: true,
        collapsed: true,
      });
    }

    middlewares.push(logger);
  }

  // Redux Dev Tools store enhancer.
  // @see https://github.com/zalmoxisus/redux-devtools-extension
  // We only want this enhancer enabled for development and when in a browser
  // with the extension installed.

  /* eslint-disable no-underscore-dangle */

  const canDevTool =
    process.env.BUILD_FLAG_IS_DEV &&
    process.env.BUILD_FLAG_IS_CLIENT &&
    typeof window !== 'undefined' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = canDevTool
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: { options: true } })
    : compose;

  /* eslint-enable */

  const enhancers = composeEnhancers(
    // Middleware store enhancer.
    applyMiddleware(...middlewares),
  );

  const store = initialState
    ? createStore(reducer, initialState, enhancers)
    : createStore(reducer, enhancers);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    // Enable Webpack hot module replacement for reducers. This is so that we
    // don't lose all of our current application state during hot reloading.
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

// NOTE: If we create an '/api' endpoint in our application then we will need to
// configure the axios instances so that they will resolve to the proper URL
// endpoints on the server. We have to provide absolute URLs for any of our
// server bundles. To do so we can set the default 'baseURL' for axios. Any
// relative path requests will then be appended to the 'baseURL' in order to
// form an absolute URL.
// We don't need to worry about this for client side executions, relative paths
// will work fine there.
// Example:
//
// const axiosConfig = process.env.IS_NODE === true
//   ? { baseURL: process.env.NOW_URL || notEmpty(process.env.SERVER_URL) }
//   : {};
//
// Then we will then have to initialise our redux-thunk middlware like so:
//
// thunk.withExtraArgument({
//   axios: axios.create(axiosConfig),
// })

export default configureStore;
