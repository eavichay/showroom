import '../demo-user-card.js';
const DemoUserCard = customElements.get('demo-user-card');

export default {
  component: 'demo-user-card',
  section: 'Lit-Element',
  path: './demo-user-card.js',
  events: ['data-loaded'],
  autoAttributes: true,
  autoProperties: true,
  attributes: {
    'user-id': Math.floor(Math.random() * 10000).toString(),
    'accent-color': '#FFFFEE'
  }
}