/* jshint esversion: 6 */ 
import api from '@/api/public/extract.js';
import store from '@/store/index.js';

// 我的摘录
const extractModule = {
  namespaced: true,
  state: {
    
    // 列表
    list: [],
    // 每页大小
    pageSize: 25,
    // 总数
    count: 0,
    // 显示最大条数
   // max: 50,
    // 等待
    loading: false,
    isAllExact:true
  },
  mutations: {
    setAllExact(state,bool){
      state.isAllExact = bool;
      state.list = [];
    },
    //添加标签
      addExtractInfo(state,res){
         res.content = decodeURIComponent( res.content);
         res.title = decodeURIComponent( res.title);
         res.noteExts = [];
         state.list.unshift(res);
         state.count = state.count+1;
         var extractTimer =  setTimeout(function () {
          $(".abstract-wrap #js-scrollContainer #js-ulRightExtracts").find('img').popImg();
          clearTimeout(extractTimer);
      }, 1000);
        
      },
    // 设置我的摘录列表
    setExtractInfo(state, { count, data }) {
      // 当前第几页剩余几条
      let over = state.list.length % state.pageSize;
      state.list = state.list.concat(data.slice(over));
      state.count = count;
      var extractTimer =  setTimeout(function () {
           $(".abstract-wrap #js-scrollContainer #js-ulRightExtracts").find('img').popImg();
           clearTimeout(extractTimer);
       }, 1000);
    },
    // 移除索引对应的摘录
    removeExtract(state, index) {
      state.list.splice(index, 1);
      state.count = state.count-1;
      layer.msg("摘录删除成功！",{skin:" layui-layer tip-green "});
      setTimeout(function () {
        $("#js-ulRightExtracts img").popImg();
    }, 1000);

    },
    // 打开文献来源
    gotoResource(state, index) {
      if(index >= state.list.length) return;
      let extract = state.list[index];
      let dbcodeName = extract.dbCode, fileName = extract.fileName, tableName = extract.tableName, fileSourceType = extract.fileBusinessSource, topic = extract.studyId, appId = window.InitData.AppId, taskId = extract.taskId;
      window.open(applicationPath + 'readonline.ashx?filename=' + fileName + '&tablename=' + tableName + '&dbcode=' + dbcodeName + '&fileSourceType=' + fileSourceType + '&taskId=' + taskId + '&from=&groupid=&topic=' + topic + '&appId=' + appId);
    }
  },
  actions: {
    // 获取我的摘录
    getExtractList({ state, commit }) {
     // debugger
      if( state.loading) return;
      // 当前处于第几页
      let index = Math.floor(state.list.length / state.pageSize);
      state.loading = true;
      api.getExtractList({
        pageIndex: index + 1,
        pageSize: state.pageSize,
        dbCode:state.isAllExact?'':window.InitData.dbCode,
        tableName:state.isAllExact?'':window.InitData.tableName, 
        fileName:state.isAllExact?'':window.InitData.fileName
      }).then((data) => {
        commit('setExtractInfo', data);
      }).catch((err) => {
        // 提示信息
      }).finally(() => {
        state.loading = false;
      });
    },
    // 删除我的摘录
    delExtract({ state, commit }, index) {
      if(index >= state.list.length) return;
      state.loading = true;
      layer.confirm('<p class="layui-p">' + '你是否要删除' + '</p>', { icon: 3, title: '提示' }, function (e) {
      api.delExtract({
        centoId: state.list[index].centoId
      }).then(() => {
        commit('removeExtract', index);
      }).catch((err) => {

      }).finally(() => {
        state.loading = false;
      });
     });
    }
  },
}

export default extractModule

if(store.state.extract) store.unregisterModule('extract');
store.registerModule('extract', extractModule);