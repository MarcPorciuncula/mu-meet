const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var vueLoaderConfig = require('./vue-loader.conf');
const { pick } = require('ramda');

const env = pick(
  ['NODE_ENV', 'GOOGLE_ANALYTICS_ID', 'BUILD_ID', 'SENTRY_DSN', 'META'],
  process.env
);

console.log(JSON.parse(env.META));

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
        include: [paths.src],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      // Transpile .vue files
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        // options: {
        //   loaders: {
        //     css: ExtractTextPlugin.extract({
        //       use: [
        //         {
        //           loader: 'css-loader',
        //           options: {
        //             minimize: true,
        //             sourceMap: true,
        //           },
        //         },
        //       ],
        //       fallback: 'vue-style-loader',
        //     }),
        //     scss: ExtractTextPlugin.extract({
        //       use: [
        //         {
        //           loader: 'css-loader',
        //           options: {
        //             minimize: true,
        //             sourceMap: true,
        //           },
        //         },
        //         {
        //           loader: `sass-loader`,
        //           options: {
        //             // Allow sass files to @import from node_modules
        //             includePaths: [paths.node_modules + '/'],
        //             sourceMap: true,
        //           },
        //         },
        //       ],
        //       fallback: 'vue-style-loader',
        //     }),
        //   },
        // },
      },
      // Transpile JavaScript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        },
      },
      // Extract CSS imports into CSS file
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
    // Extract CSS into file
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
      meta: JSON.parse(env.META),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(paths.node_modules) === 0
        );
      },
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
  ],
};
