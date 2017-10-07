import React from 'react';
import ReactDOM from 'react-dom';
import { Page, ReactSpecimen, ColorSpecimen } from 'catalog';
import { Logo, Menu } from '../shared/components/DemoApp/Header';

export default () => (
  <Page>
    <h2>My Buttons</h2>

    <p>Are so nice</p>

    <ul>
      <li>Yes</li>
      <li>or no?</li>
    </ul>

    <ReactSpecimen span={3}>
      <Logo />
      <Header />
    </ReactSpecimen>

    <ColorSpecimen name="Red" value="#FF5500" span={2} />
  </Page>
);
