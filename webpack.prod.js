const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require("webpack-merge");
const common = require('./webpack.common.js');
const config = require('./config.json');

const intputDirectory = path.resolve(__dirname, 'src');
const outputDirectory = path.resolve(__dirname, 'dist');

const publicPath = common.publicPath;


module.exports = merge(common, {
  devtool: false,//'source-map'
  mode: 'production',
  entry: {
    pdf: path.resolve(intputDirectory, 'views/pdf/pdf.main.js'),
    video: path.resolve(intputDirectory, 'views/video/video.main.js'),
    loading: path.resolve(intputDirectory, 'views/loading/loading.main.js'),
    mobile: path.resolve(intputDirectory, 'views/mobile/mobile.main.js'),
    vendor: ['jquery', 'vue', 'vue-router', 'vuex','element-ui']
  },
  output: {
    path: outputDirectory,
    filename: 'js/[name]-[chunkhash:6].js',
    publicPath: config.publicPath //config.publicPathX (更新X)
  },
  externals:  {
    quote: 'quote',
    

  }, 

  plugins: [
    new CleanWebpackPlugin(['js', 'css'], {
      root: outputDirectory,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(intputDirectory, 'views/pdf/index.cshtml'),
      filename: path.resolve(outputDirectory, 'Views/Article/PdfOnline.cshtml'),
      chunks: ['vendor', 'pdf'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(intputDirectory, 'views/video/index.cshtml'),
      filename: path.resolve(outputDirectory, 'Views/Article/videOnline.cshtml'),
      chunks: ['vendor', 'video'],
    }),
    
    new HtmlWebpackPlugin({
      template: path.resolve(intputDirectory, 'views/loading/index.cshtml'),
      filename: path.resolve(outputDirectory, 'Views/Article/PdfLoading.cshtml'),
      chunks: ['vendor', 'loading'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(intputDirectory, 'views/mobile/index.cshtml'),
      filename: path.resolve(outputDirectory, 'Views/Article/PdfOnlineMobile.cshtml'),
      chunks: ['vendor', 'mobile'],
    }),
    // css 插件
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[chunkhash:6].css',
      chunkFilename: 'css/[id]-[chunkhash:6].css',
    })
  ]
});
