const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    context: __dirname,
    entry: './static/index',
    output: {
        path: path.resolve('./static/dist/'),
        filename: "[name].js",
        publicPath: '/static/dist/'
    },
    resolve: {
        alias: {
          static: path.resolve('./static/'),
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new Dotenv()
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.js$/,
                include: /node_modules/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: {
                          postcssOptions: {
                            plugins: [
                                autoprefixer()
                            ]
                          }
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', 
                        options: { 
                            importLoaders: 1,
                            import: true
                        } 
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                          postcssOptions: {
                            plugins: [
                                autoprefixer()
                            ]
                          }
                        }
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|woff|woff2|svg|eot|ttf|gif|jpe?g)$/,
                    use: [
                    {
                        loader: 'url-loader',
                        options: {
                        limit: 1000,
                        name: '[path][name].[md5:hash:hex:12].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    devServer: { 
        contentBase: ".",
        port: 7000,
        historyApiFallback: true,
        compress: false,
        hot: true,
        publicPath: '/static/dist/',
    }
}
