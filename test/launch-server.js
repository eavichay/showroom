const path = require('path');
const showroomServer = require('../app/server');
const puppeteer = require('puppeteer');
const showroomFactory = require('../puppeteer/index.js');

global.opts = {
  baseUrl: 'http://127.0.0.1:3001',
  headless: process.env.NODE_ENV !== 'development'
}

global.puppeteer = puppeteer;
global.noWatch = true;

before(async () => {
  const showroom = showroomFactory({
    port: 3001,
    silent: true,
    path: path.join(__dirname, '../example'),
    headless: global.opts.headless
  });
  await showroom.start();
  
  global.browser = showroom.browser;
  global.page = showroom.page;
  global.showroom = showroom.utils;
  global.showroomInstance = showroom;
})

after(async () => {
  await showroomInstance.stop();
})