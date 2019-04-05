![showroom](../app/client/assets/showroom-bg.png)

# showroom: Universal development and automated test environment for web components

[![Build Status](https://semaphoreci.com/api/v1/eavichay/showroom/branches/master/badge.svg)](https://semaphoreci.com/eavichay/showroom)

### Installation

`npm install -g showroom`

create .showroom folder in your project
add descriptor files (see [example](https://github.com/eavichay/showroom/tree/master/example/.showroom)) for your web components.

run showroom and see the magic.

See [live demo here](https://showroomjs.com)

Supports:
- Any stack: Polymer, LitElement, Slim.js, Vanilla, Skate,...
- Supports customized built-in elements (i.e. extends HTMLInputElement)
- Supports innerHTML and wrapping HTML
- Supports global/local scripting and styling
- Supports CI/CD queries for shadow-roots
- Smooth pupeteer integration

### Configuration

The server following options:
- `port (int)` - The port on which the server listens. Default is `3000`.
- `path (string)` - The path, relative to the `process.cwd()`, used to search for project files. Default is `./`.
- `silent (boolean)` - If true, completely disables logging. Default is `false`.
- `verbose (boolean)` - If true, verbose messages will be logged. Otherwise only errors and warnings will be logged. Default it `false`.

### Build & Development
`git clone git@github.com:eavichay/showroom.git`
`npm install`
`npm run dev`

### Online Documentation/Wiki
[Here](https://github.com/eavichay/showroom/wiki)
