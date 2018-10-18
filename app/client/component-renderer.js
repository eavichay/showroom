export default class ComponentRenderer extends HTMLElement {

  constructor (outerHTML = '<showroom-mount-point></showroom-mount-point>') {
    super();
    this.attachShadow({mode: 'open'});
    this._ = this.shadowRoot;
    this._.innerHTML = /*html*/`
      <style>
      :host {
        font-family: initial;
        font-size: initial;
      }
      </style>
      <div id="fallback"></div>
      ${outerHTML}
    `;
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
    
    const mountpoint = this._.querySelector('showroom-mount-point') || this._.querySelector('#fallback');
    mountpoint.outerHTML = `<${name.nodeValue}></${name.nodeValue}>`;
    this.component = this._.querySelector(name.nodeValue);
    window.showroomGlobalStyles.forEach(styleNode => {
      this._.appendChild(styleNode);
    });
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