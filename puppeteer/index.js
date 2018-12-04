const testUtils = require('../test-utils');
const showroomServer = require('../app/server');
const puppeteer = require('puppeteer');
const { assign } = Object;

/**
 * @type ShowroomInitOptions
 * @param {number} [port = 3001]
 * @property {boolean} [silent = true]
 * @property {boolean} [headless = true]
 * @property {string} [path = process.cwd()] Application's root path, defaults to process cwd
 */


/* @type ShowroomInitOptions */
const defaultOptions = {
  port: 3001,
  silent: true,
  headless: true,
  path: process.cwd()
}

class Showroom {

  /**
   * 
   * @param {ShowroomInitOptions} options 
   */
  constructor (options) {
    this.options = assign({}, defaultOptions, options);
    this.page = null;
    this.browser = null;
  }

  async start () {
    const { port, path, silent, headless} = this.options;
    const baseUrl = `http://127.0.0.1:${port}`;
    showroomServer.bootstrap({
      port,
      path,
      silent
    });
    this.browser = await puppeteer.launch({
      baseUrl,
      headless
    });
    this.page = await this.browser.newPage();
    let status = 0;
    let retries = 10;
    while (!status) {
      if (retries < 0) {
        throw new Error('Error connecting to showroom server');
      }
      try {
        await this.page.goto(baseUrl, {
          waitUntil: 'networkidle0'
        });
        status = 'OK';
      }
      catch (err) {
        await this.page.waitFor(150);
        retries--;
      }
    }
    this.utils = await testUtils(this.page);

    // API borrowing
    this.getAttribute = this.utils.getAttribute.bind(this.utils);
    this.setTestSubject = this.utils.setTestSubject.bind(this.utils);
    this.test = this.utils.setTestSubject.bind(this.utils); // alias
    this.setAttribute = this.utils.setAttribute.bind(this.utils);
    this.hasAttribute = this.utils.hasAttribute.bind(this.utils);
    this.find = this.utils.find.bind(this.utils);
    this.clearEventList = this.utils.clearEventList.bind(this.utils);
    this.getEventList = this.utils.getEventList.bind(this.utils);
    this.getTextContent = this.utils.getTextContent.bind(this.utils);
    this.isVisible = this.utils.isVisible.bind(this.utils);
    this.getProperty = this.utils.getProperty.bind(this.utils);
    this.setProperty = this.utils.setProperty.bind(this.utils);
    this.trigger = this.utils.trigger.bind(this.utils);

    return this;
  }

  async stop () {
    await this.browser.close();
    await showroomServer.server().close();
  }
}

module.exports = options => new Showroom(options);