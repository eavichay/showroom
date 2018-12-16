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
        @import url("/assets/main.css");
        :host {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          flex-grow: 1;
          background: white;
          overflow-y: hidden;
        }

        :host([center]) #renderer-container {
          display: flex;
          justify-content: center;
          align-items: center;
          display: flex;
        }

        #renderer-container {
          display: block;
          height: 100%;
          padding: 2rem;
          overflow: auto;
        }

        #dashboard {
          /*idth: fit-content;*/
          display: inline-flex;
          flex-direction: column;
          overflow-y: auto;
          flex-basis: 64%;
          border-right: var(--double-border);
          padding: 0 1rem 3rem 1rem;
        }

        #wrapper {
          border-top: var(--double-border);
          display: flex;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          flex-direction: row;
          height: 22rem;
          transform: translate3d(0, 0, 0);
          transition: 0.25s ease-in-out transform;
          background-color: var(--default-bg);
        }

        :host([collapsed]) #wrapper {
          transform: translate3d(0, 22rem, 0);
        }

        #eventLogWrapper {
          padding: 0 1rem 0 1rem;
          display: block;
          overflow-y: scroll;
          flex-direction: column;
          flex-basis: 36%;
        }

        #eventLog {
          display: inline-flex;
          flex-direction: column-reverse;
          overflow: visible;
        }

        :host([collapsed]) #toggle {
          top: -2.5rem;
          height: 3rem;
          width: 3rem;
          left: Calc(50% - 1rem);
        }

        #toggle {
          transition: 250ms ease-in-out all;
          z-index: 1;
          width: 6rem;
          position: absolute;
          left: calc(50% - 2rem);
          top: -0.9rem;
          line-height: 1.5rem;
          font-weight: bold;
          font-family: initial;
        }

        #clear-events {
          position: absolute;
          right: 0.5rem;
          top: 0.5rem;
        }

        .event-data {
          font-family: "Fira Mono", monospace;
          font-size: 0.8rem;
          font-weight: normal;
          color: var(--dark-text);
          padding-left: 1rem;
        }
      </style>
      <div id="renderer-container">
      </div>
      <div id="wrapper">
        <button id="toggle" class="topcoat-button--large">↕</button>
        <div id="dashboard"></div>
        <div id="eventLogWrapper">
          <h3>Events</h3>
          <button id="clear-events" class="topcoat-button--large">Clear</button>
          <div id="eventLog">
        </div>
        </div>
      </div>
      <span id="footer"></span>
    `;
    this.footer = this._.getElementById('footer');
    this.rendererContainer = this._.getElementById('renderer-container');
    this.dashboard = this._.getElementById('dashboard');
    this.eventLog = this._.getElementById('eventLog');
    this.toggle = this._.getElementById('toggle');
    const clearButton = this._.getElementById('clear-events');
    this.toggle.onclick = () => {
      if (this.hasAttribute('collapsed')) {
        this.removeAttribute('collapsed');
      } else {
        this.setAttribute('collapsed', '');
      }
    }
    this.dashboard.classList.add('container');
    clearButton.onclick = () => this.clearEvents();
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
    if (target.$SHOWROOM_META_ATTACHED) {
      return;
    }
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
              <pre class="event-data">${stringified}</pre>
            </details>
          `
          this.eventLog.appendChild(banner);
          this.eventLog.logged.push(event);
        });
      });
    }
    target.$SHOWROOM_META_ATTACHED = true;
  }

  clearEvents () {
    this.eventLog.innerHTML = '';
    this.eventLog.logged = [];
  }

  autoResizeTextArea (el) {
    el.onkeydown = () => {
      requestAnimationFrame( () => {
        el.style.cssText = 'min-height:' + el.scrollHeight + 'px';
        el.scrollIntoView({block: 'end', behavior: 'smooth'});
      });
    };
    el.style.cssText = 'min-height:' + el.scrollHeight + 'px';
  }

  addInnerHTMLForm (innerHTML) {
    if (innerHTML) {
      const editor = document.createElement('textarea');
      editor.classList.add('topcoat-textarea');
      const label = document.createElement('h3')
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
      editor.classList.add('topcoat-textarea');
      const label = document.createElement('h3')
      label.innerText = 'Wrapping HTML';
      const innerLabel = document.createElement('span');
      innerLabel.innerHTML = '<br/>(use the &lt;showroom-mount-point&gt; node to position the custom component)';
      innerLabel.style.cssText = 'font-size: 0.8rem; font-weight: normal; padding-left: 1rem;';
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
    console.log('Loading component: ' + module.component);
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