const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require("webpack-merge");
const common = require('./webpack.common.js');

const intputDirectory = path.resolve(__dirname, 'src');
const outputDirectory = path.resolve(__dirname, 'dist');
const entryPage = process.env.ENTRY_PAGE;
//不同浏览器存放cookie的对象
const cookieMap = {};

//去掉域名的sso登录地址  http://x.dev.cnki.net/search/Home/HomePage/?value=backLogin&w=&returnurl=
const ssoUrl = '/sso/login?appid=CRSP_READ_DEV';
//默认打开页，为空时写'/'
const openPage = `/${entryPage}.html`;
<<<<<<< HEAD
const AID = 'WEFiRVgwQ3dIa0NaV1NPU2xZMHVHeUVzdUcwd3NKcHFXU2ZHMjd5bVNDbWxGN3p2K0E9PQ==$AiWoHpiIFemjkobJ8Uj5EeA58Y7hIlZxAAPHTB99ismvcad5gYEA5g!!';
=======
const AID = 'WEFiRVgwQ3dIa0NaV1NPU2xZMHVHeUVzdUcwd3NkOU1XYzNvT3AwWkxRUWRMc2ozY2c9PQ==$AiWoHpiIFemjkobJ8Uj5EeA58Y7hIlZxAAPHTB99ismvcad5gYEA5g!!';
>>>>>>> af72f98bd8bc8b590703e31867811a2f4acdb4a2
// 设置cookie
const setCookie = (userAgent, cookies) => {
  let map = cookieMap[userAgent] || {};
  cookies.forEach((cookie) => {
    let [string, key, value] = cookie.match(/^(.*?)=(.*?);/);
    if(key == 'AID'){
      map[key] = AID;
    }else{
      map[key] = value;
    } 
  });
  cookieMap[userAgent] = map;
}

// 获取cookie
const getCookie = (userAgent) => {
  let map = cookieMap[userAgent] || {};
  let cookie = '';
  
  for(let key in map) {
   
    cookie += `${key}=${map[key]};`
  }
  
  return cookie;
} 
module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: path.resolve(intputDirectory, `views/${entryPage}/${entryPage}.main.js`),
    vendor: ['jquery', 'vue', 'vue-router', 'vuex']
  },
  output: {
    path: outputDirectory, 
    filename: 'js/[name]-[hash:8].js'
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    progress: true,
    open: true,
    proxy: [{
      context: ["/read","/XmlEditor","/psmc"],
      target: "http://x.dev.cnki.net",
      changeOrigin: true,
      // 监听代理请求，将cookie插入到请求头
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('Cookie', 'AID='+AID);
      },
      // 监听代理返回，将返回头中的cookie存起来
      onProxyRes(proxyRes, req, res) {
        if(proxyRes.headers['set-cookie']) {
          setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
        }
      } 
    },
     {
      context: ['/sso'],
      target: "http://sso.dev.cnki.net",
      changeOrigin: true,
      onProxyRes(proxyRes, req, res) {
        if(proxyRes.statusCode === 302) {
          if(proxyRes.headers['set-cookie']) {
            setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
          }
          proxyRes.headers['Location'] = openPage;
        }
      }
    },
     {
      context: ['/'],
      bypass: function(req, res, proxyOptions) {
        if (req.url === '/' && !cookieMap[req.get('User-Agent')]) {
         res.redirect(openPage);
          return true;
        } else if (/^\/login/.test(req.url)) {
          delete cookieMap[req.get('User-Agent')];
         res.redirect(openPage);
        //  res.redirect(ssoUrl);
          return true;
        }
      }
    }
  ]
  },  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(intputDirectory, `views/${entryPage}/index.html`),
      filename: `${entryPage}.html`,
      chunks: ['vendor', 'main']
   })
  ]
});
