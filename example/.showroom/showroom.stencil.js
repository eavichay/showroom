export default {
  component: 'split-me',
  innerHTML: `<div slot="0" style="background: red; height: 100%;"></div><div slot="1" style="background: blue; height: 100%;"></div>`,
  outerHTML: `<div class="container" style="width: 100%; height: 250px;"><showroom-mount-point></showroom-mount-point></div>`,
  attributes: {
    n: 2,
    sizes: "0.50, 0.50"
  }
}