/* jshint esversion: 6 */
import 'babel-polyfill'
import Vue from 'vue';
import Vuex from 'vuex';
import Es6Promise from 'es6-promise'
// import api from '@/api/index.js'
import '@/assets/js/zTree/css/metroStyle/metroStyle.css'
import '@/assets/js/zTree/js/jquery.ztree.all.js'

// 视屏
import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

require('es6-promise').polyfill()
Es6Promise.polyfill()
require("layui-layer");
Vue.use(Vuex);

// video 数据
let videoState = {
    myPlayer:null,    
}
let pdfState =  {  
    isXMRDFile: window.InitData.isXMRDFile,
    memberTipData:{
        code:"",
        show:false,
        lang:window.locale,
        showform:'mask',
        environment:'dev',

    },
    isOffLine:false,
    isXml:true,
    fileSType:window.InitData.FileSourceType,
    isSingleCollect:true,
    //收藏配置
    referCollectClass:false,
    collectShow:false, // 是否显示收藏弹出框
    options:{  // 收藏的选项参数
        title: '收藏到',
        lang:"zh",
        cssConfig: {
            position:"absolute",
            right:"25px",
            width:"462px"
        },
        type: 3,
        params: {
        },
        callback: function () {
            
        }
    },
    isEstudy:window.InitData.Act,
    isTreeCatalog:window.InitData.isTreeCatalog.toLocaleLowerCase() == 'true'?true:false,

   
};
let baseState = pdfState;
if (window.InitData.articleType == 'video') {
    baseState = Object.assign(videoState,pdfState);
}

export default new Vuex.Store({
  state:baseState,
  mutations: {
    setMyPlayer(state,res){
        state.myPlayer = res;
     },
      closeTip(state){
        state.memberTipData.code = "";
        state.memberTipData.show = false;
      },
      setMemberTipData(state,res){
          state.memberTipData.code = res.code;
          state.memberTipData.show = res.show;
          state.memberTipData.tipcontent =  res.tipcontent;
      },
      setOffLine(state , bool){
        //   debugger
        state.isOffLine = bool;
      },
      setFileType(state , bool){        
          state.isXml= bool;
      },
      singleCollect(state , res){
          state.isSingleCollect= res;
      },
      setReferActive(state , res){
          state.referActive.type = res.type;
          state.referActive.index = res.index;

      },
      setCollectShow(state , bool){
          state.collectShow = bool;
      },
      setReferCollectClass(state , bool){
          state.referCollectClass = bool;
      },
      setCiteCount(state , count){
          state.citeCount = count;
      },
      //对比阅读相关
      setTaskInfo(state , res){
          res.taskListArr.map(function (item) {
              if (item.subTaskInfos.length != 0){
                  item.showChild = true;
              }else{
                  item.showChild = false;
              }
          })
          state.taskListObj = res;
      },
      //设置对比阅读另一篇文献的详细信息
      setIframSrcInfo(state,res){
          state.iframSrcObj.iframSrc2 = res;
      },
      setCompare(state,res){
          state.isCompare = res;
      },
      setCompareIfrShow(state,res){
          state.compareIfrShow = res;
      },
      //pdf相关
      setReferTitle(state,res){
          state.referTitle = res;
      },
      setReadIframeShow(state,res){
          state.readIframeShow = res;
      },
      setFsType(state,res){
          state.fsType = res;
      },
      setLimited(state,res){
            state.isLimited = res;
      },
      setLookRefer(state,res){
          state.lookReferArr = res;
      },
      setSourceRefer(state,res){
          state.sourceReferArr = [];
          state.sourceReferArr.push(...res);
      },
      setPdfInfo(state,res) {
          state.pdfInfo = res;
          var hrefTilu = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=' + window.InitData.dbCode + '&pykm=' + window.InitData.fileName.substring(0, 4);
          state.pdfInfo.hrefTilu = hrefTilu;
      },
      // 是否支持左右边栏拖拽
      isDragShow(state,res){ //是否拖拽
          state.dragObj = res;
      },
      //点击小手的时候可以拖拽阅读
      isDragFun(state,res){
          state.isDrag = res;
      },
      setHideTop(state,res){ //隐藏nav
          if(res === true){
              state.navShow = true;
          }
          window.setTopClear =  setTimeout(function () {
              window.clearTimeout(window.setTopClear);
              state.navShow = false;
          }, 3000)

      },
      showArtTop(state,res){ //全屏隐藏nav
          state.fullMenu = false;
          state.fullNote = false;
          state.headerShow = res;
          if(res === false){
              $(".pdfFullBox").addClass("pdfFull_active");
          }else{
              $(".pdfFullBox").removeClass("pdfFull_active");
          }
      },
      showFullMenu(state,res){ //全屏目录
          state.fullNote = false;
          state.fullMenu = res;
      },
      showFullNote(state,res){ //全屏笔记
          state.fullMenu = false;
          state.fullNote = res;
      },
      setLeftStyle(state,res){
          state.leftStyle = {
              "width":res.width,
              "left":res.left
          };
      },
      setCenterStyle(state,res){
          state.centerStyle = {
              "left":res.left,
              "right":res.right,
          };
      },
      setRightStyle(state,res){
          state.rightStyle = {
              "right":res.right,
              "width":res.width
          };
      },
      setRightIconStyle(state,res){
          state.rightIconStyle = {
              "left":res.left,
              "transform":res.transform
          };
      },
      setLeftIconStyle(state,res){
          state.leftIconStyle = {
              "right":res.right,
              "transform":res.transform
          };
      },

      // Xml相关
      loading (){
          index = layer.load();
          this.state = "load";
      },
      loadingDone (){
          layer.close(index);
          this.state = "done";
      },
  },
  actions: {

  },
  modules: {
     // pdf
  }
});
