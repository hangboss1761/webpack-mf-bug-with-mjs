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
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'webpack-mf-bug-with-mjs',
      library: { type: 'var', name: 'webpack-mf-bug-with-mjs' },
      filename: 'remoteEntry.js',
      shared: ['demo-package'],
    }),
  ],
};