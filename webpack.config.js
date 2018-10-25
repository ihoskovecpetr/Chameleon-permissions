const APP_NAME = require('./package.json').name;
const devMode = process.env.NODE_ENV !== 'production';

const webpack = require('webpack');
const HtmlWepackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const PROXY_REMOTE_USER = 'miroslav.kozel';

module.exports = {
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        'bootstrap/dist/css/bootstrap.min.css',
        'react-datepicker/dist/react-datepicker.css',
        './src/app.js'
    ],
    devServer: {
        contentBase: './src/static',
        index: `${APP_NAME}.html`,
        hot: true,
        //open: true,
        port: 8080,
        compress: true,
        proxy: {
            '/remote-user': {
                target: 'http://localhost:3000',
                secure: false,
                headers: {'remote_user': PROXY_REMOTE_USER}
            },
            '/api': {
                target: 'http://localhost:3000',
                secure: false,
                headers: {'remote_user': PROXY_REMOTE_USER}
            }
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWepackPlugin({
            template: __dirname + '/src/index.html',
            filename: `${APP_NAME}.html`
        }),
        new MiniCssExtractPlugin({
            filename: `${APP_NAME}.css`
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/build',
        publicPath: '',
        filename: `${APP_NAME}.js`
    }
};