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
  
  li[is-selected="true"]::before {
    display: inline;
    position: absolute;
    content: '>';
  }
  
  li[is-selected="true"] > span {
    left: 1rem;
    position: relative;
  }

  
</style>
<details open>
  <summary>{{section.name}}</summary>
  <ul>
    <li s:repeat="section as item" bind:data-component-name="item.component" bind:is-selected="isSelected(currentComponent, item)">
      <span click="onComponentClick">{{getAlias(item)}}</span>
      <button class="topcoat-button--large btn-sm" bind:style="getButtonStyle(item)" click="onDocsClick">DOCS</button>
    </li>
  </ul>
</details>
`, class extends Slim {

  constructor () {
    super();
    this.currentComponent = '';
    window.router.addEventListener('change', ({detail}) => {
      this.currentComponent = detail;
      this.commit('currentComponent');
    });
  }

  onRender () {
    setTimeout( () => {
      this.currentComponent = window.router.component;
      this.commit('currentComponent');
    });
  }

  isSelected (current, item) {
    return current === item.component;
  }

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
    window.location.hash = item.component;
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