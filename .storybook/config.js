import { configure, addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { setDefaults } from 'react-storybook-addon-props-combinations';
import '@storybook/addon-console';

const req = require.context('../shared/components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

setConsoleOptions({
  panelExclude: [],
});

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

configure(loadStories, module);
