import '../demo-component.js';

export default {
  section: 'hello',
  description: `
# Markdown text
\`\`\`javascript
console.log('hello');
\`\`\`
- a list
- more items
*ephasized* text
  `,
  component: 'other-component',
  path: '../demo-component.js',
  events: ['someevent', 'click'],
  properties: {
    myName: 'Default myName',
    someObject: {
      prop1: 'Default prop1',
      prop2: 12345
    },
    someArray: [123123, 21321321, 3232131232],
    someSet: new Set(['option1', 'option2', 'option3'])
  },
  attributes: {
    'bg-color': 'red',
    'fg-color': null,
  }
}