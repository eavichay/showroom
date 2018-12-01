dashboard.setAttribute('collapsed', '');
showroom.setTestSubject('Welcome');

window.location.hash = 'Welcome';

setTimeout( () => {
  window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#Welcome') {
      dashboard.removeAttribute('collapsed');
    } else {
      dashboard.setAttribute('collapsed', '');
    }
  });
}, 350);