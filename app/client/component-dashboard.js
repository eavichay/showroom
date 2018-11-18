import ComponentRenderer from './component-renderer.js';
import './showroom-json-editor.js';
import { CustomControlForm } from './custom-control-form.js';


const stringify = (event) => {
  const cloned = Object.assign({
    detail: event.detail,
    type: event.type
  }, event);
  delete cloned.isTrusted;
  return JSON.stringify(cloned, null, 2);
};

export default class ComponentDashboard extends HTMLElement {

  constructor () {
    super();
    this._ = this.attachShadow({mode: 'open'});
    this.render();
    window.dashboard = this;
  }

  trigger (fnName) {
    if (fnName && this.customControlForm) {
      this.customControlForm.triggers[fnName]();
    }
  }

  get lastEvent () {
    return this.events[this.events.length - 1];
  }

  get events () {
    try {
      return this.eventLog.logged || []
    }
    catch (err) {
      return [];
    }
  }

  render () {
    this._.innerHTML = /*html*/`
      <style>
        @import url("/.showroom-app/milligram.min.css");
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
          position: relative;
        }

        h6 {
          font-weight: bold;
        }

        textarea, select {
          background-color: white;
        }

        textarea {
          overflow: hidden;
        }

        :host([center]) #renderer-container {
          justify-content: center;
          align-items: center;
        }

        #renderer-container {
          display: inline-flex;
          flex-grow: 1;
          padding: 2rem;
          border-bottom: 3px double lightgrey;
          background-color: white;
          overflow: auto;
        }

        #dashboard {
          border-right: 3px double lightgrey;
          width: fit-content;
          display: inline-flex;
          flex-direction: column;
          flex-basis: 62%;
          overflow-y: scroll;
          padding-top: 2rem;
          max-width: 75rem;
        }

        :host([collapsed]) #wrapper {
          height: 0rem;
        }

        #wrapper {
          display: inline-flex;
          flex-direction: row;
          position: relative;
          transition: 250ms ease-in-out height;
          height: 35rem;
        }

        #eventLogWrapper {
          position: relative;
          display: block;
          flex-grow: 1;
          overflow-y: scroll;
          padding-top: 2rem;
        }

        #eventLog {
          display: inline-flex;
          flex-direction: column-reverse;
          overflow: visible;
        }

        #eventLogWrapper input[type="button"] {
          position: absolute;
          right: 0.5rem;
          top: 0.5rem;
        }

        :host([collapsed]) #toggle {
          top: -2.5rem;
          height: 3rem;
        }

        #toggle {
          transition: 250ms ease-in-out all;
          font-size: 1.2rem;
          z-index: 1;
          height: 2rem;
          width: 8rem;
          position: absolute;
          left: calc(50% - 3rem);
          top: -1rem;
          padding: 0;
          line-height: 1rem;
        }

        custom-control-form {
          margin-bottom: 3rem;
        }
      </style>
      <div id="renderer-container">
      </div>
      <div id="wrapper">
        <button id="toggle">↕</button>
        <div id="dashboard"></div>
        <div id="eventLogWrapper">
          <h6>Events</h6>
          <div id="eventLog">
        </div>
        </div>
      </div>
    `;
    this.rendererContainer = this._.getElementById('renderer-container');
    this.dashboard = this._.getElementById('dashboard');
    this.eventLog = this._.getElementById('eventLog');
    this.toggle = this._.getElementById('toggle');
    this.toggle.onclick = () => {
      if (this.hasAttribute('collapsed')) {
        this.removeAttribute('collapsed');
      } else {
        this.setAttribute('collapsed', '');
      }
    }
    this.dashboard.classList.add('container');
  }

  get component () {
    return this.renderer.component;
  }

  addCustomForm (formData) {
    this.dashboard.innerHTML = null;
    const targetComponent = this.renderer.component;
    this.customControlForm = new CustomControlForm(targetComponent, formData)
    this.dashboard.appendChild(this.customControlForm);
  }

