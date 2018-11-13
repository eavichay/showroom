const assert = require('assert');

describe('Showroom site loading', async () => {

  it('Should display title', async () => {
    const app = await page.$('showroom-app');
    assert(app, 'Expecting showroom app to be on page');
    assert(app._remoteObject.type === 'object');
  });
});