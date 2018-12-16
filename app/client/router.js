customElements.define('showroom-router', class extends HTMLElement {

  constructor () {
    super();
    window.router = this;
    this.onHash = () => {
      const hash = window.location.hash.slice(1);
      this.component = hash;
      this.dispatchEvent(new CustomEvent('change', {
        detail: hash
      }));
    }
    window.addEventListener('hashchange', this.onHash);
    this.onHash();
  }

});