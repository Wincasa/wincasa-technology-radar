'use strict';

const path = require('path');
const buildPath = path.join(__dirname, './dist');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let main = ['./src/site.js'];
let common = ['./src/common.js'];

let plugins = [
    //new BundleAnalyzerPlugin(),
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
    new CleanWebpackPlugin(['dist'])
];

const config = {
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
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|ico)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
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

    devServer: {
        contentBase: buildPath,
        host: '0.0.0.0',
        port: 8080
    }
};

module.exports = (_env, argv) => {
    if (argv.mode === 'development') {
        config.entry.main.push('webpack-dev-server/client?http://0.0.0.0:8080');
        config.devtool = 'source-map';
    }

    if (argv.mode === 'production') {
        config.optimization = {minimize: true};
    }

    return config;
};