  attachEvents (target, eventList) {
    this.eventLog.logged = [];
    if (eventList) {
      eventList.forEach(eventName => {
        target.addEventListener(eventName, (event) => {
          console.info(event);
          const stringified = stringify(event);
          const banner = document.createElement('div');
          banner.classList.add('banner');
          banner.innerHTML = `
            <details>
              <summary>Event: ${eventName}</summary>
              <pre>${stringified}</pre>
            </details>
          `
          this.eventLog.appendChild(banner);
          this.eventLog.logged.push(event);
        });
      });
      const clearButton = document.createElement('input');
      clearButton.type = 'button';
      clearButton.value = 'Clear';
      clearButton.classList.add('btn', 'btn-sm');
      this._.querySelector('#eventLogWrapper').appendChild(clearButton);
      clearButton.onclick = () => this.clearEvents();
    }
  }

  clearEvents () {
    this.eventLog.innerHTML = '';
    this.eventLog.logged = [];
  }

  autoResizeTextArea (el) {
    el.onkeydown = () => {
      el.style.cssText = 'min-height:auto';
      requestAnimationFrame( () => {
        el.style.cssText = 'min-height:' + el.scrollHeight + 'px';
      });
    };
    el.onkeydown();
  }

  addInnerHTMLForm (innerHTML) {
    if (innerHTML) {
      const editor = document.createElement('textarea');
      const label = document.createElement('h6')
      label.innerText = 'Inner HTML';
      this.dashboard.appendChild(label);
      this.dashboard.appendChild(editor);
      editor.value = innerHTML.trim();
      editor.onchange = () => {
        this.targetComponent.innerHTML = editor.value;
      };
      this.targetComponent.innerHTML = editor.value;
      this.autoResizeTextArea(editor);
    }
  }

  addOuterHTMLForm (outerHTML) {
    if (outerHTML) {
      const editor = document.createElement('textarea');
      const label = document.createElement('h6')
      label.innerText = 'Wrapping HTML';
      const innerLabel = document.createElement('span');
      innerLabel.innerText = '(use the <showroom-mount-point> node to position the custom component)';
      innerLabel.style.cssText = 'font-size: 1.2rem; font-weight: normal; padding-left: 1rem;';
      label.appendChild(innerLabel);
      this.dashboard.appendChild(label);
      this.dashboard.appendChild(editor);
      editor.value = outerHTML.trim();
      editor.onchange = () => {
        this.setupComponent(Object.assign({}, this.componentModule, {
          outerHTML: editor.value
        }));
      };
      this.autoResizeTextArea(editor);
    }
  }

  setupComponent (module) {
    this.componentModule = module;
    const { functions, component, properties, attributes, events, innerHTML, outerHTML, centered, extends : isExtending } = module;
    if (centered) {
      this.setAttribute('center', '');
    } else {
      this.removeAttribute('center');
    }
    this.dashboard.innerHTML = '';
    if (this.renderer) {
      this.renderer.remove();
    }
    this.clearEvents();
    this.renderer = new ComponentRenderer(outerHTML, attributes, isExtending);
    this.renderer.setAttribute('name', component);
    this.rendererContainer.appendChild(this.renderer);
    if (this.targetComponent === this.renderer.component) {
      throw new Error('Something bad happened');
    }
    this.targetComponent = this.renderer.component;
    this.addCustomForm({properties, attributes, functions});
    this.addInnerHTMLForm(innerHTML);
    this.addOuterHTMLForm(outerHTML);
    requestAnimationFrame( () => {
      this.attachEvents(this.targetComponent, events);
    });
    
  }

  async loadComponent (modulePath) {
    const module = await import(modulePath);
    this.setupComponent(module.default);
  }

  static get observedAttributes () {
    return ['descriptor'];
  }

  attributeChangedCallback () {
    const path = this.getAttribute('descriptor');
    this.loadComponent(path);
  }

}

customElements.define('component-dashboard', ComponentDashboard);