import './component-renderer.js';
import './showroom-json-editor.js';
import { CustomControlForm } from './custom-control-form.js';


const stringify = (event) => JSON.stringify(Object.assign({
    detail: event.detail,
    type: event.type
  }, event), null, 2);

export default class ComponentDashboard extends HTMLElement {

  constructor () {
    super();
    this._ = this.attachShadow({mode: 'open'});
    this.render();
    window.dashboard = this;
  }

  render () {
    this._.innerHTML = /*html*/`
      <style>
        @import url("/milligram.min.css");
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
          position: relative;
        }

        #renderer-container {
          display: inline-flex;
          flex-grow: 1;
        }

        #dashboard {
          border-right: 1px solid black;
          width: fit-content;
          display: inline-flex;
          flex-direction: column;
          flex-basis: 45%;
          overflow-y: scroll;
        }

        :host([collapsed]) #wrapper {
          max-height: 0rem;
        }

        #wrapper {
          border-top: 1px solid black;
          display: inline-flex;
          flex-direction: row;
          max-height: 50rem;
          position: relative;
          transition: 1250ms ease-in-out max-height;
        }

        #eventLogWrapper {
          position: relative;
          display: block;
          flex-grow: 1;
          overflow-y: scroll;
          top: 0;
          bottom: 0;
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

        #toggle {
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
      </style>
      <div id="renderer-container">
        <component-renderer id="renderer"></component-renderer>
      </div>
      <div id="wrapper">
        <button id="toggle">↕</button>
        <div id="dashboard"></div>
        <div id="eventLogWrapper">
          <div id="eventLog">
        </div>
        </div>
      </div>
    `;
    this.renderer = this._.getElementById('renderer');
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
  }

  get component () {
    return this.renderer.component;
  }

  addCustomForm (formData) {
    this.dashboard.innerHTML = null;
    const targetComponent = this.renderer.component;
    this.dashboard.appendChild(new CustomControlForm(targetComponent, formData));
  }

  attachEvents (target, eventList) {
    if (eventList) {
      eventList.forEach(eventName => {
        target.addEventListener(eventName, (event) => {
          console.info(event);
          const banner = document.createElement('div');
          banner.classList.add('banner');
          banner.innerHTML = `
            <details>
              <summary>Event: ${eventName}</summary>
              <pre>${stringify(event)}</pre>
            </details>
          `
          this.eventLog.appendChild(banner);
        });
      });
      const clearButton = document.createElement('input');
      clearButton.type = 'button';
      clearButton.value = 'Clear';
      clearButton.classList.add('btn', 'btn-sm');
      this._.querySelector('#eventLogWrapper').appendChild(clearButton);
      clearButton.onclick = () => {
        this.eventLog.innerHTML = '';
      }
    }
  }

  addInnerHTMLForm (innerHTML) {
    if (innerHTML) {
      const editor = document.createElement('textarea');
      const label = document.createElement('h3')
      label.innerText = 'Inner HTML';
      this.dashboard.appendChild(label);
      this.dashboard.appendChild(editor);
      editor.value = innerHTML;
      editor.onblur = editor.onchange = () => {
        this.targetComponent.innerHTML = editor.value;
      };
      editor.onblur();
    }
  }

  setupComponent (module) {
    const { component, properties, attributes, events, innerHTML } = module;
    this.dashboard.innerHTML = '';
    this.renderer.setAttribute('name', component);
    this.targetComponent = this.renderer.component;
    this.addCustomForm({properties, attributes});
    this.addInnerHTMLForm(innerHTML);
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