const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const chalk = require('chalk');
const lstat = promisify(fs.lstat);
const path = require('path');

let componentList = [];

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const info = (...args) => {
  if (global.showroom.verbose) {
    console.log(...args);
  }
}

let watcher;

const doSearch = async (rootPath) => {
  info('Searching in', rootPath);
  const files = await readdir(rootPath);
  await Promise.all(files.map(async filename => {
    const filePath = path.join(rootPath, filename);
    const stats = await lstat(filePath);
    if (stats.isDirectory()) {
      if (filename !== 'node_modules') {
        await search(filePath)
      } 
    } else if (stats.isFile() && filename !== 'config.js') {
      info(`\t${filename}`);
      componentList.push(filename);
    }
  }));
  console.log(chalk.yellow(`${componentList.length} Total file(s) found in .showroom folder`));
  return componentList;
};

module.exports = {
  getComponents: () => componentList,
  search: async function (root) {
    if (!watcher) {
      const result = await doSearch(root);
      watcher = fs.watch(root, {}, debounce((e, f) => {
        componentList = [];
        console.log(chalk.yellow(`Filesystem change detected... scanning .showroom folder`));
        doSearch(root);
      }, 150));
      return result;
    } else {
      return componentList;
    }
  }
};