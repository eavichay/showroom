import { Slim } from '/.showroom-app/Slim.js';

import './component-description.js';
import './showroom-component-list.js';
import './component-dashboard.js';

export const createError = (err, module, filename) => `
# _Oops_, Error.

> The error can be either in the component descriptor file or the component runtime.
> Perhaps the browser console can provide additional information.

---

### Type
**${err.name}: ${err.message}**

${filename ? `
### File
${filename}
` : ''}

### Stack
${err.stack}
`;

Slim.tag('showroom-app', class extends Slim {

  constructor () {
    super();
    window.addEventListener('hashchange', this.loadComponentByHash.bind(this));
  }

  loadComponentByHash () {
    this.sections && this.sections.forEach(section => {
      section.forEach((module) => {
        if (`#${module.component}` === window.location.hash && this.currentModule !== module) {
          this.onComponentSelected(module);
        }
      })
    });
  }

  get useShadow () { return true; }

  get template () {
    return /*html*/`
    <style>
      @import url("/assets/normalize.css");
      @import url("/assets/main.css");
      :host {
        font-size: 16px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }

      #component-list {
        padding-left: 0.5rem;
        border-right: var(--double-border);
        box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.4);
        z-index: 1;
        min-width: 18rem;
      }

      #big-title {
        margin: 0;
        padding: 0.5rem;
        padding-left: 1rem;
        letter-spacing: 0.3rem;
        font-weight: normal;
        font-size: 1rem;
        cursor: default;
        background-color: var(--accent-color);
        color: var(--lighter-text);
        box-shadow: 0px 1px 3px 2px rgba(0, 0, 0, 0.4);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        z-index: 2;
        font-family: 'Forum', Georgia, 'Times New Roman', Times, serif;
      }

      component-dashboard {
        flex-grow: 1;
      }
    </style>
    <component-description s:id="descriptionView"></component-description>
    <h1 id="big-title">SHOWROOM</h1>
    <div class="hbox grow">
      <div id="component-list">
        <h3>Components</h3>
        <showroom-component-list
          s:repeat="sections as section"
          on-docs="onComponentDocs"
          on-select="onComponentSelected"
          ></showroom-component-list>
      </div>
      <component-dashboard s:id="dashboard"></component-dashboard>
    </div>
    `;
  }

  onComponentSelected (data) {
    window.location.hash = data.component;
    this.currentModule = data;
    this.dashboard.setupComponent(data);
    window.showroom.component = this.dashboard.targetComponent;
  }

  onComponentDocs (description) {
    this.descriptionView.setContent(description);
  }

  async loadComponents () {
    let module;
    try {
      const sections = {};
      const components = await (await fetch('/.showroom-app/showroom-components')).json();
      for (let filename of components) {
        try {
          module = (await import('/.showroom/' + filename)).default;
          const { path, section }  = module;
    
          if (path) {
            await import(path);
          }
    
          const targetSection = section || 'general';
    
          sections[targetSection] = sections[targetSection] || [];
          sections[targetSection].push(module);
          sections[targetSection].name = targetSection;
        }
        catch (err) {
          console.error('Could not load module ' + filename);
          console.warn('Got error: ', err);
          this.descriptionView.setContent(createError(err, module, filename));
          return;
        }
      }
  
      this.sections = Object.keys(sections).map(section => {
        return sections[section];
      });

      this.loadComponentByHash();

    } catch (err) {
      this.descriptionView.setContent(createError(err));
    }
  }

});