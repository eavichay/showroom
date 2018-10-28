class MoneyInput extends HTMLInputElement {

  constructor () {
    super();
    this.addEventListener('input', this.update.bind(this));
    this.addEventListener('change', this.update.bind(this));
    this.currency = 'USD';
  }

  static get observedAttributes () {
    return ['currency', 'type'];
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    switch (attr) {
      case 'currency':
        this.currency = newValue;
        this.update();
        break;
      case 'type':
        if (newValue !== 'text') {
          this.setAttribute('type', 'text');
          this.update();
        }
        break;
    }
  }

  update () {
    this.value = this.currency + ' ' + this.value.replace(/\D/g,'');
  }

}

customElements.define('money-input', MoneyInput, {
  extends: 'input'
});