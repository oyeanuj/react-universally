import { configure, addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { setDefaults } from 'react-storybook-addon-props-combinations';
import centered from '@storybook/addon-centered';

const req = require.context('../src/components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

setConsoleOptions({
  panelExclude: [],
});

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(centered);

configure(loadStories, module);
