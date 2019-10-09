/* global process,__dirname:true */

const path = require("path");
const webpack = require("webpack");
const EX = require("extract-text-webpack-plugin");//为了单独打包css
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const EXCSS = new EX('[name].css');
const env = process.env.NODE_ENV;
const entry = {
    vendor: ["react", "react-dom", "react-router", "react-router-dom", "react-redux", "redux-thunk", "redux", "lodash", "natty-fetch-fd", "nprogress", "leaflet", "moment", "react-stretchable"],
    index: ["babel-polyfill", './src/app/app.js']
};
const plugins = [
    EXCSS,
    new webpack.HotModuleReplacementPlugin(),
    //new HardSourceWebpackPlugin(),
    new webpack.ProvidePlugin({
        React: 'react'
    }),
    new webpack.DefinePlugin({
        "__ENV__": JSON.stringify(env)
    })
];
if (env === "production") {
    plugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
    mode: env,
    entry: entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    devServer: {
        disableHostCheck: true,
        //historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8089,
        host: 'localhost',
        //devServer跨域代理配置
        proxy: {
            '/proxy': {
                target: 'http://192.168.0.101:7001',
                // target: 'http://localhost:7001',
                pathRewrite: {'^/proxy': ''},
                changeOrigin: true,
                secure: false
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            loader: 'babel-loader'
        },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }, {
                test: /\.(less|css)$/,
                exclude: /node_modules/,
                use: EXCSS.extract({
                    // fallback: "style-loader",
                    // use: ['css-loader', 'less-loader']
                    use: [
                        {
                            loader: 'css-loader' // translates CSS into CommonJS
                        }, {
                            loader: 'less-loader', // compiles Less to CSS
                            options: {
                                modifyVars: {
                                    'primary-color': '#1DA57A',
                                    'link-color': '#1DA57A',
                                    'border-radius-base': '2px'
                                },
                                javascriptEnabled: true
                            }
                        }
                    ]
                })
            }, {
                test: /\.css$/,
                exclude: /src/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }]
    },
    plugins: plugins
};