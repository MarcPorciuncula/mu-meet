const puppeteer = require('puppeteer');
const serve = require('serve');
const a = require('awaiting');
const ora = require('ora');
const fs = require('fs-extra');
const chalk = require('chalk');
const config = require('../config');


const PORT = 8080;

async function prerender() {
  const spinner = ora('prerendering index.html...');
  spinner.start();
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const server = serve(config.build.assetsRoot, {
    port: PORT,
    silent: true,
  });

  try {
    await a.delay(2000); // Give the serve some time to boot
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`);
    await a.delay(2000);
    const content = await page.content();
    await fs.outputFile(config.build.index, content);
  } finally {
    browser.close();
    server.stop();
    spinner.stop();
  }

  console.log(chalk.blue('Prerendered index.html'));
}

prerender().catch(err => {
  console.error(err);
  process.exit(1);
})
