const chalk = require('chalk');

const {silent, verbose} = Object.assign({silent: false, verbose: false}, global.showroom);
const stream = console;

module.exports = {
  info: (...args)=>!silent && verbose && stream.log(...args.map(arg=>chalk.green(arg))),
  warn: (...args)=>!silent && stream.log(...args.map(arg=>chalk.yellow(arg))),
  error: (...args)=>!silent && stream.error(...args.map(arg=>chalk.red(arg))),
};
