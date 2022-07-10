const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: "./src/index.jsx",
    output: {
        path: __dirname + '/public',
        filename: "bundle.js",
        publicPath: '/public/'
    },
    module: {
        rules: [
            {
                test: /\.js|.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/react', '@babel/env']
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoader: 2
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'app.css', allChunks: true })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
}