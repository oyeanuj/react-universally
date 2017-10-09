import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import { JobProvider, createJobContext } from 'react-jobs';
import asyncBootstrapper from 'react-async-bootstrapper';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import configureStore from '../../../src/redux/configureStore';
import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import messages from '../../../src/translations/en.json';

import config from '../../../config';
import DemoApp from '../../../src/components/DemoApp';
import ServerHTML from './ServerHTML';
import { log } from '../../../internal/utils';

/**
 * React application middleware, supports server side rendering.
 */
export default function reactApplicationMiddleware(request, response) {
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;
  const sheet = new ServerStyleSheet();
  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      // eslint-disable-next-line no-console
      log({
        title: 'Server',
        level: 'info',
        message: `Handling react route without SSR: ${request.url}`,
      });
    }
    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(sheet.collectStyles(<ServerHTML nonce={nonce} />));
    response.status(200).send(`<!DOCTYPE html>${html}`);
    return;
  }

  // Create a context for our AsyncComponentProvider.
  const asyncComponentsContext = createAsyncContext();

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  // Create the job context for our provider, this grants
  // us the ability to track the resolved jobs to send back to the client.
  const jobContext = createJobContext();

  // Create the redux store.
  const store = configureStore();
  /*
  NOTE: Currently, since this only has support for one default language,
  we can import `en.json` as `messages` directly and pass it to `<IntlProvider />`

  Once we are dealing with multiple languages, we should extract out all `intl`,
  `messages`, and `locale` data into a separate file.

  Apart from hiding away the details, the file will create the appropriate `messages` object to pass to `<IntlProvider />` by accounting for adding `defaultMessage` where translation doesn't exist for that message.

  Sample to base it off of:
  https://github.com/react-boilerplate/react-boilerplate/blob/dde20e76bc87965eba347373244251a5a36d290d/app/i18n.js#L1

  (react-boilerplate/app/i18n.js)

  */

  const locale = 'en';
  addLocaleData([...en]);

  // Declare our React application.
  const app = (
    <AsyncComponentProvider asyncContext={asyncComponentsContext}>
      <JobProvider jobContext={jobContext}>
        <StaticRouter location={request.url} context={reactRouterContext}>
          <Provider store={store}>
            <IntlProvider locale={locale} messages={messages} initialNow={Date.now()}>
              <DemoApp />
            </IntlProvider>
          </Provider>
        </StaticRouter>
      </JobProvider>
    </AsyncComponentProvider>
  );

  // Pass our app into the react-async-component helper so that any async
  // components are resolved for the render.
  asyncBootstrapper(app).then(() => {
    const appString = renderToString(sheet.collectStyles(app));
    const styleElement = sheet.getStyleElement();
    // Generate the html response.
    const html = renderToStaticMarkup(<ServerHTML
      reactAppString={appString}
      styleElement={styleElement}
      nonce={nonce}
      helmet={Helmet.rewind()}
      storeState={store.getState()}
      routerState={reactRouterContext}
      jobsState={jobContext.getState()}
      asyncComponentsState={asyncComponentsContext.getState()}
    />);

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      response.status(302).setHeader('Location', reactRouterContext.url);
      response.end();
      return;
    }

    response
      .status(reactRouterContext.missed
        ? // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        404
        : // Otherwise everything is all good and we send a 200 OK status.
        200)
      .send(`<!DOCTYPE html>${html}`);
  });
}
