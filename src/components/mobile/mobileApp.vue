<template>
     <div class="warp" id="pdfWarp">
        <!-- 头部over -->
        <div id="pdfApp">
            <div class="top-word-tip" v-if="showTips">当前为PDF版阅读 不支持做笔记摘录</div>
            <div class="tc isWx" id="read_midbox">
                <div id="read_over" class="read_over hand1" v-bind:style="read_overStyle"></div>
                <div class="load-box" :id="'load-box'+(index+1)" :style="div_itemStyle" v-for="(pageItem,index) in totlePageArr" :key="index">
                    <img :src="pageItem.imgSrc" alt="" />
                    <img src="../../assets/images/loading-l.gif" class="load-img" v-if="pageItem.imgLoading != 1 && initPageNo ==(index+1)" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            t1:0,
            t2:0,
            t3:0,
            timer:null,
            totlePageArr: [],
            publicPath:'' ,
            bigImgWidth: '',
            bigImgHeight: '',
            pageItemHeight: 0, //单个图片的高度
            read_overStyle: {
                height: ''
            },
            div_itemStyle: {
                height: '',
            },
            oldRecordPage: 0,
            clickMenu: false,
            initPageNo: 1,
            phoneVersion: '',
            currentCount: 1,
            // imgLoading: 0,
            windowSize: document.body.clientWidth,
            notes: [],
            showTips:true
        };
    },
    created() {
        var localDbCode = window.InitData.dbCode ||'local';
        this.publicPath = window.InitData.ImageBasePath + localDbCode + '/' + window.InitData.fileName + '/images/';
        this.appVersionFun();
        this.TotalPageFun();
        this.LoadPreNextPage(1);
        $('html,body').animate({ scrollTop: 0 }, 200);
    },
    watch: {
        windowSize (val) {
            if (!this.timer) {
                this.screenWidth = val
                this.timer = true
                let that = this
                setTimeout(function () {                 
                    that.timer = false
                }, 400)
            }
        }
    },
    mounted() {
                // 暴露给app端使用
        const _this = this;
        window.app = {};
        window.app.getPdfCatalogInfos = function(){
           // console.log('st_pdf')
            var data = {};
            data.menuType = "pdflogs";
            data.catalogs = window.jsonObj;
            return JSON.stringify(data);
        }
        window.app.LoadPdfPage= function(pageNo){
            _this.LoadPreNextPage(pageNo);
        }
        window.app.getCurrentPage = function(){
            return _this.initPageNo;
        }
        window.app.getNotes= function(){
            var data = {};
            data.menuType = "allnotes";
            data.allnotes = _this.notes;
            return JSON.stringify(data);
        }
        this.GetNotlist();
        //添加阅读历史
        this.SetReadReocdFun();
        window.addEventListener('scroll', this.pageScrollFun);
        this.getVersionFun(this.phoneVersion); //根据设备的信息，调用不同的原生方法
        
        
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                _this.windowSize = window.screenWidth
                _this.pageItemHeight = (_this.bigImgHeight * _this.windowSize) / _this.bigImgWidth;
                _this.read_overStyle.height = _this.pageItemHeight * window.InitData.pageCount + 'px';
                _this.div_itemStyle.height = _this.pageItemHeight + 'px';
            })()
        }

    },
    methods: {
        getVersionFun(version) {
            if (version == 'ios') {
                WebViewJavascriptBridge.setPdfPageNum(this.initPageNo);
            }
            if (version == 'android') {
                droid.setPdfPageNum(this.initPageNo);
            }
        },
        loadImage(index) {
            var _this = this;
            _this.totlePageArr[index].imgLoading = 1;
            if (index > 0) { return false; }
            for (var i = 1; i < window.InitData.pageCount + 1; i++) {
                if (i>1) {
                    _this.totlePageArr[i-1].imgLoading = 0;
                }
            }
           
        },
        TotalPageFun() {  //根据总页数初始化渲染页面
            var _this = this;
            for (var i = 1; i < window.InitData.pageCount + 1; i++) {
                var itemObj = {};
                itemObj.imgSrc = '';
                itemObj.pageNo = i;
                itemObj.imgLoading = 0;
                _this.totlePageArr.push(itemObj);
            }       
        },
        // 获取笔记列表
        GetNotlist() {
            var _this = this;
            $.ajax({
                url: window.InitData.ApplicationPath + "LitNotes/GetNotesByLid",
                type: "post",
                dataType: "json",
                data: {
                    appId: window.InitData.AppId,
                    literatureId: window.InitData.FileSourceType == '1' ? window.InitData.Lid : window.InitData.fileName                  
                },
                success: function (json) {
                    if (json.Code === 200) {                       
                        _this.notes = json.Data.notes;                                             
                        // alert(_this.mynotes.length);
                    }
                    else { //错误提示
                        layer.msg(json.Data)
                    }
                }
            })
        },
        ImgLazyLoad(pageNo) {  //加载页面文章
            var _this = this;
            if (_this.totlePageArr[pageNo - 1].imgLoading !== 0) {  // 若已加载，则请求终止
                return false;
            }
            _this.totlePageArr[pageNo - 1].imgLoading = 2;
            // _this.currentPageNo = pageNo;
            $.ajax({
                type: "POST",
                url: window.InitData.ApplicationPath + "File/PdfTurnPage",
                async: true,
                dataType: 'json',
                data: {
                    "hfsFileCode": window.InitData.HfsFileCode,
                    "pageIndex": pageNo,
                    "dbcode": window.InitData.dbCode,
                    "dbname": window.InitData.tableName,
                    "filename": window.InitData.fileName,
                    "tasktype": window.InitData.FileSourceType - 1
                },
                success: function (res) {
                    // debugger
                    _this.totlePageArr[pageNo - 1].imgLoading = 1;
                    _this.totlePageArr[pageNo - 1].imgSrc = _this.publicPath + res.Data.Chapter.ImageName;
                    if (pageNo == 1) {  // 根据第一页高度计算蒙层高度
                        var screeWidth = $(window).width(),
                           screeHeight = $(window).height();
                        _this.bigImgWidth = res.Data.Chapter.PageWidth;
                        _this.bigImgHeight = res.Data.Chapter.PageHeight;
                        _this.pageItemHeight = (_this.bigImgHeight * screeWidth) / _this.bigImgWidth;
                        _this.read_overStyle.height = _this.pageItemHeight * window.InitData.pageCount + 'px';
                        _this.div_itemStyle.height = _this.pageItemHeight + 'px';
                    }
                },
                error: function (data) {
                    // if (data.responseText.indexOf("login") > 0) {
                    //     window.location.href = data.responseText;
                    // }
                    // else {
                    //     layer.msg('获取数据异常！');
                    // }
                    layer.msg('获取数据异常！');
                }
            });
        },
        // 添加至最近阅读记录
        SetReadReocdFun() {
            // debugger
            $.ajax({
                url: window.InitData.ApplicationPath + "Common/AddReadReocd",
                type: "post",
                dataType: "json",
                data: {
                    appId: window.InitData.AppId,
                    dbCode: window.InitData.dbCode,
                    tableName: window.InitData.tableName,
                    fileName: window.InitData.fileName,
                    fileSrcType: window.InitData.FileSourceType                  
                },
                success: function (json) {
                    if (json.Code === 500) {
                        //console.log($.i18n('RequestMiss'));
                    } else if (json.Code === 200) {
                       // console.log(json.Data);
                    }
                    var systemInfo = window.navigator.userAgent;
                    var systemInfoLower=systemInfo.toLowerCase();
                    if(/android/i.test(systemInfoLower)==true){
                        droid.readHistory(JSON.stringify(json));
                    }
                    if(/iphone|ipad/i.test(systemInfoLower)){
                        window.webkit.messageHandlers.readHistory.postMessage(JSON.stringify(json));
                    }
                },
                error: function (json) {
                    
                }
            })
        },
        //加载指定页码的页（如果已经存在，则忽略）  
        LoadMPage(pageInfo) {
            var _this = this;
            var pageNo = pageInfo.pageNo,t3 = pageInfo.time;
           // console.log('pageNo:'+pageNo+"-----"+'t3:'+t3)
            if (t3<2) {
                return false;
            }
            for (var i = Number(pageNo) - 1; i <= Number(pageNo) + 1; i++) {
                if (i > 0 && i <= window.InitData.pageCount) {
                     _this.ImgLazyLoad(i);
                }
            }           
        },
        //加载指定页码及上下页  basicInfo.LoadPreNextPage(8);
        LoadPreNextPage(pageNo) {
            var _this = this;
            var scrollHeight = (pageNo - 1) * _this.pageItemHeight;
            _this.initPageNo = pageNo;
           _this.LoadMPage({pageNo:pageNo,time:6});
            $("body,html").scrollTop(scrollHeight);   // 把指定页置顶                                 
        },

        pageScrollFun() {
            var _this = this;
            var screeHeight = $(window).height(),
                 scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var curPage = (screeHeight + scrollTop + 200) / _this.pageItemHeight;    //判断当前展示几张图片    
                curPage = Math.ceil(curPage);
            if((curPage-1) === _this.initPageNo){
                _this.t2 = new Date().getTime()
                _this.t3 = (_this.t2 - _this.t1)/1000;     
            } 

           if (curPage>1) {
               _this.showTips = false;
           }
            if (curPage <= window.InitData.pageCount) {   
                _this.initPageNo = curPage - 1;
                _this.t1 =  _this.t2;                                  
                _this.LoadMPage({pageNo:_this.initPageNo,time:_this.t3});            
            }
            _this.timer = setTimeout(function () {
                // 无滚动事件触发，认为停止滚动了
                // ... 做你想做的事情，如回调处理
               // console.log('stoping：'+ _this.initPageNo)
                _this.LoadMPage({pageNo:_this.initPageNo,time:3})
            }, 1000);
        },
        appVersionFun() {
            var _this = this;
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                _this.phoneVersion = 'android';
            } else if (isIOS) {
                _this.phoneVersion = 'ios';
            }
        },
    }
}

