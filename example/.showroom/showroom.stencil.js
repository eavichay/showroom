export default {
  section: 'Stencil',
  component: 'split-me',
  alias: 'Stencil: <split-me>',
  outerHTML: `
  
  <style>
    div:not(.container) {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  <div class="container" style="width: 100%; height: 250px;">
    <split-me>
      <div slot="0" style="background: var(--accent-color); height: 100%;">
        <img src="https://www.ambient-it.net/wp-content/uploads/2018/07/stenciljs-175m.png">
      </div>
      <div slot="1" style="background: var(--accent-color); opacity: 0.7; height: 100%;">
        <img src="https://www.ambient-it.net/wp-content/uploads/2018/07/stenciljs-175m.png">
      </div>
      <div slot="2" style="background: var(--accent-color); opacity: 0.5; height: 100%;">
        <img src="https://www.ambient-it.net/wp-content/uploads/2018/07/stenciljs-175m.png">
      </div>
    </split-me>
  </div>`,
  attributes: {
    n: 3,
    sizes: "0.33, 0.33, 0.34"
  }
}
