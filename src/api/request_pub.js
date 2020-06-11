/* jshint esversion: 6 */
import { toLowerCaseObjKey } from '@/utils/index.js'
const ah = require("ajax-hook")

ah.hookAjax({
  //拦截回调
  onreadystatechange:function(xhr){
    //console.log("onreadystatechange called: %O",xhr)
  },
  onload:function(res){

    var res = toLowerCaseObjKey( $.parseJSON(res.responseText));
    
    // 判断是否有收藏权益
    if (res && res.statusCode  === 401 && res.type === 'member') {     
      var result = {
        code:res.statusCode,
        tipcontent:res.message.content,
        show:true
      }
      store.commit("setCollectShow",false);  
      store.commit("setMemberTipData",result);  
    }
  },
  //拦截方法
  open:function(arg,xhr){
    // console.log("open called: method:%s,url:%s,async:%s",arg[0],arg[1],arg[2])
  }
})

const isObject = (data) => {
  return Object.prototype.toString.call(data) === '[object Object]';
}

const logError = (param, error) => {
  console.log('参数:', param, '错误信息:', error);
};

export const request = (url, type, data) => {
  let param = {};
  if (isObject(url)) {
    param = url;
  } else {
    param.url = applicationPath + url;
  }
  param.type = type;
  param.dataType = 'json';
  if (data) param.data = data;
  return new Promise((resolve, reject) => {
    $.ajax(param).then((result) => {
      if (isObject(result) && 'code' in result && result.code !== 200) {
        logError(param, result);
      }
      // console.log("61行:");
      resolve(toLowerCaseObjKey(result));
    }).fail((err) => {
      logError(param, err);
      if (err && err.status) reject(err.status);
      else reject();
    });
  });
};

export const dealResult = (result) => {
  if (result.code === 200) {
    return result.data;
  } else {
    throw result.data;
  }
};

export const dealResultForBool = (result) => {
  if (typeof result !== 'boolean') result = dealResult(result);
  if (result) return result;
  throw result;
}

export const get = (url, data) => {
  return request(url, 'get', data);
};

export const post = (url, data) => {
  return request(url, 'post', data);
};

export default {
  request,
  get,
  post,
  dealResult,
  dealResultForBool
}