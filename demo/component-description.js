customElements.define('component-description', class extends HTMLElement {

  constructor () {
    super();
    this._ = this.attachShadow({mode:'open'});
    this._.innerHTML = /*html*/`
      <style>@import url("./milligram.min.css");</style>
      <style>
        dialog {
          width: 75vw;
          height: 75vh;
          overflow: auto;
          top: 15%;
        }
      </style>
      <dialog>
      </dialog>
    `;
    this.modal = this._.querySelector('dialog');
  }

  setContent (markdown) {
    this.modal.innerHTML = marked(markdown);
    this.modal.showModal();
  }

});