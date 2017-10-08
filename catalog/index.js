import React from 'react';
import ReactDOM from 'react-dom';
import { Catalog, pageLoader } from 'catalog';

const pages = [
  {
    path: '/',
    title: 'Welcome',
    content: pageLoader(() => import('./WELCOME.md')),
  },
  {
    path: '/elements',
    title: 'Elements',
    content: pageLoader(() => import('./ElementPage.js')),
  },
];

ReactDOM.render(<Catalog title="Catalog" pages={pages} />, document.getElementById('catalog'));
