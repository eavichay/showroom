import { Slim } from '/.showroom-app/Slim.js';
import '/.showroom-app/directives/repeat.js';

const template = /*html*/`
<style>
  @import url("https://unpkg.com/bootstrap@4.1.3/dist/css/bootstrap.min.css");

  ::slotted(span) {
    color: green;
  }
  :host {
    font-family: sans-serif;
    border: 1px solid black;
    padding: 1rem;
    padding-top: 0;
    padding-right: 0;
    position: relative;
    display: flex;
    background: wheat;
  }

  :host .container {
    padding-right: 0;
    padding-top: 0;
  }

  :host ul {
    list-style-type: none;
    padding: 0;
  }

  ::slotted(img) {
    position: relative;
    top: 1rem;
  }

  :host div:not(.container) {
    padding: 0.5rem;
  }

  h3 {
    margin: 0;
    padding: 1rem;
    width: 100%;
    color: {{textColor}};
    background-color: {{accentColor}};
  }
  </style>
  <slot></slot>
  <div class="container">
  <h3>{{title}}</h3>
  <div><strong>Current members:</strong><br/>
    <ul>
      <li s:repeat="members as member">{{member}}</li>
    </ul>
  </div>
  <hr/>
  <div><strong>Next mission:</strong><br/>{{mission}}</div>
  <hr/>
  <div><strong>Data</strong>
  <br/>
  Rank: {{data.rank}}<br/>
  Last Mission: {{data.lastMission}}</div>
  <button class="btn btn-primary" click="startMission">Start Mission</button>
  </div>
`
customElements.define('demo-component-avengers', class extends Slim {

  get useShadow () { return true; }

  get template () { return template; }

  onBeforeCreated () {
    this.data = {
      rank: 95,
      lastMission: 'Save captain Fury'
    };
    this.mission = 'Protect New York';
  }

  onCreated () {
    Slim.bind(this, {}, 'data', () => {
      this.dispatchEvent(new CustomEvent('datachanged', {
        detail: this.data
      }));
    });

    Slim.bind(this, {}, 'mission', () => {
      this.dispatchEvent(new CustomEvent('taskselected', {
        detail: {
          mission: this.mission,
          memeber: this.memeber
        }
      }));
    });
  }

  startMission () {
    this.dispatchEvent(new CustomEvent('missionstarted', {
      detail: {
        mission: this.mission,
        memebers: this.memeber
      }
    }));
  }

  get autoBoundAttributes () {
    return this.constructor.observedAttributes;
  }

  attributeChangedCallback (attr, oldVal, newVal) {
    this[Slim.dashToCamel(attr)] = newVal;
  }

  static get observedAttributes () {
    return ['accent-color', 'text-color'];
  }

});