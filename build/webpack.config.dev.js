const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { pick, compose, evolve } = require('ramda');

// Expose certain environment variables to the bundle
const env = compose(
  evolve({
    NODE_ENV: JSON.stringify,
    GOOGLE_ANALYTICS_ID: JSON.stringify,
    BUILD_ID: JSON.stringify,
    SENTRY_DSN: JSON.stringify,
  }),
  pick(['NODE_ENV', 'GOOGLE_ANALYTICS_ID', 'BUILD_ID', 'SENTRY_DSN', 'META'])
)(process.env);

const paths = {
  node_modules: path.resolve(__dirname, '../node_modules'),
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src'),
};

module.exports = {
  entry: {
    app: ['./build/dev-client', './src/app.js'],
  },
  devtool: '#cheap-module-eval-source-map',
  output: {
    path: paths.dist,
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // Use the runtime-only build of Vue, which excludes the template compiler.
      // This means we can't use Vue template strings, but .vue component files are
      // compiled ahead of time. Outside .vue files, we must use render functions.
      vue$: 'vue/dist/vue.runtime.esm.js',
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
        include: [paths.src],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      // Transpile .vue files
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [
              { loader: 'vue-style-loader' },
              {
                loader: 'css-loader',
                options: {
                  minimize: false,
                  sourceMap: true,
                },
              },
            ],
            scss: [
              { loader: 'vue-style-loader' },
              {
                loader: 'css-loader',
                options: {
                  minimize: false,
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  // Allow sass files to @import from node_modules
                  includePaths: [paths.node_modules],
                  sourceMap: true,
                },
              },
            ],
          },
        },
      },
      // Transpile JavaScript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [paths.src],
      },
      // Allow importing of image assets
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      // Allow importing of font assets
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        },
      },
      // Allow importing of css files
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true,
            },
          },
        ],
      },
      // Allow importing of scss files
      {
        test: /\.scss$/,
        use: [
          { loader: 'vue-style-loader' },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            },
          },
          {
            loader: `sass-loader`,
            options: {
              // Allow sass files to @import from node_modules
              includePaths: [paths.node_modules],
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(paths.dist, '/index.html'),
      // Attach some data to the templating context so index.html can use it to render
      meta: JSON.parse(env.META),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    new FriendlyErrorsPlugin(),
  ],
};
