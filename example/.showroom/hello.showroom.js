import '../toggle.js';

export default {
  section: 'Showroom',
  component: 'Welcome',
  centered: true,
  descriptionURL: 'https://github.com/eavichay/showroom/wiki',
  outerHTML: /*html*/`


<!-- <style>@import url("/assets/main.css");</style> -->
<style>
  #root {
    font: 16px "Source Sans", helvetica, arial, sans-serif;
    flex-grow: 1;
  }
  h1, h3, img {
    align-self: center;
    font-weight: normal;
  }
  .vbox {
    display: flex;
    flex-direction: column;
  }
  #big-title {
    margin: 0;
    text-rendering: optimizeLegibility;
    padding: 0.5rem;
    padding-left: 1rem;
    letter-spacing: 0.3rem;
    font-weight: normal;
    font-size: 2rem;
    cursor: default;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    z-index: 2;
    font-family: 'Forum', Georgia, 'Times New Roman', Times, serif;
  }
</style>
<div id="root" class="vbox">
  <h1 id="big-title">SHOWROOM</h1>
  <h3 style="text-align: center;">The Next-Generation<br/>Web Components Development and Testing environment</h2>
  <img src="https://raw.githubusercontent.com/webcomponents/webcomponents-icons/master/logo/logo_256x256.png" width="128" height="128"/>
</div>


`
}