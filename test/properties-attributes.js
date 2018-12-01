const assert = require('assert');

describe('showroom::setProperty', () => {

  const component = 'demo-component-avengers';
  let root;

  const findControlNodeValue = async (type, name) => {
    const node = await showroom.find(`// component-dashboard // #dashboard custom-control-form // [data-target-${type}="${name}"]`, root);
    return await showroom.getProperty('value', node);
  }

  beforeEach(async () => {
    await showroom.setTestSubject(component);
    root = await page.$('showroom-app');
    await page.waitFor(300);
  });

  it('Should set property via UI', async () => {
    const input = await showroom.find('// component-dashboard // #dashboard custom-control-form // input[data-target-property="title"]', root);
    await input.click({clickCount: 2});
    await input.type('New Title');
    await page.keyboard.press('Enter');
    const titleElement = await showroom.find('// h3');
    assert.equal(await showroom.getProperty('innerText', titleElement), 'New Title');
  });

  it('Should set attribute via UI', async () => {
    const input = await showroom.find('// component-dashboard // #dashboard custom-control-form // input[data-target-attribute="text-color"]', root);
    await input.click({clickCount: 2});
    await input.type('blue');
    await page.keyboard.press('Enter');
    assert.equal(await showroom.getAttribute('text-color'), 'blue');
  });

  describe('UI Sync when values change via showroom-puppeteer integration', async () => {
    beforeEach(async () => {
      await showroom.setTestSubject(component);
      root = await page.$('showroom-app');
      await page.waitFor(300);
    });

    it('Should update text', async () => {
      await showroom.setProperty('title', 'New Title');
      const text = await findControlNodeValue('property', 'title');
      assert.equal(text, 'New Title');
    });

    it('Should update from array', async () => {
      await showroom.setProperty('mission', 'Save the world');
      assert.equal(await findControlNodeValue('property', 'mission'), 'Save the world');
      await showroom.setProperty('mission', 'Shut down Hydra');
      assert.equal(await findControlNodeValue('property', 'mission'), 'Shut down Hydra');
    });

    it('Should sync attribute', async () => {
      await showroom.setAttribute('accent-color', 'grey');
      assert.equal(await findControlNodeValue('attribute', 'accent-color'), 'grey');
    });
  });

});