import { Slim } from '/.showroom-app/Slim.js';
import '/.showroom-app/directives/repeat.js';

const template = /*html*/`
<style>

  ::slotted(span) {
    color: green;
  }
  :host {
    background: url(/avengersbg.jpeg);
    background-size: cover;
    background-blend-mode: screen;
    background-color: lightslategray;
    font-family: sans-serif;
    padding: 1rem;
    padding-top: 0;
    padding-right: 0;
    position: relative;
    display: flex;
    height: 19rem;
    font-size: 12px;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0px 5px 4px 1px rgba(0, 0, 0, 0.5);
  }

  :host .container {
    padding-right: 0;
    padding-top: 0;
    background: rgba(255, 255, 255, 0.4);
    position: sticky;
    left: 100%;
    top: 0;
    border-left: 1px solid darkgrey;
    height: 20rem;
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
    box-sizing: border-box;
  }

  button#startMissionBtn {
    background-color: {{accentColor}};
    color: white;
    position: sticky;
    top: 100%;
    width: 100%;
    height: 2rem;
    letter-spacing: 0.05rem;
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
  <button id="startMissionBtn" class="topcoat-button--large btn-primary" click="startMission">Start Mission</button>
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