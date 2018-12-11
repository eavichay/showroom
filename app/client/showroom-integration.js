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
    await showroomApp.findAndLoadComponent(component);
  }

  setProperty(prop, value) {
    dashboard.targetComponent[prop] = value;
    window.dispatchEvent(new CustomEvent('property-changed', {
      detail: {
        prop, value
      }
    }))
  }

  getProperty(prop) {
    return dashboard.targetComponent[prop];
  }

  setAttribute(attr, value) {
    dashboard.targetComponent.setAttribute(attr, value);
    window.dispatchEvent(new CustomEvent('attribute-changed', {
      detail: {
        attr, value
      }
    }))
  }

  toggleAttribute(attr) {
    dashboard.targetComponent.toggleAttribute(attr);
    window.dispatchEvent(new CustomEvent('attribute-toogled'),{
      detail: {
        attr,
        value: dashboard.targetComponent.hasAttribute(attr)
      }
    });
  }

  getAttribute(attr) {
    return dashboard.targetComponent.getAttribute(attr);
  }

  hasAttribute(attr) {
    return dashboard.targetComponent.hasAttribute(attr);
  }

  trigger(fnName) {
    this.triggers[fnName]();
    window.dispatchEvent(new CustomEvent('trigger', {
      detail: {
        fnName,
        trigger: this.triggers[fnName]
      }
    }));
  }

  clearEventList() {
    dashboard.clearEvents();
    window.dispatchEvent(new CustomEvent('events-cleared'));
  }

  on (eventName, callback) {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }
  

}

window.showroom = new Showroom();