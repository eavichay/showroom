export default class ComponentRenderer extends HTMLElement {

  constructor () {
    super();
    this.attachShadow({mode: 'open'});
    this._ = this.shadowRoot;
  }

  static get observedAttributes () {
    return ['url', 'name'];
  }

  attributeChangedCallback() {
    this.render();
  }

  async render () {
    const {url, name } = this.attributes;

    if (url) await import(url);
    this._.innerHTML = `
      <${name.nodeValue}></${name.nodeValue}>
      <style>
      :host {
        font-family: initial;
        font-size: initial;
      }
    </style>
    `
    this.component = this._.firstElementChild;
  }

  setComponentAttribute(attr, value) {
    const component = this.firstElementChild;
    if (component) {
      component.setAttribute(attr, value);
    }
  }

  setComponentProperty(prop, value) {
    const component = this._.firstElementChild;
    if (component) {
      component[prop] = value;
    }
  }

}

customElements.define('component-renderer', ComponentRenderer);