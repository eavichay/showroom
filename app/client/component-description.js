customElements.define('component-description', class extends HTMLElement {

  constructor () {
    super();
    this._ = this.attachShadow({mode:'open'});
    this._.innerHTML = /*html*/`
      <style>@import url("/assets/main.css");</style>
      <style>

        #closeButton {
          position: sticky;
          top: 0;
          left: 100%;
        }
      </style>
      <dialog>
      </dialog>
    `;
    this.modal = this._.querySelector('dialog');
  }

  close () {
    this.modal.close();
  }

  open () {
    if (!this.modal.open) {
      this.modal.showModal();
    }
  }

  replaceContent (markdown) {
    this.modal.innerHTML = `
    <button id="closeButton" tabindex="-1" class="topcoat-button--large">Close</button>
    <div style="width: 100%; overflow: auto;">
    ${marked(markdown)}</div>`;
  }

  setContent (markdown) {
    this.replaceContent(markdown);
    this.open();
    this._.querySelector('#closeButton').onclick = () => {
      this.modal.close();
    };
  }

});