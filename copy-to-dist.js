const APP_NAME = require('./package.json').name;

const fs = require('fs-extra');
fs.copySync(`./build/${APP_NAME}.js`,`../../chameleon-backend/www/static/${APP_NAME}.js`);
fs.copySync(`./build/${APP_NAME}.html`,`../../chameleon-backend/www/html/${APP_NAME}.html`);
fs.copySync(`./build/${APP_NAME}.css`,`../../chameleon-backend/www/static/${APP_NAME}.css`);