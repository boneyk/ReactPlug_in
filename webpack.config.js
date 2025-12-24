/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
// const dotenv = require('dotenv');
const path = require('path');
const devServerConfig = require('./settings/webpack/devServer');
const loadersConfig = require('./settings/webpack/loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const version = fs.readFileSync(path.resolve(__dirname, './build/build-tag'));
const mode = process?.env?.NODE_ENV || 'development';
// const env = dotenv.config().parsed; может быть полезен в devServer и plugins

const isDev = mode == 'development';

// todo: вынести по аналогии с devServer
const outputSettings = {
  path: path.resolve(__dirname, 'build'),
  filename: `${version}/[name].js`,
  // chunks?
  chunkFilename: `${version}/[name].[contenthash].chunk.js`
};

module.exports = {
  entry: { index: './src/index' },
  mode,
  cache: true,
  devtool: 'source-map',
  output: outputSettings,
  target: 'web',
  devServer: devServerConfig(),
  //   optimization:
  // todo: вынести по аналогии с devServer
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'public', 'favicon.svg'),
      logo: path.resolve(__dirname, 'public', 'logo.svg'),
      envsPath: '/',
      filename: './index.html',
      inject: true,
      base: '/'
    })
  ],
  module: { rules: loadersConfig(isDev) },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
};
