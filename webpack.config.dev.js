const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    watch: true,//for auto recompile all files watched by webpack
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          title: 'NewsApp',
          template: 'src/index.html',
          filename: 'index.html'
        })
    ],
});