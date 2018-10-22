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
          debugger;
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

  async setTestSubject (componentName) {
    this.testSubjectName = componentName;
    const span = await this.find(`showroom-component-list li[data-component-name="${componentName}"] > span`);
    try {
      await span.click();
    }
    catch (err) {}
    const component = await this.testSubject();
    this.targetComponent = component;
    return component;
  }

  async testSubject () {
    const handle = await this.page.evaluateHandle(() => {
      return window.dashboard.targetComponent;
    });
    return handle;
  }

  async getProperty (property, target) {
    const resolvedTarget = target || this.targetComponent;
    return await this.page.evaluate((target, prop) => {
      debugger;
      return target[prop];
    }, resolvedTarget, property);
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
    return await this.page.evaluate((target, name) => {
      return target.getAttribute(name);
    }, resolvedTarget, name);
  }

  async removeAttribute (name, target) {
    const resolvedTarget = target || this.targetComponent;
    await this.page.evaluate((target, name) => {
      target.removeAttribute(name);
    }, resolvedTarget, name);
    return resolvedTarget;
  }
}

module.exports = async function createUtils(page) {
  if (!page) {
    throw new Error('Page object is mandatory');
  }
  const testUtils = new TestUtils();
  await testUtils.initialize(page);
  return testUtils;
}