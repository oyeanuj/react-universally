 - [Project Overview](/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/docs/PROJECT_CONFIG.md)
 - __[Package Script Commands](/docs/PKG_SCRIPTS.md)__
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/docs/DEPLOY_TO_NOW.md)
 - [FAQ](/docs/FAQ.md)

# Package Scripts

## `yarn analyze:client`

Creates an `webpack-bundle-analyze` session against the production build of the client bundle.

## `yarn analyze:server`

Creates an `webpack-bundle-analyze` session against the production build of the server bundle.

## `yarn build`

Builds the client and server bundles, with the output being optimized.

## `yarn build:dev`

Builds the client and server bundles, with the output including development related code.

## `yarn clean`

Deletes any build output that would have originated from the other commands.

## `yarn deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

## `yarn develop`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

## `yarn lint`

Executes `eslint` against the project. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

## `yarn start`

Executes the server.  It expects you to have already built the bundles using the `yarn build` command.

## `yarn intl:extract`

Extracts the messages defined in each component for `React-Intl`, to a central list of messages for translations, and to supply to `<IntlProvider />`. Make sure to run this command before building.

## `yarn size`

Runs the [`size-limit`](https://github.com/ai/size-limit) script to give you an idea of the size of your client bundle, when minified and gzipped, with all dependencies.
