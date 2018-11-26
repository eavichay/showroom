const template = /*html*/`
<style>
  @import url("/assets/main.css");
  :host {
    display: inline-flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    width: 300px;
    background: #eeeeee;
    border-left: 3px double #aaaaaa;
    z-index: 1;
    transition: 250ms ease-in-out right;
    padding: 0.5rem;
    padding-left: 2.5rem;
  }

  :host([collapsed]) {
    right: -300px;
  }

  :host([collapsed]) #toggle {
    left: -20px;
  }

  #toggle {
    transition: 250ms ease-in-out all;
    z-index: 1;
    width: 2rem;
    height: 8rem;
    position: absolute;
    left: -10px;
    top: 50%;
    padding: 0;
    line-height: 1rem;
  }

  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .info hr {
    flex-basis: 100%;
  }

  .info-name {

  }

  .info-value {
    font-weight: bold;
  }
</style>

<button id="toggle" click="toggle">↔</button>

<h3 s:if="cAttributes.length">Attributes</h3>
<div s:repeat="cAttributes as attr" class="info">
  <span class="info-name">{{attr.name}}</span><span class="info-value">{{attr.value}}</span>
  <hr/>
</div>

<h3 s:if="cProps.length">Properties</h3>
<div s:repeat="cProps as prop" class="info">
  <span class="info-name">{{prop.name}}</span><span class="info-value">{{prop.value}}</span>
  <hr/>
</div>
`;

Slim.tag('component-info-panel',
template,
class extends Slim {

  constructor () {
    super();
    this.cAttributes = [];
    this.cProps = [];
    window.addEventListener('click', this.update.bind(this));
  }

  connectedCallback () {
    this.setAttribute('collapsed', '');
  }

  get useShadow() { return true; }

  toggle() {
    this.toggleAttribute('collapsed');
  }

  update () {
    try {
      const attrs = window.component.getAttributeNames();
      this.cAttributes = attrs.map(attrName => {
        return {
          name: attrName,
          value: window.component.getAttribute(attrName)
        };
      });
    }
    catch (err) {
      this.cAttributes = [];
    }
    try {
      const properties = Object.getOwnPropertyNames(dashboard.componentModule);
      this.cProps = properties.map(prop => {
        return {
          name: prop,
          value: window.component[prop]
        }
      });
    } catch (err) {
      this.cProps = [];
    }
  }
})