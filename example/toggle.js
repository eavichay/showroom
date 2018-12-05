dashboard.setAttribute('collapsed', '');
if (!window.location.hash) showroom.setTestSubject('Welcome');

setTimeout( () => {
  if (!window.location.hash) {
    window.location.hash = 'Welcome';
  }
}, 5)

setTimeout( () => {
  window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#Welcome') {
      dashboard.removeAttribute('collapsed');
    } else {
      dashboard.setAttribute('collapsed', '');
    }
  });
}, 350);