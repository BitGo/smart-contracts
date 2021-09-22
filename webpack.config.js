const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { resolve } = require('path');

const common = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

const serverConfig = {
  ...common,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};

const clientConfig = {
  ...common,
  target: 'web',
  resolve: {
    ...common.resolve,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      asert: require.resolve('assert'),
      querystring: require.resolve('querystring-es3'),
      fs: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js',
    libraryTarget: 'umd',
  },
};

module.exports = [serverConfig, clientConfig];
