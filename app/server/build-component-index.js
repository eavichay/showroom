const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const path = require('path');
const logger = require('./logger');

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

let watcher;

const doSearch = async (rootPath) => {
  logger.info('Searching in', rootPath);
  const files = (await readdir(rootPath)).sort();
  logger.info(`Found files: ${files}`);
  await Promise.all(files.map(async filename => {
    const filePath = path.join(rootPath, filename);
    const stats = await lstat(filePath);
    if (stats.isDirectory()) {
      if (filename !== 'node_modules') {
        await doSearch(filePath);
      }
    } else if (stats.isFile() && filename !== 'config.js') {
      logger.info(`\tAdding: ${filename}`);
      componentList.push(filename);
    }
  }));
  logger.warn(`${componentList.length} Total file(s) found in .showroom folder`);
  return componentList;
};

module.exports = {
  getComponents: () => componentList,
  search: async function (root, silent = false) {
    if (!watcher) {
      const result = await doSearch(root);
      if (!global.noWatch) {
        watcher = fs.watch(root, {}, debounce((e, f) => {
        componentList = [];
        logger.warn(`Filesystem change detected... scanning .showroom folder`);
        doSearch(root, silent);
        }, 150));
      }
      return result;
    } else {
      return componentList;
    }
  }
};
