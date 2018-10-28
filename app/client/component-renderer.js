export default class ComponentRenderer extends HTMLElement {

  constructor (
      outerHTML = '<showroom-mount-point></showroom-mount-point>',
      attributes = {},
      isExtending) {
    super();
    this.extending = isExtending;
    this.targetAttributes = attributes;
    this.attachShadow({mode: 'open'});
    this._ = this.shadowRoot;
    this._.innerHTML = /*html*/`
      <style>
      :host {
        font-family: initial;
        font-size: initial;
        width: 100%;
        height: 100%;
      }
      </style>
      <div id="fallback"></div>
      ${outerHTML}
    `;

    this.fallbackContainer = this._.querySelector('#fallback');
  }

  static get observedAttributes () {
    return ['url', 'name'];
  }

  attributeChangedCallback() {
    this.render();
  }

  createElement (name, extending) {
    let result;
    if (extending) {
      result = document.createElement(extending, {
        is: name
      });
      result.setAttribute('is', name);
    } else {
      result = document.createElement(name);
    }
    return result;
  }

  async render () {
    const {url, name } = this.attributes;

    if (url) await import(url);
    
    const mountpoint = this._.querySelector('showroom-mount-point') || this.fallbackContainer;
    if (mountpoint !== this.fallbackContainer) {
      this.fallbackContainer.remove();
    }
    const range = document.createRange();
    range.selectNode(mountpoint);
    range.deleteContents();
    this.component = this.createElement(name.nodeValue, this.extending);
    Object.keys(this.targetAttributes).forEach(attr => {
      const value = this.targetAttributes[attr];
      if (typeof value === 'boolean' && value) {
        this.component.setAttribute(attr, '');
      } else if (typeof value !== 'boolean') {
        this.component.setAttribute(attr, this.targetAttributes[attr]);
      }
    });
    // mountpoint.outerHTML = `<${name.nodeValue} ${attributesString}></${name.nodeValue}>`;
    range.insertNode(this.component);
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