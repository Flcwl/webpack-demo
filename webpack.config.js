const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
}

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
          // 与`MiniCssExtractPlugin`作用冲突
          'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     // you can specify a publicPath here
          //     // by default it use publicPath in webpackOptions.output
          //     publicPath: path.resolve(__dirname, 'dist')
          //   }
          // },
          // When postcss-loader is used standalone (without css-loader) don't use @import in your CSS, 
          // since this can lead to quite bloated bundles
          { loader: 'css-loader', options: { importLoaders: 1 } },
          // 缩写法
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 必须写在第一个
          // {
          //   loader: 'style-loader' // creates style nodes from JS strings
          // }, 
          {
            // 默认打包抽离统一到一个文件
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: path.resolve(__dirname, 'dist')
            }
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          }, 
          {
            loader: 'less-loader' // compiles Less to CSS
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          // {
          //   loader: "style-loader"
          // }, 
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, 'dist')
            }
          },
          {
            loader: "css-loader"
          }, 
          {
            loader: "sass-loader"
          },
          'postcss-loader'
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
    }),
    // 移除未使用css代码
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    // 每次打包前清空dist文件夹（webpack4 default `<PROJECT_DIR>/dist/` will be removed.）
    new CleanWebpackPlugin()
  ],

  optimization: {
    minimizer: [
      // 生产模式其实会自动压缩代码（webpack4）
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      })
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  //配置webpack开发服务功能
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
