class Showroom {

  constructor () {
    window.showroomReady = window.showroomReady || new Promise((resolve) => {
      requestAnimationFrame( () => {
        window.showroomReady.resolve = resolve;
      });
    });
    this.ready = window.showroomReady;
  }

  async setTestSubject(component) {
    await this.ready;
    window.location.hash = component;
  }

  setProperty(prop, value) {
    dashboard.targetComponent[prop] = value;
  }

  getProperty(prop) {
    return dashboard.targetComponent[prop];
  }

  setAttribute(attr, value) {
    dashboard.targetComponent.setAttribute(attr, value);
  }

  toggleAttribute(attr) {
    dashboard.targetComponent.toggleAttribute(attr);
  }

  getAttribute(attr) {
    return dashboard.targetComponent.getAttribute(attr);
  }

  hasAttribute(attr) {
    return dashboard.targetComponent.hasAttribute(attr);
  }

  trigger(fnName) {
    this.triggers[fnName]();
  }

  clearEventList() {
    dashboard.clearEvents();
  }

}

window.showroom = new Showroom();