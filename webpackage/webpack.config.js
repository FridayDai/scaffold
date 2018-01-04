var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var os = require('os');
var html = require('html-webpack-plugin');
var clean = require('clean-webpack-plugin');
var copy = require('copy-webpack-plugin');
var happyPack = require('happypack');
// var happyThreadPool = happyPack.ThreadPool({ size: os.cpus().length });
var includeAssets = require('html-webpack-include-assets-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

var ROOT_PATH = path.resolve(__dirname);
var SOURCE_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var NODEMODULE_PATH = path.resolve(ROOT_PATH, 'node_modules');
var COMMONJS_PATH = path.resolve(__dirname, 'src/common/js');
var DLL_NAME = require(path.resolve(ROOT_PATH, 'dll/vendors-manifest.json')).name;

var PUBLIC_PATH = '/medical/';

var isPublish = process.env.NODE_ENV === 'production';

function createHappyPlugin(id, loaders, removeFirst) {
    if(removeFirst && isPublish){
        loaders.shift();
    }

    return new happyPack({
        id: id,
        loaders: loaders,
        // threadPool: happyThreadPool,
        verbose: true
    });
}

var config = {
    context: SOURCE_PATH,
    
    entry: {
        commons: ['constants', 'util', 'eventtarget', 'dao', 'pagedao'],
        lang: ['lang']
    },
    
    output: {
        path: BUILD_PATH,
        filename: isPublish ? 'res/[name]/index_[chunkhash:8].js' : 'res/[name]/index.js',
        publicPath: isPublish ? PUBLIC_PATH : ''
    },
    
    resolve: {
        modules: [COMMONJS_PATH, '.', 'components', 'node_modules'],
        mainFields: ['jsnext:main', 'browser', 'module', 'main'],
        alias: {
            'lang': 'common/js/lang.js',
            'constants': 'common/js/constants.js',
            'util': 'common/js/util.js'
        }
    },

    devServer: {
        historyApiFallback: false,
        hot: true,
        inline: true,
        // progress: true,
        port: 8888,
        // host:'0.0.0.0',
        publicPath: PUBLIC_PATH,
        // devtool: 'eval-source-map',
        // contentBase: './dist',
        proxy: {
            '/**': {
                // changeOrigin: true,
                target: 'http://localhost:8080',
                secure: true
            }
        }
    },
    
    module: {
        noParse: [/moment.js/],
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                // use: ['happypack/loader?id=js'],
                exclude: /node_modules|lib_modules/,
                include: SOURCE_PATH
            },
            {
                test: /\.less$/,
                use: isPublish ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['happypack/loader?id=less']
                }) : ['happypack/loader?id=less']
            },
            {
                test: /\.css$/,
                include: SOURCE_PATH,
                exclude: /node_modules|lib_modules/,
                // loader: 'style!css?modules&localIdentName=[name]_[local]_[hash:base64:5]'
                use: isPublish ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['happypack/loader?id=css']
                }) : ['happypack/loader?id=css']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['url-loader?limit=10000&name=res/assets/[name]_[hash:8].[ext]']
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)\/?.*$/i,
                use: ['file-loader?name=res/assets/[name].[ext]']
            }
        ]
    },

    plugins: [
        new clean([BUILD_PATH]),
        new copy([{
                'from': './common/lib_modules',
                'to': '../dist/res/3rdlib'
            }, {
                'from': '../dll',
                'to': '../dist/res/3rdlib/dll'
            }
        ]),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DllReferencePlugin({
            context: ROOT_PATH,
            manifest: require('./dll/vendors-manifest.json')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['commons', 'lang'], 
            filename: isPublish ? 'res/[name]/index_[chunkhash:8].js' : 'res/[name]/index.js',
            minChunks: Infinity
        }),/*
        new webpack.optimize.UglifyJsPlugin(
            isPublish ? {
                beautify: false,
                comments: false,
                compress: {warnings: false, drop_debugger: true, drop_console: true, reduce_vars: true}
            } : {sourceMap: true, compress: {warnings: false}}
        ),*/
        new ParallelUglifyPlugin({
            uglifyJS: isPublish ? {
                output: {comments: false, beautify: false},
                compress: {warnings: false, drop_debugger: true, drop_console: true, reduce_vars: true}
            } : {compress: false}
        }),
        // createHappyPlugin('js', ['babel-loader']),
        createHappyPlugin('less', ['style-loader', 'css-loader?importLoaders=2', 'postcss-loader', 'less-loader'], true),
        createHappyPlugin('css', ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'], true),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

var entryFilters = ['.svn', 'components', 'common', 'htmltemplate'];
var entryFilters2 = ['assetaccess', 'assetgrouping', 'connect', 'groupconf', 'apilist',
    'connectConfig', 'referenceconfig', 'homepage', 'login'];
if(isPublish){
    entryFilters.push('testcomponent');
}

fs.readdirSync(SOURCE_PATH)
    .filter(entry => fs.statSync(path.join(SOURCE_PATH, entry)).isDirectory())
    .filter(entry => entryFilters.indexOf(entry) < 0)
    // .filter(entry => entryFilters2.indexOf(entry) > -1)
    .forEach(entry => {
        config.entry[entry] = ['./' + entry]; 

        config.plugins.push(new html({
            title: 'pagetitle.' + entry,
            template: 'htmltemplate/index.html',
            filename: entry + '.html',
            favicon: 'common/img/envision.ico',
            chunksSortMode: 'dependency',
            chunks: ['commons', 'lang', entry],
            vendor: PUBLIC_PATH + 'res/3rdlib/dll/' + DLL_NAME + '.js',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            }
        }));

        var assetPath = path.join(SOURCE_PATH, entry + '/asset.json');

        if(fs.existsSync(assetPath)){
            var assets = JSON.parse(fs.readFileSync(assetPath, 'utf-8'));

            for(var idx=assets.length - 1; idx >= 0; --idx){
                config.plugins.push(new includeAssets({
                    'files': [entry + '.html'],
                    'assets': [
                        assets[idx].path ? 
                            {'path': assets[idx].path, 'type': assets[idx].type} : 
                            [
                                'res/3rdlib/',
                                assets[idx].type,
                                '/',
                                assets[idx].name,
                                '.',
                                isPublish ? 'min.' : '',
                                assets[idx].type,
                                '?',
                                assets[idx].version
                            ].join('')
                    ],
                    'append': false,
                    'publicPath': assets[idx].path ? false : true
                }));
            }
        }
    }
);    
    
if(!isPublish){
    config.module.rules.unshift(
        {
            test: /\.jsx?$/,
            include: SOURCE_PATH,
            exclude: /node_modules|lib_modules/,
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc'
                    }
                }
            ],
            enforce: 'pre',
        }
    );
    
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}else{
    config.plugins.unshift(new webpack.LoaderOptionsPlugin({minimize: true}));
    config.plugins.push(new ExtractTextPlugin({
            filename: 'res/css/[name]_[contenthash].css',
            allChunks: true
    }));
}

module.exports = config;
