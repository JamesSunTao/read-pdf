const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config = require('./config.json');
const devMode = process.argv.indexOf('-p') === -1;

module.exports = {
  module: {
    rules: [
      // js 规则
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // css 规则
      {
        test: /\.css$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
      // .vue 规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 图片资源规则
      {
        test: /\.(png|jpg|jpeg|gif|cur|ico)$/i,
        loader: 'url-loader',
        options: {
          // 设置大小限制，超出后使用file-uploader
          limit: 8192,
          name (file) {
            if (devMode) return '[path][name].[ext]';
            return '[hash].[ext]';
          },
          outputPath: 'css/images/'
        }
      },
      // 字体资源规则
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)$/i,
        loader: 'file-loader',
        options: {
          name (file) {
            if (devMode) return '[path][name].[ext]';
            return '[hash].[ext]';
          },
          outputPath: 'css/fonts/'
        }
      },
      // 设置全局$为jQuery
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  resolve: {
    // 后缀自动补全
    extensions: ['.js', '.vue'],
    alias: {
      // vue官网有说明
      'observe': path.resolve(__dirname, 'src/assets/js/observe.js'),
      'vue$': 'vue/dist/vue.esm.js',
      'vue': 'vue/dist/vue.esm.js',
      // 定义@符号来指代src目录
      '@': path.resolve(__dirname, 'src'),
      "tip$": path.resolve(__dirname,"src/assets/js/memberTips.js"),
      "login$": path.resolve(__dirname,"src/assets/js/login.js"),
      "quote$": path.resolve(__dirname, "src/assets/js/quote.js")
    }
  },
  // 插件列表
  plugins: [
    new VueLoaderPlugin(),
    // 自动加载模块，而不必到处 import 或 require 。
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery:"jquery",
      observe:"observe"
    }),
    new webpack.DefinePlugin({
      applicationPath: config.publicPath
    })
  ]
};