const path = require('path');
//JS压缩插件，简称uglify
const uglify = require('uglifyjs-webpack-plugin');
//打包HTML文件
const htmlPlugin = require('html-webpack-plugin');
//CSS分离:extract-text-webpack-plugin
const extractTextPlugin = require("extract-text-webpack-plugin");
//同步检查html模板，所以我们需要引入node的glob对象使用
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
var website ='';
console.log( encodeURIComponent(process.env.type) );
if(process.env.type== "build"){
    website={
        publicPath:"http://localhost:1717/"
    }
}else{
    website={
        publicPath:"http://localhost:1717/"
    }
}
module.exports = {
    //调试
    devtool: 'eval-source-map',
    //入口文件的配置项
    entry: {
        entry: './src/entry.js',
        //这里我们又引入了一个入口文件
        entry2: './src/entry2.js'
    },
    //出口文件的配置项
    output: {
        //打包的路径文职
        path: path.resolve(__dirname, 'dist'),
        //输出的文件名称
        //filename:'bundle.js'
        filename: '[name].js',
        publicPath:website.publicPath

    },
    //模块：例如解读CSS,图片如何转换，压缩
    module: {
        rules: [{
                test: /\.css$/,
                //use: [ 'style-loader', 'css-loader' ] //第一种写法
                //loader:['style-loader','css-loader'] //第二种写法
                // use: [ //第三种写法
                //     {
                //         loader: "style-loader"
                //     }, {
                //         loader: "css-loader",
                //         options: {
                //           modules: true
                //         }
                //     }, {
                //         loader: "postcss-loader"
                //     }
                // ]
                use: extractTextPlugin.extract({//分离JS代码中的CSS
                    fallback: "style-loader",
                    //use: "css-loader"
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                  })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500000,
                        outputPath:'images/',
                    }
                }]
            },
            //hmtl文件引入<img>标签
            {
                test: /\.(htm|html)$/i,
                 use:[ 'html-withimg-loader'] 
            },
            {
                test: /\.less$/,
                // use: [{
                //        loader: "style-loader" // creates style nodes from JS strings
                //     }, {
                //         loader: "css-loader" // translates CSS into CommonJS
                //     }, {
                //         loader: "less-loader" // compiles Less to CSS
                //     }]
                use: extractTextPlugin.extract({ //分离.less
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                // use: [{
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "sass-loader" // compiles Sass to CSS
                // }]
                use: extractTextPlugin.extract({ //分离.sass
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
              },
              //webpack中配置Babel
              {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                    // options:{
                    //     presets:[
                    //         "es2015","react"
                    //     ]
                    // }
                },
                exclude:/node_modules/
              }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        //压缩JS代码
        new uglify(),
        //打包HTML文件
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'

        }),
        new extractTextPlugin("/css/index.css"),//分离JS代码中的CSS
        // new extractTextPlugin("/css/black.less"),//分离JS代码中的less
        //new extractTextPlugin("/css/whitee.scss"),//分离JS代码中的scss
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
            })

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
        port: 1717
    }
}