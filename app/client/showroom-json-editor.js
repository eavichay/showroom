customElements.define('showroom-json-editor', class extends HTMLElement {

  constructor () {
    super();
    this.root = this.attachShadow({mode: 'open'});
    this.root.innerHTML = /*html*/`
      <style>@import url("jsoneditor.min.css");@import url("/assets/main.css");</style>
      <style>

        :host {
          position: fixed;
          left: 0;
          top: 0;
        }

        :host *:focus {
          outline: auto 5px #3e86c5;
        }

        div.jsoneditor {
          border: 1px solid #3e86c5;
        }

        div.jsoneditor-menu {
          background-color: #3e86c5;
          border-bottom: 1px solid #3e86c5;
        }

        dialog {
          opacity: 0;
          position: absolute;
          top: 15%;
          width: 70vw;
          height: 70vh;
          flex-direction: column;
          justify-content: stretch;
        }

        dialog[open] {
          display: flex;
        }

        .jsoneditor-sort, .jsoneditor-transform {
          display: none;
        }

        #editor {
          display: inline-flex;
          height: 100%;
        }

        #controls {
          display: inline-grid;
          grid-template-columns: 1fr 5rem 5rem;
          grid-gap: 1rem;
        }
      </style>
      <dialog>
        <div id="editor"></div>
        <hr/>
        <div id="controls">
          <div class="spacer"></div>
          <button id="cancel">Cancel</button>
          <button id="submit">Submit</button>
        </div>
      </dialog>
    `;
    this.dialog = this.root.querySelector('dialog');
    JSONEditor.ace = window.ace;
    this.editor = new JSONEditor(this.root.querySelector('#editor'), {modes: ['tree', 'text']});
    this.btnSubmit = this.root.querySelector('#submit');
    this.btnCancel = this.root.querySelector('#cancel');
    this.btnCancel.onclick = () => this.close();
    this.btnSubmit.onclick = () => this.submitData();
    this.btnSubmit.classList.add('topcoat-button--cta');
    this.btnCancel.classList.add('topcoat-button--large--quiet');
    const controls = this.root.querySelector('#controls');
    controls.attachShadow({mode: 'open'});
    controls.shadowRoot.innerHTML = '<style>@import url("/assets/main.css");</style>';
    controls.shadowRoot.appendChild(this.root.querySelector('.spacer'));
    controls.shadowRoot.appendChild(this.btnSubmit);
    controls.shadowRoot.appendChild(this.btnCancel);
    document.addEventListener('open-json-editor', (e) => {
      const { data, callback } = e.detail;
      this.callback = callback;
      this.open(data);
    });
  }

  submitData () {
    const json = this.editor.get();
    const { callback } = this;
    if (callback) {
      callback(json);
    }
    this.close();
  }

  open (json) {
    this.dialog.showModal();
    this.editor.set(json);
  }

  close () {
    this.dialog.close();
  }

});