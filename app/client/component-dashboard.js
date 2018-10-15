import './component-renderer.js';
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
          overflow: scroll;
        }

        #wrapper {
          border-top: 1px solid black;
          display: inline-flex;
          flex-direction: row;
          max-height: 50rem;
        }

        #eventLog {
          position: relative;
          overflow: scroll;
          display: inline-flex;
          flex-direction: column-reverse;
          justify-content: flex-end;
          flex-grow: 1;
        }

        #eventLog input[type="button"] {
          position: absolute;
          right: 0;
          top: 0;
        }
      </style>
      <div id="renderer-container">
        <component-renderer id="renderer"></component-renderer>
      </div>
      <div id="wrapper">
        <div id="dashboard"></div>
        <div id="eventLog"></div>
      </div>
    `;
    this.renderer = this._.getElementById('renderer');
    this.dashboard = this._.getElementById('dashboard');
    this.eventLog = this._.getElementById('eventLog');
  }

  get component () {
    return this.renderer.component;
  }

  addDescription (descriptionText) {
    const descriptionElement = this._.querySelector('#description') || document.createElement('atricle', {id: 'description'});
    this.dashboard.appendChild(descriptionElement);
    descriptionElement.innerHTML = marked(descriptionText);
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
      this.eventLog.appendChild(clearButton);
      clearButton.onclick = () => {
        while (this.eventLog.childElementCount > 1) {
          this.eventLog.removeChild(this.eventLog.lastElementChild);
        }
      }
    }
  }

  async loadComponent (modulePath) {
    const module = await import(modulePath);
    const { component, description, section, properties, attributes, events } = module.default;
    this.dashboard.innerHTML = '';
    this.renderer.setAttribute('name', component);
    this.addDescription(description);
    this.addCustomForm({properties, attributes});
    this.targetComponent = this.renderer.component;
    this.attachEvents(this.targetComponent, events);
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