const fs = require('fs-extra');
const express = require('express');
const path = require('path');
const ChromeRender = require('chrome-render');
const ora = require('ora');

const PORT = process.env.PRERENDER_PORT || 3000;

module.exports = async () => {
  const app = express();
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use('/_wrapper', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  let server = app.listen(PORT, async () => {
    const spinner = ora('Prerendering page in chrome...');
    spinner.start();

    const chrome = await ChromeRender.new({});
    try {
      const html = await chrome.render({ url: `http://localhost:${PORT}/_wrapper` })

      await fs.writeFile(path.join(__dirname, '../dist/index.html'), html);
    } finally {
      spinner.stop();
      await chrome.destroyRender();
      server.close();
    }
    console.log('  Prerender written to dist/index.html\n');
  });
}
