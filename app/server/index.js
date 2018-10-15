#!/usr/bin/env node

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const yargs = require('yargs');
const { search, componentList } = require('./build-component-index');
const chalk = require('chalk');
const fs = require('fs');
const { promisify } = require('util');

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);

const app = new Koa();

yargs
  .usage('$0 [--path] [--port]', '', (yargs) => {}, (argv) => {
        global.showroom = {
          verbose: argv.verbose,
          port: argv.port,
          path: argv.path
        };
        preflight()
          .then(() => console.log(chalk.green('Starting server')))
          .then(() => startServer())
          .then(() => app.listen(argv.port));
    })
  .default('port', '3000')
  .default('path', './')
  .help()
  .argv;

async function preflight () {
  const parentDir = path.resolve(process.cwd(), global.showroom.path);
  const dir = path.resolve(process.cwd(), global.showroom.path, '.showroom');
  if (fs.existsSync(dir) && (await lstat(dir)).isDirectory()) {
    console.log(`.showroom folder located`);
  } else {
    console.log(chalk.red(`Could not locate .showroom folder in ${parentDir}`));
    process.exit(-1);
  }
}

async function startServer () {
  console.log('Expecting Showroom files to be at', global.showroom.path + '/.showroom')
  await search(path.resolve(process.cwd(), global.showroom.path, '.showroom'));
  console.log(chalk.yellow(`${componentList.length} Total file(s) found`));
  app.use(serve('app/client', {hidden: true}));
  app.use(serve(global.showroom.path, {hidden: true}));
  app.use(serve('node_modules/marked'));
  app.use(serve('node_modules/milligram/dist'));
  app.use((async (ctx, next) => {
    if (ctx.path === '/components') {
      ctx.body = componentList;
    }
  }));
  return true;
}


