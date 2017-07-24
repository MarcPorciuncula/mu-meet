require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var fs = require('fs-extra');
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora(`building for production...`)
spinner.start()

Promise.resolve()
  .then(() => fs.remove(path.join(config.build.assetsRoot, config.build.assetsSubDirectory)))
  .then(() => new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    })
  }))
  .then((stats) => {
    spinner.stop()
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log('  Build finished with errors.');
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    return fs.outputFile(path.join(__dirname, 'stats.json'), JSON.stringify(stats.toJson()));
  })
  .then(() => {
    console.log(chalk.cyan('  Build stats saved to stats.json\n'));
  })
  .catch(err => {
    spinner.stop();
    console.error(err);
    process.exit(1);
  });
