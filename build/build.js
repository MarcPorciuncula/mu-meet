require('dotenv').load({ path: require('path').resolve(__dirname, '../.env') });
process.env.NODE_ENV = 'production';

const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('./webpack.config.prod');

const spinner = ora(`building for production...`);
spinner.start();

Promise.resolve()
  .then(() => fs.remove(path.join(__dirname, '../dist/static')))
  .then(
    () =>
      new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
          if (err) reject(err);
          else resolve(stats);
        });
      })
  )
  .then(stats => {
    spinner.stop();
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      }) + '\n\n'
    );

    if (stats.hasErrors()) {
      console.log('  Build finished with errors.');
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );

    return fs.outputFile(
      path.join(__dirname, 'stats.json'),
      JSON.stringify(stats.toJson())
    );
  })
  .then(() => {
    console.log(chalk.cyan('  Build stats saved to stats.json\n'));
  })
  .catch(err => {
    spinner.stop();
    console.error(err);
    process.exit(1);
  });
