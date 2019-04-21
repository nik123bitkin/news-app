const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
   mode: 'production',
   plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'NewsApp',
        template: 'src/index.html',
        filename: 'index.html',
        minify: { collapseWhitespace: true }
      }),
      new OptimizeCssAssetsPlugin({
         cssProcessorPluginOptions: {
           preset: ['default', { discardComments: { removeAll: true } }],
         },
       })
   ],
   optimization: {
      minimizer: [
         new TerserPlugin({
            cache: true,
            parallel: true,
            extractComments: 'all',
         }),
      ],
   },
});