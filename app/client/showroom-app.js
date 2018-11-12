import { Slim } from '/.showroom-app/Slim.js';

import './component-description.js';
import './showroom-component-list.js';
import './component-dashboard.js';

export const createError = err => `
# _Oops_, Error.

> The error can be either in the component descriptor file or the component runtime.
> Perhaps the browser console can provide additional information.

---

### Type
**${err.name}: ${err.message}**

### Stack
${err.stack}

### Module
\`\`\`json
${JSON.stringify(currentModule, null, 2)}
\`\`\``;

Slim.tag('showroom-app', class extends Slim {

  constructor () {
    super();
    window.addEventListener('hashchange', this.loadComponentByHash.bind(this));
  }

  loadComponentByHash () {
    this.sections.forEach(section => {
      section.forEach((module) => {
        if (`#${module.component}` === window.location.hash && this.currentModule !== module) {
          this.onComponentSelected(module);
        }
      })
    });
  }

  get template () {
    return /*html*/`
    <component-description s:id="descriptionView"></component-description>
    <h1 id="big-title">Showroom <span id="component-name"></span></h1>
    <div class="hbox">
      <div id="component-list">
        <h6>Component List</h6>
        <showroom-component-list
          s:repeat="sections as section"
          on-docs="onComponentDocs"
          on-select="onComponentSelected"
          ></showroom-component-list>
      </div>
      <div id="main-view">
          <component-dashboard s:id="dashboard"></component-dashboard>
      </div>
    </div>
    `;
  }

  onComponentSelected (data) {
    window.location.hash = data.component;
    this.currentModule = data;
    this.dashboard.setupComponent(data);
  }

  onComponentDocs (description) {
    this.descriptionView.setContent(description);
  }

  async loadComponents () {
    try {
      const sections = {};
      const components = await (await fetch('/.showroom-app/showroom-components')).json();
      for (let filename of components) {
        const module = (await import('/.showroom/' + filename)).default;
        const { path, section }  = module;
  
        if (path) {
          await import(path);
        }
  
        const targetSection = section || 'general';
  
        sections[targetSection] = sections[targetSection] || [];
        sections[targetSection].push(module);
        sections[targetSection].name = targetSection;
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