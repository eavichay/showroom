const assert = require('assert');

describe('showroom::setProperty', () => {

  const component = 'demo-component-avengers';
  let root;

  beforeEach(async () => {
    await showroom.setTestSubject(component);
    root = await page.$('showroom-app');
    await page.waitFor(300);
  });

  it('Should set property via UI', async () => {
    const input = await showroom.find('component-dashboard // #dashboard custom-control-form // input[data-target-property="title"]', root);
    await input.click({clickCount: 2});
    await input.type('New Title');
    await page.keyboard.press('Enter');
    const titleElement = await showroom.find('// h3');
    assert.equal(await showroom.getProperty('innerText', titleElement), 'New Title');
  });

  it('Should set attribute via UI', async () => {
    const input = await showroom.find('component-dashboard // #dashboard custom-control-form // input[data-target-attribute="text-color"]', root);
    await input.click({clickCount: 2});
    await input.type('blue');
    await page.keyboard.press('Enter');
    assert.equal(await showroom.getAttribute('text-color'), 'blue');
  });

});