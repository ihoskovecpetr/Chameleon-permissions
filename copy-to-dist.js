const fs = require('fs-extra');
fs.copySync('./build/projects.js','../dist/static/projects.js');
fs.copySync('./projects.html','../dist/html/projects.html');
