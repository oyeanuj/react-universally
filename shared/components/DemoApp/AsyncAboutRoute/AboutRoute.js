import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function AboutRoute() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Helmet>
        <title>About</title>
      </Helmet>

      <h1>
        <FormattedMessage id="About.title" values={{ library: 'React Universally' }} />
      </h1>

      <p>Produced with ❤️</p>

      <p>
        View our contributors list on our{' '}
        <a href="https://github.com/ctrlplusb/react-universally">GitHub</a> page.
      </p>
    </div>
  );
}

export default AboutRoute;
