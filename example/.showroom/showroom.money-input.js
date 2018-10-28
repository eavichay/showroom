export default {
  component: 'money-input',
  section: 'Vanilla',
  path: '/money-input.js',
  events: ['change'],

  // customized element
  extends: 'input',
  attributes: {
    currency: 'USD'
  },
  outerHTML: '<h3>class MoneyInput extends HTMLInputElement</h3><showroom-mount-point></showroom-mount-point>'
}