const {injectBabelPlugin} = require('react-app-rewired')

const rootImportConfig = [
    'root-import',
    {
        rootPathPrefix: '~',
        rootPathPrefix: 'src',
    }
];

module.exports = config => injectBabelPlugin(rootImportConfig, config)