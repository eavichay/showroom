customElements.define('timer-component', class extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback () {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
    this.update();
  }

  disconnectedCallback () {
    clearInterval(this.intervalId);
  }

  update () {
    const now = new Date();
    this.shadowRoot.innerHTML = now.toTimeString();
    this.dispatchEvent(new CustomEvent('tick-tock', {
      detail: now
    }));
  }
});