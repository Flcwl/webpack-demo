const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  // entry: './src/index.js',
  entry: {
    // 多入口
    index: './src/index',
    entry: './src/entry'
  },
  output: {
    // filename: 'index.js',
    filename: '[name].bundle.js',
    // http://nodejs.cn/api/path.html#path_path_resolve_paths
    // https://www.cnblogs.com/zytt/p/9038598.html
    path: path.resolve(__dirname, 'dist')
  },

  //模块：例如解读CSS,图片如何转换，压缩
  module: {
    rules: [
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: path.resolve(__dirname, 'dist')
            }
          },
          // 缩写法
          'css-loader',
          // 与`MiniCssExtractPlugin`冲突
          // 'style-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 必须写在第一个
          {
            // 默认打包抽离统一到一个文件
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: path.resolve(__dirname, 'dist')
            }
          },
          // {
          //   loader: 'style-loader' // creates style nodes from JS strings
          // }, 
          {
            loader: 'css-loader' // translates CSS into CommonJS
          }, 
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            outputPath: 'images/'
          }
        }]
      }
    ]
  },

  //插件，用于生产模版和各项功能
  plugins: [
    // 打包HTML插件
    new HtmlWebpackPlugin({
      // https://github.com/jantimon/html-webpack-plugin#minification
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    // 抽离css插件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    })
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      })
    ],
  },

  //配置webpack开发服务功能
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
