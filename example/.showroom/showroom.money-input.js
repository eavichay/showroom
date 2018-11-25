export default {
  component: 'money-input',
  section: 'Vanilla',
  path: '/money-input.js',
  events: ['change'],
  description: '# Vanilla customized element',

  // customized element
  extends: 'input',
  centered: true,
  attributes: {
    currency: 'USD'
  },
  properties: {
    disabled: false
  },
  functions: {
    clear: () => {
      showroom.component.clear()
    }
  },
  outerHTML: `
    <div style="text-align: center">
      <h3>class MoneyInput extends HTMLInputElement</h3>
      <showroom-mount-point></showroom-mount-point>
    </div>`
}