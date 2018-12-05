import { Slim } from '/.showroom-app/Slim.js';
import '/.showroom-app/directives/repeat.js';

Slim.tag('showroom-component-list',
/*html*/`
<style>
  @import url("/assets/main.css");
  :host {
    display: block;
    cursor: default;
    margin-bottom: 0.8rem;
    margin-right: 1rem;
    border-bottom: 1px solid var(--accent-color);
    border-image: var(--awesome-border);
    border-image-slice: 1;
    padding-bottom: 0.5rem;
  }

  
</style>
<details open>
  <summary>{{section.name}}</summary>
  <ul>
    <li s:repeat="section as item" bind:data-component-name="item.component">
      <span click="onComponentClick">{{getAlias(item)}}</span>
      <button class="topcoat-button--large btn-sm" bind:style="getButtonStyle(item)" click="onDocsClick">DOCS</button>
    </li>
  </ul>
</details>
`, class extends Slim {

  getAlias (module) {
    return module.alias || module.component;
  } 

  getButtonStyle (item) {
    if (item.description || item.descriptionURL) {
      return ''
    } else {
      return 'display: none';
    }
  }

  get useShadow () { return true; }

  onComponentClick (e) {
    const item = e.target.item;
    this.callAttribute('on-select', item);
  }

  onDocsClick (e) {
    const item = e.target.item;
    if (item.descriptionURL) {
      window.open(item.descriptionURL, '_blank');
    } else {
      this.callAttribute('on-docs', item.description);
    }
  }

})