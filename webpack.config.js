var webpack = require('webpack');
var path = require('path');

var config = {}

config.context = __dirname + '/src';

config.entry = './index.js';

config.output = {
  path: __dirname,
  publicPath: 'http://localhost:8080/build',
  filename: 'index.js'
};

config.devServer = {
  contentBase: __dirname,
  publicPath: 'http://localhost:8080/build'
};

config.resolve = {
  moduleDirectories: ['node_modules'],

  // alias: {
  //
  // }

  root: [
    __dirname
  ],

  extensions: ['', '.js']
};

config.module = {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets:[ 'es2015', 'react', 'stage-1' ]
      }
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=1024'
    },
    {
      test: /\.ttf$/,
      loader: 'file-loader?name=fonts/[name].[ext]?[hash]'
    },
    {
      test: /\.svg$/,
      loader: 'svg-inline',
      query: {
        removeTags: true,
        removingTags: ['title', 'desc'],
        removeSVGTagAttrs: false
      }
    },
    {
      test: /\.(less|css)$/,
      loader: "style!css!less"
    },
  ]
};

config.plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = config;
