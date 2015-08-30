var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var appPath = path.resolve(__dirname, 'src');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'build');

var config = {
    context: __dirname,

    entry: [
        //'webpack-dev-server/client?http://localhost:3000',
        //'webpack/hot/dev-server',
        path.resolve(appPath, 'app.js')],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [nodeModulesPath]
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                loader: "style!css!autoprefixer-loader?browsers=last 2 version!less"
            },
            {
                test: /\.html$/,
                loader: "raw"
            },
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader") }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            unused: false
        }),
        new ExtractTextPlugin('style.css')
    ]
};

module.exports = config;