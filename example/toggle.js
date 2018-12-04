dashboard.setAttribute('collapsed', '');
showroom.setTestSubject('Welcome');

setTimeout( () => {
  window.location.hash = 'Welcome';
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