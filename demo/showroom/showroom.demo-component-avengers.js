export default {
  section: 'Slim.js',
  descriptionURL: false, //'https://google.com',
  description: `
# Demo Component
## Library: slim.js

[Source](/demo/demo-component-avengers.js)

### Usage
\`\`\`html
<demo-component-avengers accent-color="darkred" text-color="white"></demo-component-avengers>
\`\`\`
\`\`\`javascript
component.data = {
  rank: 95,
  lastAssignment: 'Save captain Fury'
} // will trigger *datachanged* event

component.mission = 'Save the world' // will trigger *taskselected* event
\`\`\`

### Attributes
- **accent-color** Accent color of the component
- **text-color** Color of text

### Properties
- {object} data
- {string} title
- {Array<string>} members
- {string} mission

### Events
- missionstarted
- datachanged
- taskselected
  `,

  component: 'demo-component-avengers',

  path: '/demo/demo-component-avengers.js',

  events: ['missionstarted', 'datachanged', 'taskselected'],
  properties: {
    title: 'Avengers',
    members: [
      'Captain America', 'Ironman', 'Hawkeye'
    ],
    mission: new Set(['Protect New York', 'Save the world', 'Shut down Hydra']),
    data: {
      rank: 95,
      lastMission: 'Save captain Fury'
    }
  },
  attributes: {
    'accent-color': 'darkred',
    'text-color': 'white',
  },
  innerHTML: `<img width="64" height="64" src="/demo/avengers.png">`,
  outerHTML: /*html*/`
    <div style="background: lightgray; padding: 2rem; width: 450px;">
      <h5>This is a wrapping HTML around the component, defined in the showroom file describing the component</h1>
      <showroom-mount-point></showroom-mount-point>
      <h6>This is the rest of the wrapping HTML around the component</h3>
    </div>
    `
}