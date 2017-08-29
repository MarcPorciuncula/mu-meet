require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var fs = require('fs-extra');
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var a = require('awaiting');

async function build() {
  let spinner = ora(`building for production...`);
  spinner.start();

  try {
    // Clean out old assets
    await fs.remove(path.join(config.build.assetsRoot, config.build.assetsSubDirectory));

    // Build webpack
    const stats = await a.callback(webpack, webpackConfig);
    spinner.stop();

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

    // Save build stats for bundle analysis
    await fs.outputFile(path.join(__dirname, 'stats.json'), JSON.stringify(stats.toJson()));
    console.log(chalk.cyan('  Build stats saved to stats.json\n'));

  } catch (err) {
    spinner.stop();
    throw err;
  }
}

build().catch(err => {
  console.error(err)
  process.exit(1);
});
