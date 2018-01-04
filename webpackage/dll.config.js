var path = require('path');
var webpack = require('webpack');
var clean = require('clean-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

var webpackConfig = {
    entry: {
        vendors: ['react', 'react-dom', 'babel-polyfill', 'postal', 
            'isomorphic-fetch', 'moment', 'promise-polyfill']
    },
  
    output: {
        path: path.resolve(ROOT_PATH, 'dll'),
        filename: 'vendors_[hash:8].js',
        library: 'vendors_[hash:8]'
    },
  
    plugins: [
        new clean([path.resolve(ROOT_PATH, 'dll')]),
        new webpack.DllPlugin({
            path: path.resolve(ROOT_PATH, 'dll/vendors-manifest.json'),
            name: 'vendors_[hash:8]'
        }),
        new webpack.optimize.UglifyJsPlugin(
            {
                beautify: false,
                comments: false,
                compress: {warnings: false, drop_debugger: true, drop_console: true, reduce_vars: true}
            }
        )
    ],
  
    resolve: {
        modules: ['components', 'node_modules'],
        mainFields: ['jsnext:main', 'browser', 'module', 'main']
    }
}

module.exports = webpackConfig