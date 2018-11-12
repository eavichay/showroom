import { Slim } from '/.showroom-app/Slim.js';
import '/.showroom-app/directives/repeat.js';

Slim.tag('showroom-component-list',
/*html*/`
<details open>
  <summary>{{section.name}}</summary>
  <ul>
    <li s:repeat="section as item" bind:data-component-name="item.component">
      <span click="onComponentClick">{{item.component}}</span>
      <button class="btn btn-sm" bind:style="getButtonStyle(item)" click="onDocsClick">DOCS</button>
    </li>
  </ul>
</details>
`, class extends Slim {

  getButtonStyle (item) {
    if (item.description || item.descriptionURL) {
      return ''
    } else {
      return 'display: none';
    }
  }

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