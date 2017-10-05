# React-Universally + React-Intl

This is a feature branch that is a Proof of Concept of integrating with React-Intl. Currently, this supports one default language with no switching or async loading of locale/translations loading.

## Instructions:

```sh
yarn; yarn clean; yarn intl:extract; yarn develop
```
Go to: http://localhost:1337/about (the page with `react-intl` integrated)

## Adding support for more than default language:

To do this properly, we would need to do the following:

1. Get translations translated in the languages desired.
2. Import locale-data and the translated `json` file on both client-side and server-side.
3. Detect user-agent on the server-side from the request headers, and from the browser in the client-side.
4. Abstract out the importing and use of `<IntlProvider />` into its own file. Today, we can import `en.json` as `messages` directly and pass it to `<IntlProvider />`.  Once we are dealing with multiple languages, we should extract out all `intl`, `messages`, and `locale` data into a separate file. Apart from hiding away the details, the file will create the appropriate `messages` object to pass to `<IntlProvider />` by accounting for adding `defaultMessage` where translation doesn't exist for that message. Inspiration:
[react-boilerplate/app/i18n.js](https://github.com/react-boilerplate/react-boilerplate/blob/dde20e76bc87965eba347373244251a5a36d290d/app/i18n.js#L1)
5. Integrate with Redux for language switching via a toggle. This would mean not only a toggle component, but also reducers, actions, selectors to tie it all up.
6. Async loading of locales and translations for the chosen language.
7. Enable extraction of locale-data into the build.
8. Add relevant locale polyfills for node and browser.

If you do end up completing any of the above tasks, I'd appreciate a PR 😄

## Prior Art
_note: only the first one seems to be up to date._

1. [React-Boilerplate](https://github.com/react-boilerplate/react-boilerplate/blob/master/docs/js/i18n.md)

2. Earlier attempts at integrating React-Intl with React-Universally are [here](https://github.com/ctrlplusb/react-universally/issues/254), [here](https://github.com/ctrlplusb/react-universally/pull/300), and [here](https://github.com/ctrlplusb/react-universally/pull/338)

3. [React Starter Kit](https://github.com/kriasoft/react-starter-kit/blob/feature/react-intl/docs/recipes/how-to-integrate-react-intl.md)

4. [Internationalization in React](https://medium.freecodecamp.org/internationalization-in-react-7264738274a0)
