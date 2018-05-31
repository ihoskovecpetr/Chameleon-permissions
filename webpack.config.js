const webpack = require('webpack');
const HtmlWepackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'react-hot-loader/patch',
        './src/app.js'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: 'projects.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWepackPlugin({
            template: __dirname + '/projects.html'
        })
    ],
    devServer: {
        //contentBase: '.',
        hot: true,
        open: true,
        port: 3003,
        compress: true
    }
};