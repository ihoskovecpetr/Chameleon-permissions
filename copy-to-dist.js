const APP_NAME = require('./package.json').name;

const fs = require('fs-extra');
fs.copySync(`./build/${APP_NAME}.js`,`../dist/static/${APP_NAME}.js`);
fs.copySync(`./build/${APP_NAME}.html`,`../dist/html/${APP_NAME}.html`);
fs.copySync(`./build/${APP_NAME}.css`,`../dist/static/${APP_NAME}.css`);