const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

const componentList = [];

const info = (...args) => {
  if (global.showroom.verbose) {
    console.log(...args);
  }
}

const search = async (path) => {
  info('Searching in', path);
  const files = await readdir(path);
  await Promise.all(files.map(async filename => {
    const stats = await lstat(path + '/' + filename);
    if (stats.isDirectory()) {
      if (filename !== 'node_modules') {
        await search(path + '/' + filename)
      } 
    } else if (stats.isFile()) {
      info(`\t${filename}`);
      componentList.push(filename);
    }
  }));

  return componentList;
};

module.exports = {
  componentList,
  search
};