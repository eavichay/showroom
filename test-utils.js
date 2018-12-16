// @ts-check

const validator = require('html-validator');

/**
 * @typedef SerializedRemoteEvent
 * @property {string} type
 * @property {any} detail
 */


/**
 * @ignore @typedef {import('puppeteer').ElementHandle} ElementHandle
 */

/**
 * @ignore @typedef {import('puppeteer').JSHandle} JStHandle
 */

/**
 * @ignore @typedef {import('puppeteer').Page} Page
 */


/**
 * @private
 * @param {Page} page 
 * @param {string} path 
 * @param {ElementHandle} container 
 */
const find = async (page, path, container) => {
  const result = await page.evaluateHandle((path, container) => {
    // @ts-ignore
    return window.queryDeepSelector(path, container);
  }, path, container);
  return result;
};

/**
 * @class TestUtils
 * @property {ElementHandle} targetComponent
 * @property {Page} page
 */
class TestUtils {

  /**
   * @param {string} path deeq query selector formatted path
   * @param {ElementHandle} container 
   */
  async find (path, container = this.targetComponent) {
    return await find(this.page, path.trim(), container);
  }

  /**
   * Initializes the showroom test-utils with a puppeteer page instance
   * @param {Page} page 
   */
  async initialize (page) {
    this.page = page;
    await page.evaluate(() => {
      // @ts-ignore
      if (!window.queryDeepSelector) {
        /**
         * @param {string} selectorStr 
         * @param {any} container 
         */
        const queryDeepSelector = (selectorStr, container = document) => {
          const selectorArr = selectorStr.replace(new RegExp('//', 'g'), '%split%//%split%').split('%split%');
          for (const index in selectorArr) {
            const selector = selectorArr[index].trim();

            if (!selector) continue;

            if (selector === '//') {
              container = container.shadowRoot;
            } else if (selector === 'document') {
              container = document;
            }
            else {
              container = container.querySelector(selector);
            }
            if (!container) break;
          }
          return container;
        };
        window['queryDeepSelector'] = queryDeepSelector;
      }
    });
    return page;
  }

  /**
   * clears the collected events in the browser
   */
  async clearEventList () {
    await this.page.evaluate(() => {
      // @ts-ignore
      dashboard.clearEvents();
    });
  }

  /**
   * Selects a component to be tested
   * @param {string} componentName 
   * @returns ElementHandle
   */
  async setTestSubject (componentName) {
    this.testSubjectName = componentName;
    let lastTargetComponent = this.targetComponent;
    while (lastTargetComponent === this.targetComponent) {
      // @ts-ignore
      lastTargetComponent = await this.page.evaluate((async (componentName) => {
        await showroom.ready;
        await showroom.setTestSubject(componentName)
      }), componentName);
      this.targetComponent = await this.testSubject();
    }
    return this.targetComponent;
  }

  /**
   * @return ElementHandle
   */
  async testSubject () {
    /**
     * @type ElementHandle
     */
    // @ts-ignore
    const handle = await this.page.evaluateHandle(() => {
      // @ts-ignore
      return dashboard.targetComponent;
    });
    return handle;
  }

  /**
   * @returns Promise<Array<SerializedRemoteEvent>>
   */
  async getEventList () {
    return await (await this.page.evaluate(async () => {
      // @ts-ignore
      await showroom.ready;
      return window.dashboard.events.map(({type, detail, bubbles}) => {
        return {
          type,
          detail,
          bubbles
        };
      });
    }));
  }

  /**
   * @returns SerializedRemoteEvent
   */
  async getLastEvent () {
    return this.page.evaluate(() => {
      // @ts-ignore
      const { type, detail, bubbles } = window.dashboard.lastEvent;
      return { type, detail, bubbles };
    });
  }

  /**
   * Tests HTML validity of a remote element
   * @param {ElementHandle} target HTML as string
   * @throws {Error} When validation fails
   */
  async validateHTML (target) { 
    /**
     * @type ElementHandle
     */
    const resolvedTarget = target || this.targetComponent;
    const html = await this.getProperty('innerHTML', resolvedTarget);
    await validator({
      format: 'text',
      data: html
    });
  }

  /**
   * Returns the value of a property on the remote target
   * @param {string} property 
   * @param {ElementHandle} [target] defaults to current tested component
   * @returns any|JSHandle
   */
  async getProperty (property, target) {
    const resolvedTarget = target || this.targetComponent;
    return await (await this.page.evaluate((target, prop) => {
      return target[prop];
    }, resolvedTarget, property));
  }

  /**
   * Sets a property on a remote target
   * @param {string} property 
   * @param {any} value 
   * @param {ElementHandle} [target] defaults to current tested component
   */
  async setProperty (property, value, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, prop, value) => {
      // @ts-ignore
      showroom.setProperty(prop, value);
    }, resolvedTarget, property, value);
  }

  async setAttribute (name, value, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, name, value) => {
      // @ts-ignore
      showroom.setAttribute(name, value);
    }, resolvedTarget, name, value);
    return resolvedTarget;
  }

  /**
   * Returns value of a remote element's attribute
   * @param {string} name
   * @param {ElementHandle} target 
   * @returns Promise<string>
   */
  async getAttribute (name, target) {
    const resolvedTarget = target || this.targetComponent;
    /**
     * @type string
     */
    const result = await(await this.page.evaluate((target, name) => {
      return target.getAttribute(name);
    }, resolvedTarget, name));
    return result;
  }

  /**
   * @param {string} name 
   * @param {ElementHandle} target 
   * @returns Promise<boolean>
   */
  async hasAttribute (name, target) {
      const resolvedTarget = target || this.targetComponent;
      /**
       * @type boolean
       */
      const result = await(await this.page.evaluate((target, name) => {
          return target.hasAttribute(name);
      }, resolvedTarget, name));
      return result;
  }

  /**
   * @param {string} name 
   * @param {ElementHandle} target 
   */
  async removeAttribute (name, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, name) => {
      target.removeAttribute(name);
    }, resolvedTarget, name);
    return resolvedTarget;
  }

  /**
   * 
   * @param {ElementHandle} target 
   * @returns boolean;
   */
  async isVisible (target) {
      const resolvedTarget = target || this.targetComponent;
    
      /**
       * @type boolean
       */
      const isIntersectingViewport = await resolvedTarget.isIntersectingViewport();
      /**
       * @type boolean
       */
      const isNotHidden = await this.page.evaluate(async (target) => {
          const style = getComputedStyle(target);
          return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }, resolvedTarget);
      return isIntersectingViewport && isNotHidden;
  }

  /**
   * 
   * @param {ElementHandle} target 
   * @returns Promise<string>
   */
  async getTextContent(target) {
      const resolvedTarget = target || this.targetComponent;
      await this.page.evaluate(async (target) => target, resolvedTarget);

      const textContent = await resolvedTarget.getProperty('textContent');
      /**
       * @type Promise<string>
       */
      const asText = textContent.jsonValue();
      return asText;
  }

  /**
   * Executes predefined function on a showroom descriptor file for the current tested component
   * @param {string} fnName 
   */
  async trigger (fnName) {
    await this.page.evaluate((fnName) => {
      // @ts-ignore
      dashboard.trigger(fnName);
    }, fnName);
  }
}

/**
 * @param {Page} page
 * @returns TestUtils
 */
module.exports = async function createUtils(page) {
  if (!page) {
    throw new Error('Page object is mandatory');
  }
  const testUtils = new TestUtils();
  await testUtils.initialize(page);
  return testUtils;
}

module.exports.TestUtils = TestUtils;
