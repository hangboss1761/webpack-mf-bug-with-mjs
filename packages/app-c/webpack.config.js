const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'demo-package': 'demo-package/index.mjs'
      //NOTE: .esm.js file got the same result
      // 'demo-package': 'demo-package/index.esm.js'
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'webpack-mf-bug-with-mjs',
      library: { type: 'var', name: 'webpack-mf-bug-with-mjs' },
      filename: 'remoteEntry.js',
      // NOTE: Don't share the package, you will get the desired result
      // shared: ['demo-package'],
    }),
  ],
};