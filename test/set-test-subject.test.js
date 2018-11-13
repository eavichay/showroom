const assert = require('assert');

describe('showroom::setTestSubject', () => {
  [
    'demo-component-avengers',
    'split-me',
    'timer-component',
    'demo-user-card'
  ].forEach(componentName => {
    it('Component: ' + componentName, async () => {
      await showroom.setTestSubject(componentName);
      assert(await showroom.getProperty('localName') === componentName);
    });
  })
});