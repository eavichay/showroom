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

function locateAllNodeModules (root) {
  if (root === '/') {
    return [];
  }
  let allNodeModules = [];
  const content = fs.readdirSync(path.resolve(root));
  if (content.includes('node_modules')) {
    allNodeModules.push(path.resolve(root));
  }
  try {
    allNodeModules = allNodeModules.concat(locateAllNodeModules(path.resolve(root, '../')));
  }
  catch (err) {
    console.log(err);
  }
  finally {
    return allNodeModules;
  }
}

async function startServer () { 
  const allNodeModules = locateAllNodeModules(global.showroom.path);
  const allowedPaths = [
    __dirname + '/../client',
    __dirname + '/../../node_modules/jsoneditor/dist',
    __dirname + '/../../node_modules/marked',
    __dirname + '/../../node_modules/milligram/dist',
    global.showroom.path,
    
  ];

  console.log('Expecting Showroom files to be at', global.showroom.path + '/.showroom')
  await search(path.resolve(process.cwd(), global.showroom.path, '.showroom'));
  console.log(chalk.yellow(`${componentList.length} Total file(s) found`));

  app.use(async (ctx, next) => {
    console.log('PATH: // ', ctx.path);
    await next();
  });
  

  allowedPaths.forEach(path => {
    console.log(path);
    app.use(serve(path, {hidden: true}));
  });

  app.use(async (ctx, next) => {
    if (ctx.path === '/showroom-components') {
      ctx.body = componentList;
    } else {
      await next();
    }
  });
  return true;
}


