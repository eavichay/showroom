customElements.define('demo-component', class extends HTMLElement {

  render () {
    this.innerHTML = `
    <div>Hello ${this.myName}</div>
    <hr/>
    <div>SubProp->prop1: ${this.someObject.prop1}</div>
    <div>SubProp->prop2: ${this.someObject.prop2}</div>
    <div>SomeSet: ${this.someSet}</div>
    <div>SomeArray: ${this.someArray.join(', ')}</div>
    <button>someevent</button>
    `;
    this.style.position = 'relative';
    this.style.display = 'inline-block';
    this.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('someevent', {
        detail: {
          data: 1,
          data2: 'abcd',
          nested: {
            demo: 'object',
            arr: [1,2,3,4,5]
          }
        }
      }));
    });
  }

  static get observedAttributes () {
    return ['bg-color', 'fg-color'];
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    requestAnimationFrame( () => {
      this.style.color = this.getAttribute('fg-color');
      this.style.backgroundColor = this.getAttribute('bg-color');
    });
  }

  connectedCallback () {
    this._someObject = this._someObject || {};
    this._someArray = this._someArray || [];
    ['myName', 'someObject', 'someSet', 'someArray'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        set: (v) => {
          this['_' + prop] = v;
          this.render();
        },
        get: () => {
          return this['_' + prop];
        }
      })
    })
    this.render();
  }

});