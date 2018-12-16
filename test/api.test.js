const assert = require('assert');

/**
 * @typedef {import('../puppeteer').Showroom} Showroom
 */

describe('API', () => {

  /**
   * @type Showroom
   */
  let showroom;

  beforeEach( () => {
    /**
     * @type Showroom
     */
    showroom = showroomInstance;
  });
  

  it('Should invoke methods', async () => {
    await showroom.test('money-input');
    await showroom.trigger('clear');
    const value = await showroom.getProperty('value');
    assert(value === 'USD 0');
  });

  it('setProperty/getProperty', async () => {
    await showroom.test('demo-component-avengers');
    await showroom.setProperty('title', 'Hello');
    const actual = await showroom.getProperty('title');
    assert.equal(actual, 'Hello');
  });

  it('setAttribute/getAttribute/hasAttribute', async () => {
    await showroom.test('money-input');
    await showroom.setAttribute('abc', 'abc');
    assert(await showroom.hasAttribute('abc') === true);
    assert(await showroom.getAttribute('abc') === 'abc');
  });

  it('find', async () => {
    await showroom.test('demo-component-avengers');
    await showroom.setProperty('title', 'Hello');
    const titleEl = await showroom.find('// h3');
    const titleText = await showroom.getTextContent(titleEl);
    assert(titleText === 'Hello', `Expecting title text to be "Hello", instead got ${titleText}`);
  });

  it('component selection', async function () {
    this.retries(3);
    await showroom.test('money-input');
    await showroom.page.waitFor(350);
    const menuItem = await showroom.page.evaluateHandle(() => queryDeepSelector('showroom-app // #component-list  showroom-component-list[section-name="Vanilla" // li[data-component-name="money-input"]'));
    await menuItem.click();
    const selectedMenuItem = await showroom.page.evaluateHandle(() => queryDeepSelector('showroom-app // #component-list  showroom-component-list[section-name="Vanilla" // li[is-selected="true"]'));
    const component = await showroom.getAttribute('data-component-name', selectedMenuItem);
    assert(component === 'money-input');
  });

  it('clearEventList/getEventList', async function () {
    this.retries(3);
    await showroom.test('demo-component-avengers');
    await showroom.setProperty('data', {});
    const eventsBeforeClear = await showroom.getEventList();
    await showroom.clearEventList();
    await showroom.page.waitFor(100);
    const eventsAfterClear = await showroom.getEventList();
    assert(eventsBeforeClear.length === 1);
    assert(eventsAfterClear.length === 0);
  });

  it('isVisible', async () => {
    const component = await showroom.test('money-input');
    await showroom.utils.page.evaluate((target) => target.style.visibility = 'hidden', component);
    assert(await showroom.isVisible() === false);
    await showroom.utils.page.evaluate((target) => target.style.visibility = null, component);
    assert(await showroom.isVisible() === true);
  });

});