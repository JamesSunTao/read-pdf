/* jshint esversion: 6 */
import 'babel-polyfill'
import Vue from 'vue';
import Vuex from 'vuex';
import Es6Promise from 'es6-promise'
import '@/assets/js/zTree/css/metroStyle/metroStyle.css'
import '@/assets/js/zTree/js/jquery.ztree.all.js'
import '@/assets/js/pdf/pdfCom.js'
// 视屏
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import pdfApi from '@/api/pdf.js'
Vue.prototype.$video = Video

require('es6-promise').polyfill()
Es6Promise.polyfill()
require("layui-layer");

Vue.use(Vuex);


let videoState = {
    myPlayer:null,    
    referTitle:"音视频", 
    pdfInfo:{},
    isXMRDFile: window.InitData.isXMRDFile,
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
        type: 11,
        params: {
        },
        callback: function () {
            
        }
    },
    readIframeShow:{
        isShow:false,
        referSrc:"",
        readSrc:""
    },  // 参考文献，引证文献弹层
}
let pdfState = { 
    quoteData:{
        quoteNum:0,
        originalData:[]
    }, 
    quoteShow:false,
    isHideL:false, //左边栏的收起展开 
    isHideR:false,
    isCopy:false, // 判断文字超过100字的提示框
    myPlayer:null,    
    isXMRDFile: window.InitData.isXMRDFile,
    isXmlFile:false,
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
    showAssembly:false,
    showTopSign:false,
    QRCodeShow: false,
    initStatus:0,
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
    // PDF
    readIframeShow:{
        isShow:false,
        referSrc:"",
        readSrc:window.InitData.ApplicationPath + 'readonline.ashx?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode=' + window.InitData.dbCode + '&filesourcetype=1&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=' + '&pageType=POPPAGE#'
    },  // 参考文献，引证文献弹层
    referActive:{},
    isLimited:false,
    isRefer:window.InitData.Act,
    fsType:null,
    navShow:true,
    headerShow:true,
    fullMenu:false,
    fullNote:false,
    isDrag:false,
    fullBoxShow:false,
    isHua:true,
    isAddPeg:false,  //添加批注状态
    leftStyle:{
        width:"280px"
    },
    centerStyle:{},
    rightStyle:{},
    rightIconStyle:{},
    leftIconStyle:{},
    pdfTitleObj:{},
    pdfTitleHover:"",
    dragObj:{
        dragShow:false,
        direction:1   // 1. 左边栏拖拽 2,。右边栏拖拽
    },
    lookReferArr:[],
    sourceReferArr:[],
    referTitle:"",  //参考文献/引证文献标题
    citeCount:0, // 引证文献长度
    //对比阅读
    taskListObj:{},
    isCompare:false,
    iframSrcObj:{iframSrc1:window.InitData.ApplicationPath + 'readonline.ashx?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode=' + window.InitData.dbCode + '&filesourcetype='+window.InitData.FileSourceType+'&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=compare' + '&pageType=POPPAGE#',
        iframSrc2:""},
    compareIfrShow:false,
    //摘录
    showETopSign:false,
    colorData:{
        show:false
    },//颜色选择组件数据
    oldColorData:null, //用于判断用户操作前后是否修改color选择框
    colorTimer:null
};
let baseState = pdfState;
if (window.InitData.DcType == '11' || window.InitData.DcType == '10') {
    baseState = videoState;
}

