customElements.define('demo-component-avengers', class extends HTMLElement {

  constructor () {
    super();
    ['data', 'title', 'members', 'mission'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        set: (v) => {
          this['_' + prop] = v;
          this.render();
          if (prop === 'data') {
            this.dispatchEvent(new CustomEvent('datachanged',
            {
              detail: v,
              timestamp: new Date()
            }));
          }
        },
        get: () => {
          return this['_' + prop];
        }
      })
    })
    this.members = [];
    this.title = '';
    this.mission = '';
    this.data = {};
    this.render();
    this.style.border = '1px solid black';
    this.style.padding = '1rem';
  }

  render () {
    this.innerHTML = `
    <h3 style="margin: 0; padding: 1rem">${this.title}</h3>
    <hr/>
    <div><strong>Current members:</strong><br/>${this.members.join(', ')}</div>
    <div><strong>Next mission:</strong><br/> ${this.mission}</div>
    <div>
      <strong>Data</strong>
      <div>Rank: ${this.data ? this.data.rank : ''}</div>
      <div>Last Mission: ${this.data ? this.data.lastMission : ''}</div>
    <button>Start Mission</button>
    `;
    this.style.position = 'relative';
    this.style.display = 'inline-block';
    this.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('missionstarted', {
        detail: {
          mission: this.mission,
          candidates: this.members
        }
      }));
    });
    this.headerElement = this.querySelector('h3');
    this.headerElement.style.backgroundColor = this.getAttribute('accent-color');
    this.headerElement.style.color = this.getAttribute('text-color');
  }

  static get observedAttributes () {
    return ['accent-color', 'text-color'];
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    this.render();
  }
});