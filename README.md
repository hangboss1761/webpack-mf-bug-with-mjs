# Bug report

This is a bug about webpack module federation.

[Related issue](https://github.com/webpack/webpack/issues/16125)

## Start

```bash
pnpm install

pnpm build

pnpm test
```

## Tese Case

Shared package(demo-package) provite index.js/index.mjs/index.esm.js，the default exported file is index.js.

index.js:

```js
class AClass {
  constructor() {
    this.a = 1
  }

  install() {
    console.log('this.a', this.a)
  }
}

module.exports = AClass
```

index.mjs/index.esm.js:

```js
export default class AClass {
  constructor() {
    this.a = 1
  }

  install() {
    console.log('this.a', this.a)
  }
}

```

### Case1

In app-a

webpack.config.js

```js
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
```

The result of running bundle file is:

```bash
packages/app-a test: AClass from test.mjs:  [class AClass]
packages/app-a test: AClass from test.js:  [class AClass]
```

### Case2

In app-b, change config to export a mjs or .esm.js file from demo-package.

webpack.config.js

```js
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
      // NOTE: .esm.js file got the same result
      // 'demo-package': 'demo-package/index.esm.js'
    },
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
```

The result of running bundle file is:

```bash
packages/app-b test: AClass from test.mjs:  Object [Module] { default: [Getter] }
packages/app-b test: AClass from test.js:  [class AClass]
```

Got an **unexpected result** in test.mjs

### Case3

In app-c, do not share package, everything is normal.

webpack.config.js

```js
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
```

The result of running bundle file is:

```bash
packages/app-c test: AClass from test.mjs:  [class AClass]
packages/app-c test: AClass from test.js:  [class AClass]
```
