export default {
  component: 'money-input',
  section: 'Vanilla',
  path: '/demo/money-input.js',
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
    </div>`,

  description: `
# Demo-Money-Input
## Library: None (vanilla)

This is a class extending HTMLInputElement, showroom supports [customized built-in elements](https://developers.google.com/web/fundamentals/web-components/customelements).

[Source](/demo/money-input.js)
  `
}