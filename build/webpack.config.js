const path = require('path');

const dev = false;

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      // The root of the src folder can be accessed via '@/'
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      // Fail on eslint errors
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      // Transpile .vue files
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: [
            { loader: 'vue-style-loader' },
            {
              loader: 'css-loader',
              options: {
                minimize: dev,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                // Allow sass files to @import from node_modules
                includePaths: [path.resolve(__dirname, '../node_modules')],
                sourceMap: true,
              },
            },
          ],
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')],
      },
    ],
  },
};
