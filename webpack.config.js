'use strict';

const path = require('path');
const buildPath = path.join(__dirname, './dist');
const args = require('yargs').argv;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

let isProd = args.prod;
let isDev = args.dev;

let main = ['./src/site.js'];
let common = ['./src/common.js'];
let devtool;
let minimize = false;

if (isDev) {
    main.push('webpack-dev-server/client?http://0.0.0.0:8080');
    devtool = 'source-map';
}

let plugins = [
    new MiniCssExtractPlugin({filename: '[name].[hash].css'}),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        inject: 'body'
    }),
    new HtmlWebpackPlugin({
        template: './src/error.html',
        chunks: ['common'],
        inject: 'body',
        filename: 'error.html'
    }),
    new CleanWebpackPlugin(["dist"])
];

if (isProd) {
    minimize = true;
}

module.exports = {
    entry: {
        'main' : main,
        'common' : common
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },

    output: {
        path: buildPath,
        publicPath: '/',
        filename: '[name].[hash].js'
    },

    module: {
        rules: [
            { test: /\.json$/, use: 'json-loader', exclude: /node_modules/ },
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|ico)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {
                    name: 'images/[name].[ext]',
                    context: './src/images'
                }
            },
            {
                test: /\.csv/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: plugins,

    devtool: devtool,

    optimization: {
        minimize: minimize
    },

    devServer: {
        contentBase: buildPath,
        host: '0.0.0.0',
        port: 8080
    }
};

