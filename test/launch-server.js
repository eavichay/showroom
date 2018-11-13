const path = require('path');
const showroomServer = require('../app/server');
const puppeteer = require('puppeteer');
const showroomApp = require('../test-utils');

global.opts = {
  baseUrl: 'http://127.0.0.1:3001',
  headless: process.env.NODE_ENV !== 'development'
}

global.puppeteer = puppeteer;
global.noWatch = true;

before(async () => {
  showroomServer.bootstrap({
    port: 3001,
    path: path.join(__dirname, '../example'),
    silent: true
  });
  global.browser = await global.puppeteer.launch(global.opts);
  const page = await browser.newPage();
  global.page = page;
  let status = 0;
  let retries = 10;
  while (!status) {
    if (retries < 0) {
      throw new Error('Error connecting to showroom server');
    }
    try {
      await page.goto(global.opts.baseUrl, {
        waitUntil: 'networkidle0'
      });
      status = 'OK';
    }
    catch (err) {
      await page.waitFor(150);
      retries--;
    }
  }
  global.showroom = await showroomApp(page);
})

after(async () => {
  await global.browser.close();
  await showroomServer.server().close();
})