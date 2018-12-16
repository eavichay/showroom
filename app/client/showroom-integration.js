class Showroom {

  constructor () {
    window.showroomReady = window.showroomReady || new Promise((resolve) => {
      requestAnimationFrame( () => {
        window.showroomReady.resolve = resolve;
      });
    });
    this.inject();
    this.ready = window.showroomReady;
  }

  find (path, component = this.component) {
    return window.queryDeepSelector(path, component);
  }

  inject () {
    if (!window.queryDeepSelector) {
      /**
       * @param {string} selectorStr
       * @param {any} container
       */
      const queryDeepSelector = (selectorStr, container = document) => {
        const selectorArr = selectorStr.replace(new RegExp('//', 'g'), '%split%//%split%').split('%split%');
        for (const index in selectorArr) {
          const selector = selectorArr[index].trim();

          if (!selector) continue;

          if (selector === '//') {
            container = container.shadowRoot;
          } else if (selector === 'document') {
            container = document;
          } else {
            container = container.querySelector(selector);
          }
          if (!container) break;
        }
        return container;
      };
      window['queryDeepSelector'] = queryDeepSelector;
    };
  }

  async setTestSubject(component) {
    await window.showroomReady;
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