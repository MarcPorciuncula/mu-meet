const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
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
    app: './src/app.js',
  },
  devtool: '#source-map',
  output: {
    path: paths.dist,
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js',
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
      '@': paths.src,
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
      // Transpile .vue component files
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // Define loaders for the style section of .vue component files
          loaders: {
            // Use ExtractTextPlugin to pull all css into a single css file
            css: ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true,
                    sourceMap: true,
                  },
                },
              ],
              fallback: 'vue-style-loader',
            }),
            // Use ExtractTextPlugin to pull all compiles scss into a single css file
            scss: ExtractTextPlugin.extract({
              use: [
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
                    includePaths: [paths.node_modules + '/'],
                    sourceMap: true,
                  },
                },
              ],
              fallback: 'vue-style-loader',
            }),
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
      // Extract css imports into a single css file
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
              },
            },
          ],
          fallback: 'vue-style-loader',
        }),
      },
      // Extract compiled scss into a single css file
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
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
          fallback: 'vue-style-loader',
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    // Minify (es2015+ aware)
    new BabelMinifyPlugin({}),
    // Extract all css into file
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash].css',
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
      canPrint: false,
    }),
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
    // Split vendor JS into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // any required modules inside node_modules are extracted to vendor
      minChunks: (module, count) =>
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(paths.node_modules) === 0,
    }),
    // Extract Webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    // Copy static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
  ],
};
