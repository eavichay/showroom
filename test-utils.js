const find = async (page, path, container) => {
  const result = await page.evaluateHandle((path, container) => {
    return window.queryDeepSelector(path, container);
  }, path, container);
  return result;
};

class TestUtils {

  async find (path, container = this.targetComponent) {
    return await find(this.page, path.trim(), container);
  }

  async initialize (page) {
    this.page = page;
    await page.evaluate(() => {
      if (!window.queryDeepSelector) {
        window.queryDeepSelector = (selectorStr, container = document) => {
          const selectorArr = selectorStr.replace(new RegExp('//', 'g'), '%split%//%split%').split('%split%');
          for (const index in selectorArr) {
            const selector = selectorArr[index].trim();

            if (!selector) continue;

            if (selector === '//') {
              container = container.shadowRoot;
            }
            else {
              container = container.querySelector(selector);
            }
            if (!container) break;
          }
          return container;
        };
      }
    });
    return page;
  }

  async clearEventList () {
    const clearEventButton = await find(this.page, 'component-dashboard // input[value="Clear"]');
    await clearEventButton.click();
  }

  async setTestSubject (componentName) {
    this.testSubjectName = componentName;
    let lastTargetComponent = this.targetComponent;
    while (lastTargetComponent === this.targetComponent) {
      const span = await find(this.page, `showroom-component-list li[data-component-name="${componentName}"] > span`);
      await span.click();
      this.targetComponent = await this.testSubject();
    }
    return this.targetComponent;
  }

  async testSubject () {
    const handle = await this.page.evaluateHandle(() => {
      window.dashboard.events = [];
      return window.dashboard.targetComponent;
    });
    return handle;
  }

  async getEventList () {
    return await (await this.page.evaluate(() => {
      return window.dashboard.events.map(({type, detail, bubbles}) => {
        return {
          type,
          detail,
          bubbles
        };
      });
    }));
  }

  async getLastEvent () {
    return this.page.evaluate(() => {
      return window.dashboard.lastEvent;
    });
  }

  async getProperty (property, target) {
    const resolvedTarget = target || this.targetComponent;
    return await (await this.page.evaluate((target, prop) => {
      return target[prop];
    }, resolvedTarget, property));
  }

  async setProperty (property, value, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, prop, value) => {
      target[prop] = value;
    }, resolvedTarget, property, value);
    return resolvedTarget;
  }

  async setAttribute (name, value, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, name, value) => {
      target.setAttribute(name, value);
    }, resolvedTarget, name, value);
    return resolvedTarget;
  }

  async getAttribute (name, target) {
    const resolvedTarget = target || this.targetComponent;
    return await(await this.page.evaluate((target, name) => {
      return target.getAttribute(name);
    }, resolvedTarget, name));
  }

  async hasAttribute (name, target) {
      const resolvedTarget = target || this.targetComponent;
      return await(await this.page.evaluate((target, name) => {
          return target.hasAttribute(name);
      }, resolvedTarget, name));
  }

  async removeAttribute (name, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, name) => {
      target.removeAttribute(name);
    }, resolvedTarget, name);
    return resolvedTarget;
  }

  async isVisible (target) {
      const resolvedTarget = target || this.targetComponent;
    
      const isIntersectingViewport = await resolvedTarget.isIntersectingViewport();
      const isNotHidden = await this.page.evaluate(async (target) => {
          const style = getComputedStyle(target);
          return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }, resolvedTarget);
      return isIntersectingViewport && isNotHidden;
  }

  async getTextContent(target) {
      const resolvedTarget = target || this.targetComponent;
      await this.page.evaluate(async (target) => target, resolvedTarget);

      const textContent = await resolvedTarget.getProperty('textContent');
      return textContent.jsonValue();
  }

  async trigger (fnName) {
    await this.page.evaluate((fnName) => {
      dashboard.trigger(fnName);
    }, fnName);
  }
}

/**
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
