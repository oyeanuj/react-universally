// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

// module.exports = {
//   plugins: [
//     // your custom plugins
//   ],
//   module: {
//     rules: [
//       // add your custom rules.
//        loader: 'file-loader',
// 	  exclude: [/\.js$/, /\.html$/, /\.json$/],
//     ],
//   },
// };

const path = require('path').default;

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.
  config.module.rules.push({
    test: /\.(jpeg|jpg|gif|png)$/,
    // include: path.resolve(__dirname, '../'),
    loader: require.resolve('file-loader'),
  });

  return config;
};
