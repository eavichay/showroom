// @ts-check

const testUtils = require('../test-utils');
const showroomServer = require('../app/server');
const puppeteer = require('puppeteer');
const { assign } = Object;

/**
 * @exports Showroom
 */

/**
 * @typedef ShowroomInitOptions
 * @property {boolean} [silent = true]
 * @property {boolean} [headless = true]
 * @property {string} [path = process.cwd()] Application's root path, defaults to process cwd
 */

 /**
  * @exports {import('puppeteer').JSHandle} JSHandle
  * @exports {import('puppeteer').ElementHandle} ElementHandle
  * @exports {import('puppeteer').Page} Page
  */


/* @type ShowroomInitOptions */
const defaultOptions = {
  port: 3001,
  silent: true,
  headless: true,
  path: process.cwd()
}

const { TestUtils } = testUtils;

/**
 * @class Showroom
 * @extends TestUtils
 * @method {function(path:string, container?:JSHandle):JSHandle} find
 */
class Showroom {

  /**
   * @param {ShowroomInitOptions} options 
   */
  // @ts-ignore
  constructor (options) {
    // @ts-ignore
    this.options = assign({}, defaultOptions, options);
    // @ts-ignore
    this.page = null;
    // @ts-ignore
    this.browser = null;
  }

  /**
   * Starts the showroom server and launches puppeteer browser
   * @returns Showroom
   */
  async start () {
    const { port, path, silent, headless} = this.options;
    const baseUrl = `http://127.0.0.1:${port}`;
    showroomServer.bootstrap({
      port,
      path,
      silent
    });
    this.browser = await puppeteer.launch({
      headless
    });
    this.page = await this.browser.newPage();

    /**
     * @type number|string
     */
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
    this.validateHTML = this.utils.validateHTML.bind(this.utils);

    return this;
  }

  /**
   * Stops the showroom server and closes the puppeteer browser.
   */
  async stop () {
    await this.browser.close();
    await showroomServer.server().close();
  }
}

/**
 * @returns Showroom
 */
module.exports = options => new Showroom(options);
module.exports.Showroom = Showroom;