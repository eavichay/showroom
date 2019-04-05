#!/usr/bin/env node

const path = require('path');
const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const yargs = require('yargs');
const { search, getComponents } = require('./build-component-index');
const fs = require('fs');
const { promisify } = require('util');
const enforceHttps = require('koa-sslify');
const logger = require('./logger');

const lstat = promisify(fs.lstat);

const backend = new Koa();
const frontend = new Koa();
const app = new Koa();
let koaServer;

const serveStaticOptions = {
  hidden: true,
  cacheControl: false
};

if (require.main === module) {
  yargs
  .usage('$0 [--path] [--port]', '', (yargs) => {}, (argv) => {
        global.showroom = {
          verbose: argv.verbose,
          silent: argv.silent,
          port: argv.port,
          path: argv.path
        };
        bootstrap({
          port: argv.port,
          path: argv.path
        });
    })
  .default('verbose', false)
  .default('silent', false)
  .default('port', '3000')
  .default('path', './')
  .help()
  .argv;
}

async function bootstrap ({port = 3000, path = './', silent = false}) {
  global.showroom = Object.assign(global.showroom || {},
    {
      path,
      port,
      silent
    });
  await preflight();
  logger.info('Starting server');
  await startServer();
  koaServer = app.listen(process.env.PORT || port);
}

async function preflight () {
  const parentDir = path.resolve(process.cwd(), global.showroom.path);
  const dir = path.resolve(process.cwd(), global.showroom.path, '.showroom');
  if (fs.existsSync(dir) && (await lstat(dir)).isDirectory()) {
    logger.info(`.showroom folder located`);
  } else {
    logger.error(`Could not locate .showroom folder in ${parentDir}`);
  }
}

async function startServer () {
  const dir = (module, ...rest) => path.join(path.dirname(require.resolve(module)), ...rest);
  const allowedPaths = [
    path.join(__dirname, '/../client'),
    process.cwd(),
    dir('jsoneditor', 'dist'),
    dir('marked', '..'),
    dir('milligram'),
    dir('slim-js'),
    global.showroom.path,
  ];

  logger.info('Expecting Showroom files to be at', global.showroom.path + '/.showroom')
  await search(path.resolve(process.cwd(), global.showroom.path, '.showroom'));

  if (process.env.FORCE_SSL) {
    logger.info('Enforcing SSL');
    app.use(enforceHttps({
      trustProtoHeader: true
    }));
  }

  allowedPaths.forEach(path => {
    frontend.use(serve(path, serveStaticOptions));
  });

  backend.use(async (ctx, next) => {
    if (ctx.path === '/.showroom-app/showroom-config') {
      const cfgPath = path.resolve(process.cwd(), global.showroom.path, '.showroom', 'config.js');
      ctx.set('Content-Type', 'application/javascript; charset=utf-8');
      if (fs.existsSync(cfgPath)) {
        try {
          const config = fs.readFileSync(cfgPath);
          ctx.body = config.toString('utf-8');
        }
        catch (err) {
          ctx.body = 'export default {}';
          await next();
        }
      } else {
        ctx.body = 'export default {}';
        await next();
      }
    } else {
      await next();
    }
  });

  backend.use(async (ctx, next) => {
    if (ctx.path === '/index.html' || ctx.path === '/') {
      ctx.redirect('/.showroom-app/index.html');
    } else {
      next();
    }
  });

  backend.use(async (ctx, next) => {
    if (ctx.path === '/.showroom-app/showroom-components') {
      ctx.body = getComponents();
    } else {
      await next();
    }
  });

  // attempt serving static files by path priority
  app.use(mount('/.showroom-app', frontend));
  app.use(mount('/', frontend));

  // attempt serving backend files
  app.use(mount('/', backend));

  return true;
}

module.exports = {
  bootstrap,
  server: () => koaServer
};