export default new Vuex.Store({
  state:baseState,
  mutations: {
    setColorData(state,res){
        state.colorData = res;
        state.oldColorData = $.extend(true,res.comments) ;
    },  
    setColorDataShow(state,res){
        state.colorData.show = res;
    },
    keepColorBox(state,id){
        // debugger
        if (id !== state.colorData.noteId) {
            state.colorData.show = false;
        }
        clearTimeout(state.colorTimer)
    },
    setQuoteData(state,res){
        state.quoteData = res;
    },
    setQuoteShow(state,bool){
      state.quoteShow = bool;
    },
    setETopSign(state,bool){
      state.showETopSign = bool;
    },  
    closeTopSignFun(state){
        state.showETopSign = !state.showETopSign;
    },
    //标签组件显示
    signShowFun(state){
        state.collectShow = false;
        state.showAssembly = false;
        state.QRCodeShow = false;
        state.showTopSign= !state.showTopSign;
    },
    setHideL(state,bool){
        state.isHideL = bool;
    }, 
    setHideR(state,bool){
        state.isHideR = bool;
    },  
    setCopy(state,bool){
        state.isCopy = bool;
    },  
    setMyPlayer(state,res){
        state.myPlayer = res;
     },
      layerFor500(state,msg){
        layer.msg(msg,{skin:"layui-layer tip-red"});
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
        state.isOffLine = bool;
      },
      setFileType(state , bool){        
          state.isXml= bool; 
      },
      setXmlFile(state , bool){       
        state.isXmlFile= bool; 
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
      setShowAssembly(state , bool){
        state.showAssembly = bool;
    },
    setShowTopSign(state , bool){
        state.showTopSign = bool;
    },
    setQRCodeShow(state,bool){
        state.QRCodeShow = bool;
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
          state.initStatus = 0;
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
      setInitStatus(state,bool){
          debugger
        state.initStatus = bool;
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
        var dcType = window.InitData.DcType;
        var fileType = window.InitData.FileSourceType;
        state.pdfTitleObj.title = res.title !== null? res.title:"";
        var rTitle = res.title === null? "":res.title,
            rSourceType = res.resourceType === null?"":res.resourceType,
            rSource = res.source === null?"":res.source,
            rYear = res.year === null? "":res.year,
            rIssue = res.issue === null? "":res.issue,
            rPubDate = res.pubDate === null? "":res.pubDate,
            rDate = res.date === null? "":res.date,
            rPage = res.page === null? "":res.page,
            rPinyinName = res.pinyinName===null? "":res.pinyinName,
            rAlmanacName = res.almanacName === null? "":res.almanacName;
           
            var pdfTitleHover = '',pdfTitleObj={},
            navUrl="http://navi.cnki.net/KNavi/",
            dbCode = window.InitData.dbCode,
            fileName=window.InitData.fileName,
            sourceTitle=window.InitData.SourceTitle,
            authorNames=window.InitData.AuthorNames;
            var curType = "",hrefUrl="";
            
            switch(dcType) {
                case "1"://期刊
                    curType = "期刊";
                    hrefUrl = `${navUrl}JournalDetail?pcode=${dbCode}&pykm=${rPinyinName}`;
                    pdfTitleHover = `${rTitle}（${curType}）${rSource} ${rYear} ${rIssue==''?'':'（'+rIssue+'）'}` 
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rYear} ${rIssue==''?'':'('+rIssue+')'}</i>`
                    break;
                case "2"://会议
                    curType = "会议";
                    hrefUrl = `${navUrl}DPaperDetail?pcode=${dbCode}&&lwjcode=ASSC201801001&hycode=${res.code}`;
                    pdfTitleHover = `${rTitle}（${curType}）${rSource} ${rPubDate}` 
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rPubDate}</i>`
                    break;
                case "3"://报纸
                    curType = "报纸";
                    hrefUrl = `${navUrl}NPaperDetail?pcode=${dbCode}&bzpym=${res.newspaperTitle_PY}`;
                    pdfTitleHover = `${rTitle} （${curType}） ${rPubDate}`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rPubDate}</i>`
                    break;
                case "4"://博硕
                    curType = `${rSourceType}论文`;
                    hrefUrl = `${navUrl}PPaperDetail?pcode=${dbCode}&logo=${res.institutionPYCode}`;
                    pdfTitleHover = `${rTitle} （${curType}） ${rSource} ${rYear}`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rYear}</i>`
                    break;
                case "5"://kns图书
                    curType = "图书";
                    hrefUrl = `${navUrl}JournalDetail?pcode=${dbCode}&pykm=${fileName.substring(0,4)}`;
                    pdfTitleHover = `${rTitle} （${curType}） ${rYear}.${rIssue} ${rPage}`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rYear}.${rIssue}.${rPage}</i>`
                    break;
                case "6"://年鉴
                    curType = "年鉴";
                    hrefUrl = `${navUrl}YearbookDetail?pcode=${dbCode}&pykm=${rPinyinName}`;
                    pdfTitleHover = `${rTitle} （${curType}）${rAlmanacName} ${rYear}`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em><a href="${hrefUrl}" target="_blank">${rSource}</a><i>${rYear}</i>`
                    break;
                case "10"://音频 
                    curType = "音频";
                    // hrefUrl = `${navUrl+dbCode}&pykm=${rPinyinName}`;
                    pdfTitleHover = `${rTitle}（${curType}）`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em>`;
                    break;
                case "11"://视频
                    curType = "视频";
                    // hrefUrl = `${navUrl+dbCode}&pykm=${rPinyinName}`;
                    pdfTitleHover = `${rTitle}（${curType}） `
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span><em>（${curType}）</em>`;
                    break;
                default:
                    pdfTitleHover = `${rTitle}`
                    pdfTitleObj.tit1 = `<span class="study-name">${rTitle}</span>`;
                    break;
            }
        state.pdfTitleHover = pdfTitleHover;
        state.pdfTitleObj.tit1 = pdfTitleObj.tit1;
     },
      
      isDragShow(state,res){ //是否拖拽
          state.dragObj = res;
      },
      //点击小手的时候可以拖拽阅读
      isDragFun(state,res){
          state.isDrag = res;
          state.isHua = false;
      },
      // 是否支持左右边栏拖拽
      isFullBoxShowFun(state,res){
        state.isDrag = res[0];
        state.isHua = res[1];
        state.isAddPeg = res[2];
        state.fullBoxShow = res[2];
      },
      //点击选择文字
      isHuaFun(state,res){
        state.isHua = res;
        state.isDrag = false;
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
      hideFun(state){ //点击其他地方隐藏功能

        state.collectShow = false;
        state.showTopSign = false;
        state.showAssembly = false;
        state.QRCodeShow = false;
      }
  },
  actions: {
     allowToXml({state,commit}){
         
        pdfApi.getFileType({ fileName:window.InitData.fileName}).then((res) => {
            commit('setXmlFile',res.isExitFile);
          }).catch((err) => {
              //layer.msg("无法打开此文献",{skin:" layui-layer tip-orange "});
          }).finally(() => {
          });
     },
     closeColorBox({state,commit},res){
         debugger
        state.colorTimer = setTimeout(function() {
           
            commit('setColorDataShow',false);
            clearTimeout(state.colorTimer)
            var isRequest = false; //默认不请求接口
            if (state.oldColorData.noteColorIndex != res.noteColorIndex || state.oldColorData.noteOpacityIndex != res.noteOpacityIndex) {
                isRequest = true;
                console.log('请求接口')
            }
            if (res.noteType==4) {
                if (state.oldColorData.lineType != res.lineType || state.oldColorData.lineWidth != res.lineWidth) {
                    isRequest = true;
                }
                console.log('请求接口')
            }
            //debugger
            if (isRequest) {
                var _this = this;
                var editData = {
                    noteId: res.noteId,
                    type: res.noteType,
                    content:'',
                    appId: window.InitData.AppId,
                    noteColor:res.noteColor,
                    lineType:res.lineTypeIndex>4?4:res.lineTypeIndex,
                    noteOpacity:res.noteOpacity,
                    lineWidth:res.lineWidth,
                }
                pdfApi.SetEditNote(editData).then((res) => {
                    console.log("编辑笔记成功");
                }).catch((err) => {
                }).finally(() => {
                });
            }
        })       
    },
  },
  modules: {
     // pdf
  }
});
