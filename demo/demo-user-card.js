import { LitElement, html} from 'https://unpkg.com/@polymer/lit-element@0.6.2/lit-element.js?module';



customElements.define('demo-user-card', class extends LitElement {

  static get observedAttributes () {
    return ['user-id', 'accent-color'];
  }

  constructor () {
    super();
    this.accentColor = '#FFFFDD';
  }

  render () {
    
    return html`
    <style>

    :host {
      display: flex;
      flex-direction: row;
      border: 4px double darkgrey;
      background-color: ${this.accentColor};
      padding: 2rem;
      border-radius: 2rem;
      box-shadow: 0px 1px 6px 2px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      position: relative;
      }

    :host #user-image {
      background-image: url(${this.getUserImage()});
      border-radius: 0%;
      width: 150px;
      background-repeat: no-repeat;
      background-size: cover;
      display: inline-flex;
      background-clip: content-box;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-position: 40%;
    }

    h2 {
      margin: 0;
      margin-bottom: 2rem;
      text-transform: capitalize;
    }

    label {
      color: lightgrey;
      display: inline-block;
    }

    label, label + span {
      border-bottom: 1px dotted lightgrey;
      display: inline-block;
      width: 100%;
    }

    #username {
      font-size: 1.4rem;
      font-family: monospace;
      padding-left: 1rem;
    }

    #card-content {
      padding-left: 20rem;
    }
    </style>

    ${this.user ? html`
    <div id="user-image"></div>
    <div id="card-content">
      <h2>${this.user.name.last}, ${this.user.name.first}<span id="username">(${this.user.login.username})</span></h2>
      <div class="entry">
        <label>Address</label><span>${this.getUserAddress()}</span>
      </div>
      <div class="entry">
        <label>Email</label><span>${this.user.email}</span>
      </div>
      <div class="entry">
        <label>Phone</label><span>${this.user.cell}</span>
      </div>
    </div>` : ''}`;
  }

  attributeChangedCallback (attr, old, value) {
    if (value !== old) {
      switch (attr) {
        case 'user-id':
          this.loadUserById(value);
          break;
        case 'accent-color':
          this.accentColor = value;
          this.requestUpdate();
      }
    }
  }

  async loadUserById (userId) {
    const url = `https://randomuser.me/api?seed=${userId}`;
    const { results } = await (await fetch(url)).json();
    const user = results[0];
    this.dispatchEvent(new CustomEvent('data-loaded', {
      detail: {
        user,
        userId
      }
    }));
    this.user = user;
    this.requestUpdate();
  }

  getUserImage () {
    const { user } = this;
    if (user) {
      return this.user.picture.large;
    }
  }

  getUserAddress () {
    const { user } = this;
    if (user) {
      const { street, city, state, postcode } = user.location;
      return [ street, city, state, postcode ].join(', ');
    }
    return '';
  }

});