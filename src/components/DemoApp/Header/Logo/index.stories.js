import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { MemoryRouter } from 'react-router';

import Logo from './';

storiesOf('Logo', module).add('just the logo', () => <Logo />);
