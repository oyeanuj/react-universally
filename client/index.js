/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import asyncBootstrapper from 'react-async-bootstrapper';
import { AsyncComponentProvider } from 'react-async-component';
import { addLocaleData, IntlProvider } from 'react-intl';

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

import en from 'react-intl/locale-data/en';
import messages from '../shared/translations/en.json';

import './polyfills';

import ReactHotLoader from './components/ReactHotLoader';
import DemoApp from '../shared/components/DemoApp';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = 'pushState' in window.history;

// Get any rehydrateState for the async components.
// eslint-disable-next-line no-underscore-dangle
const asyncComponentsRehydrateState = window.__ASYNC_COMPONENTS_REHYDRATE_STATE__;

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp) {
  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.

  addLocaleData([...en]);

  const app = (
    <ReactHotLoader>
      <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
        <IntlProvider locale="en" messages={messages}>
          <BrowserRouter forceRefresh={!supportsHistory}>
            <TheApp />
          </BrowserRouter>
        </IntlProvider>
      </AsyncComponentProvider>
    </ReactHotLoader>
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  asyncBootstrapper(app).then(() => render(app, container));
}

// Execute the first render of our app.
renderApp(DemoApp);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require('./registerServiceWorker');

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept('../shared/components/DemoApp', () => {
    renderApp(require('../shared/components/DemoApp').default);
  });

  // Accept changes to translations for hot reloading.
  module.hot.accept('./i18n');
}