</script>
<style>
      html {
   overflow-x:hidden;
}
   * {
            margin: 0;
            padding: 0;
        }

        img {
            width: 100%;
        }

        #pdfApp {
            position: relative;
            width: 100vw;
        }

        #read_over {
            position: absolute;
            width: 100%;
            background: rgba(0,0,0,0);
            z-index: 4;
            zoom: 1;
            min-height: 100vh;
        }

        .load-box {
            position: relative;
        }

        .load-box .load-img {
            position: absolute;
            width: 60px;
            height: 60px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto; /*display:none;*/
        }

        .rangeBox {
            position: fixed;
            background: rgba(0,0,0,0.5);
            padding: 20px 80px;
            bottom: 0;
            height: 70px;
            left: 0;
            box-sizing: border-box;
            z-index: 10;
        }
.app-bottom {position: fixed;bottom: 0;left: 0;right: 0;padding:0 12px;overflow:hidden;height: 60px;background: #fff;box-shadow: 0 0 20px rgba(174,183,198,.46);z-index: 111;}
.app-bl {float: left;width: 130px;height: 50px; margin-top: 2px;
         background: url('/read/Content/Images/discussMobile/yx-logo-app.png') no-repeat;background-size: cover;}
.app-br{float:right;display:block;width:125px;height:45px;margin-top: 7px;line-height: 45px;text-align: center;font-size:17px;text-decoration:none; color:#fff;background:#4c8bf5;border-radius:45px;}
.top-word-tip {
    text-align: center;
    padding: 8px 10px;
    color: #fff;
    font-size: 14px;
    background: #BDBDBD;
}
</style>