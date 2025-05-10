const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');


module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        clean: true,
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@kurkle/color': path.resolve(__dirname, 'node_modules/@kurkle/color/dist/color.esm.js'),
            'chart.js': path.resolve(__dirname, 'node_modules/chart.js')
        },
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            baseUrl: "/"
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/styles.min.css',
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.js", to: "js"},
                {from: "./node_modules/@kurkle/color/dist/color.esm.js", to: "js" },
                {from: "./src/fonts", to: "fonts"},
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
    },
};