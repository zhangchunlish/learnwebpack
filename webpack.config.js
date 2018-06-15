const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); //压缩js
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
var website = {
    publicPath: "http://localhost:8888/"
}
module.exports = {
    //入口文件的配置项
    entry: {
        entry: './src/entry.js',
        entry2: './src/entry2.js'
    },
    //出口文件的配置项
    output: {
        //打包的路径文职
        path: path.resolve(__dirname, 'dist'),
        //打包的文件名称
        filename: '[name].js',
        publicPath: website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module: {
        rules: [{
                test: /\.css$/,
                //use: [ 'style-loader', 'css-loader' ]
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }, {
                        loader: 'postcss-loader'
                    }]
                })
            },
            // {
            //     test: /\.less$/,
            //     //use: [ 'style-loader', 'css-loader' ]
            //     use: extractTextPlugin.extract({
            //       use: [{
            //         loader: "css-loader" // translates CSS into CommonJS
            //       }, {
            //         loader: "less-loader" // compiles Less to CSS
            //       }],
            //       fallback: "style-loader",
            //     })
            // },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/',
                        limit: 500000
                    }
                }]
            }, {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }, {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
            // ,{
            //     test: /\.sass$/,
            //     use: [{
            //         loader: "style-loader" // creates style nodes from JS strings
            //     }, {
            //         loader: "css-loader" // translates CSS into CommonJS
            //     }, {
            //         loader: "sass-loader" // compiles Sass to CSS
            //     }]
            // }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true //是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template: './src/index.html'
        }),
        new extractTextPlugin("/css/index.css")
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 8888
    }
}