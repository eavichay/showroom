export class CustomControlForm extends HTMLElement {

  constructor (targetComponent, formData) {
    super();
    this.targetComponent = targetComponent;
    this.formData = formData || {};
    this._ = this.attachShadow({mode: 'open'});
    this.triggers = {};
    this.watchers = [];
    this._.innerHTML = /*html*/`
      <style>
        @import url("/assets/main.css");
        input[type='email'], input[type='number'], input[type='password'], input[type='search'], input[type='tel'], input[type='text'], input[type='url'], button, textarea, select {
          width: auto;
          margin: 0;
        }
        input[type], textarea, select {
          background-color: white;
        }
        label {
          display: inline;
          font-weight: normal;
        }
        div.input-control {
          min-height: 2.3rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          color: var(--dark-text);
        }
        h3 {
          padding-bottom: 1rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--accent-color);
          border-image: var(--awesome-border-heading);
          border-image-slice: 1;
        }
      </style>
    `;
    requestAnimationFrame(this.buildForm.bind(this));
  }

  buildForm () {
    this.watchers.forEach( watcher => watcher() );
    this.watchers = [];
    const { targetComponent, formData } = this;
    const { properties, attributes, functions } = formData;
    if (properties) {
      const h = document.createElement('h3');
      h.innerText = 'Properties';
      this._.appendChild(h);
      Object.keys(properties).forEach(prop => {
        const type = properties[prop];
        const wrapper = document.createElement('div');
        wrapper.classList.add('input-control');
        let input = document.createElement('input');
        switch (true) {
          case typeof type === 'number': 
            input.setAttribute('type', 'number');
            input.setAttribute('value', type);
            break;
          case typeof type === 'string':
            input.setAttribute('value', type);
            input.setAttribute('type', 'text');
            break;
          case typeof type === 'boolean':
            input = document.createElement('input');
            input.setAttribute('type', 'button');
            input.classList.add('topcoat-button--large');
            input.value = properties[prop];
            input.onclick = () => {
              showroom.setProperty(prop, !showroom.getProperty(prop));
            };
            break;
          case type instanceof Set:
            input = document.createElement('select');
            Array.from(type).forEach((item) => {
              const option = document.createElement('option');
              option.label = item.label || item;
              option.value = item.value || item;
              input.appendChild(option);
            });

            type.value = type.values().next().value;
            break;
          default:
            input = document.createElement('input');
            input.setAttribute('type', 'button');
            input.setAttribute('data-type', 'object');
            input.classList.add('topcoat-button');
            input.value = 'Edit ' + type.constructor.name;
            input.onclick = () => {
              this.dispatchEvent(new CustomEvent('open-json-editor',
              {
                bubbles: true,
                composed: true,
                detail: {
                  data: targetComponent[prop],
                  callback: (value) => {
                    this.targetComponent[prop] = value;
                  }
                }
              }));
            }
        }
        input.setAttribute('data-target-property', prop);
        const label = document.createElement('label');
        if (input.getAttribute('type') !== 'button') {
          input.classList.add('topcoat-text-input');
        }
        label.innerText = prop;
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        this._.appendChild(wrapper);
        this.targetComponent[prop] = type.value || type;
        if (input.getAttribute('data-type') !== 'object') {
          this.watchers.push(showroom.on('property-changed', ({detail}) => {
            if (detail.prop === prop) {
              input.value = this.targetComponent[prop].toString();
            }
          }));
        }
        input.addEventListener('change', (evt) => {
          const type = input.getAttribute('type');
          if (type === 'number') {
            showroom.setProperty(prop, parseFloat(input.value));
          } else {
            showroom.setProperty(prop, input.value);
          }
        })
      })
    }
    if (attributes) {
      const h = document.createElement('h3');
      h.innerText = 'Attributes';
      this._.appendChild(h);
      Object.keys(attributes).forEach((attr) => {
        const value = attributes[attr];
        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('data-target-attribute', attr);
        input.classList.add('topcoat-text-input');
        input.value = value;
        const label = document.createElement('label');
        label.innerText = attr;
        const wrapper = document.createElement('div');
        wrapper.classList.add('input-control');
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        this._.appendChild(wrapper);
        if (value) {
          targetComponent.setAttribute(attr, value);
        }
        input.addEventListener('change', () => {
          if (input.value) {
            targetComponent.setAttribute(attr, input.value);
          } else {
            targetComponent.removeAttribute(attr);
          }
        });
        this.watchers.push(showroom.on('attribute-changed', ({detail}) => {
          if (detail.attr === attr) {
            input.value = detail.value.toString();
          }
        }));
      });
    }
    if (functions) {
      const h = document.createElement('h3');
      h.innerText = 'Functions';
      this._.appendChild(h);
      Object.keys(functions).forEach(fnName => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('input-control');
        const btn = document.createElement('button');
        btn.classList.add('topcoat-button--large');
        const label = document.createElement('label');
        label.innerText = fnName;
        btn.innerText = 'Invoke';
        wrapper.appendChild(label);
        wrapper.appendChild(btn);
        this._.appendChild(wrapper);
        this.triggers[fnName] = () => {
          functions[fnName]();
        };
        window.showroom.triggers = this.triggers;
        btn.onclick = this.triggers[fnName];
      });
    }
  }

}

customElements.define('custom-control-form', CustomControlForm);