const { resolve } = require('path');

const webpack = require('webpack');

module.exports = (env) => {

  return {
    context: resolve('src'),
    entry: {
      app: './cube.coffee'
    },
    output: {
      filename: 'bundle.js',
      path: resolve('dist'),
      // Include comments with information about the modules.
      pathinfo: true,
    },

    resolve: {
        extensions: [
            '.js',
            '.coffee'
        ]
    },

    devtool: 'cheap-module-source-map',

    module: {
        rules: [
          {
            test: /\.coffee$/,
            use: [ 'coffee-loader' ]
          },
          {
            test: /\.txt$/,
            use: 'raw-loader'
          }
        ]
      }
  }
};