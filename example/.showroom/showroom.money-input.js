export default {
  component: 'money-input',
  section: 'Vanilla',
  path: '/money-input.js',
  events: ['change'],

  // customized element
  extends: 'input',
  centered: true,
  attributes: {
    currency: 'USD'
  },
  outerHTML: `
    <div style="text-align: center">
      <h3>class MoneyInput extends HTMLInputElement</h3>
      <showroom-mount-point></showroom-mount-point>
    </div>`
}