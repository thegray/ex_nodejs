var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, 'public/'),
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
                    presets: ['react', 'es2015']
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
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
};