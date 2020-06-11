<template>
    <div class="pdfRight_box">
        <div class="r-hide" v-show="curIndex==1">
            <ul class="note-ul">
                <li class="note-li" :class="[noteItem.id]" v-for="(noteItem , liIndex) in noteList" :key="noteItem.id" :noteId="noteItem.id" @click="findSameNote(liIndex,noteItem.type , noteItem.id,noteItem.location)">
                    <div class="li-top">
                        <span class="cg9">{{noteItem.createTime}}</span>
                        <div class="ico-box-r">
                            <a href="#" title="编辑" v-if="noteItem.type != 4" @click.stop="editNote(noteItem.id)">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edtor"></use>
                                </svg>
                            </a>
                            <a href="#" title="标签" v-if="noteItem.type == 4" @click.stop="addNSigns(noteItem,liIndex)">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-xinjianbiaoqian"></use>
                                </svg>
                            </a>
                            <a href="#" title="删除" @click.stop="delNote(noteItem,liIndex)">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-del1"></use>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="n-m">
                        
                        <!-- <span v-if="noteItem.type==10"><img :src="noteItem.quote" /></span> -->
                        <span  v-html="noteItem.quote"  class="i"></span>
                    </div>
                    <div class="n-m" v-if="noteItem.noteExts && noteItem.noteExts.length">
                        <span class="bfc-l">
                            <span class="cy">标签：</span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tag"></use>
                            </svg>
                        </span>
                        <div class="ovhide">
                            <span class="mark-sm" v-for="(noteExtItem,index) in noteItem.noteExts" :key="index">{{noteExtItem.signName}}</span>
                        </div>
                    </div>
                    <div class="li-bottom">
                        <span class="fl" v-if="noteItem.type==12">批注：</span>
                        <span class="fl" v-if="noteItem.type==3">笔记：</span>
                        <span v-html="noteItem.content"></span>
                    </div>
                </li>
            </ul>
        </div>

        <!--参考文献-->
        <div class="r-hide" v-if="curIndex==2 && isFileSourceType === '1'">
            <div class="top-form"  v-show="lookReferArr.length>0&&lookReferArr.length!==null">
                <span class="check-f" >
                    <input type="checkbox" value=""  v-model="isCheckAll"  @click="checkAll">
                    <u class="check"></u>
                </span>
                <span class="check-word" v-show="collectArr.length == 0">全选</span>
                <span class="check-word" v-show="collectArr.length>0">已选<span class="co">{{collectArr.length}}</span>篇</span>
                <a href="#" class="a-m10" @click="clearChoose">清空</a>
                <a href="#" class="btn btn-blue btn-collect-sm ml5" @click.stop="collectTo" v-show="collectArr.length>0">
                    <span>收藏到</span>
                </a>
            </div>
            <ul class="note-list">
                <li v-for="(item ,index) in lookReferArr"  :key="item.id">
                    <span class="check-f">
                        <input type="checkbox" v-model="collectArr" :value="item">
                        <u class="check"></u>
                    </span>
                    <!--不可点击时追加该样式名
                    <span class="check-f disable">
                        <input type="checkbox" value="">
                        <u class="check"></u>
                    </span>-->
                    <a href="#" v-bind:id="item.id" @click="getFileTypeFun(item,index)" v-if="!!item&&!!item.type">
                        [{{index+1}}]
                        {{item.author}}.{{item.title}}[{{item.type?item.type.substr(0,1):""}}].<span v-if="item.source">{{item.source}},</span><span v-if="item.year">{{item.year}}</span>
                        <span v-if="item.volumn">,{{item.volumn}}</span><span v-if="item.issue">({{item.issue}})</span><span v-if="item.pageNumber">:{{item.pageNumber}}</span>.
                    </a>
                    <div class="note-tr-i">
                        <a href="#" title="引用" @click="isLoginout(item)">
                            <svg class="icon vm" aria-hidden="true">
                                <use xlink:href="#icon-iconyinyong1"></use>
                            </svg>
                        </a>
                        <span class="ml5" title="笔记数目">
                            <svg class="icon vm" aria-hidden="true"><use xlink:href="#icon-note1"></use></svg>
                            <span class="cg9 vm">{{item.noteCount}}</span>
                        </span>
                    </div>
                </li>
                <li class="refe-more"><a href="#" @click="goMoreCnkiNode('refer')">更多参考文献&gt;&gt;</a></li>
            </ul>
        </div>

        <!--引证文献-->
        <div class="r-hide citedLit" v-if ="curIndex==3 && isFileSourceType === '1'">
            <div class="top-form"  v-show="sourceReferArr.length>0&&sourceReferArr.length!==null">
                <span class="check-f" >
                    <input type="checkbox" value=""  v-model="isCheckAll"  @click="checkAll">
                    <u class="check"></u>
                </span>
                <span class="check-word"  v-show="collectArr.length == 0">全选</span>
                <span class="check-word" v-show="collectArr.length>0">已选<span class="co">{{collectArr.length}}</span>篇</span>
                <a href="#" class="a-m10" @click="clearChoose">清空</a>
                <a href="#" class="btn btn-blue btn-collect-sm ml5" @click.stop="collectTo" v-show="collectArr.length>0">
                    <span>收藏到</span>
                </a>
            </div>
            <ul class="note-list">
                <li  v-for="(item,index) in sourceReferArr" :key="item.id">
                     <span class="check-f">
                        <input type="checkbox" v-model="collectArr" :value="item">
                        <u class="check"></u>
                    </span>
                    <a href="#" v-bind:id="item.id"   @click="getFileTypeFun(item,index)">
                        [{{index+1}}]
                        {{item.author}}.{{item.title}}[{{item.type?item.type.substr(0,1):""}}].<span v-if="item.source">{{item.source}},</span><span v-if="item.year">{{item.year}}</span>
                        <span v-if="item.volumn">,{{item.volumn}}</span><span v-if="item.issue">({{item.issue}})</span><span v-if="item.pageNumber">:{{item.pageNumber}}</span>.
                    </a>
                    <div class="note-tr-i">
                         <a href="#" title="引用" @click="isLoginout(item)">
                            <svg class="icon vm" aria-hidden="true">
                                <use xlink:href="#icon-iconyinyong1"></use>
                            </svg>
                        </a>
                        <span class="fr f12 ml5" title="笔记数目">
                            <svg class="icon vm" aria-hidden="true"><use xlink:href="#icon-note1"></use></svg>
                            <span class="cg9 vm">{{item.noteCount}}</span>
                        </span>
                    </div>
                </li>
                <li class="refe-more"><a href="#"  @click="goMoreCnkiNode('cite')">更多引证文献&gt;&gt;</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import PdfAllNote from  '../pdf/PdfAllNote.vue'
    import pdfApi from '@/api/pdf.js'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    import ueditorData from '@/store/modules/pdf/UeditorStore.js'
    import topSign from '@/store/modules/public/topSign.js'
    export default {
        name: "rightContent",
        props:['curIndex'],
        components: {
            PdfAllNote
        },
        data(){
            return {
                navList:[{"name":"我的笔记","num":0},{"name":"参考文献","num":0},{"name":"引证文献","num":0},{"name":"全文笔记","num":0}],
                cur:0,
                isFileSourceType:window.InitData.FileSourceType,
                oldSignsArr:[],
                initSignsIdArr:[],
                isCur:null,
                citeIndex:1,
                isMoreActive:false,
                isCheckAll:false,
                collectArr:[], // 收藏文献的信息
            }
        },
        computed: {
            ...mapState( ["isHideR","citeCount","rightIconStyle","lookReferArr","sourceReferArr","referActive",'isRefer','options','referType']),
            ...mapState('pdfData', ["addNoteItem","noteList","pageArr"]),
            ...mapState('ueditorData', Object.keys(ueditorData.state)),
                  ...mapState('topSign', Object.keys(topSign.state)),

        },
        watch:{
            collectArr(){
                var curArr = [];
                if(this.curIndex == 2){
                    curArr = this.lookReferArr;
                }else if (this.curIndex == 3) {
                    curArr = this.sourceReferArr;
                }
                if(this.collectArr.length == curArr.length){
                    this.isCheckAll = true;
                }else{
                    this.isCheckAll = false;
                }
            },
            curIndex(){
                this.collectArr = [];
                this.isCheckAll = false;
            },
             watchNSigns(val){
                 var _this = this;
                if (val == null) {
                    return false;
                }else if(val.type == 1){
                    if ( this.noteList[val.index].noteExts == null) {
                        this.noteList[val.index].noteExts = [];
                    }
                    this.noteList[val.index].noteExts.push(val.val)
                }else if (val.type == -1) {
                    this.noteList[val.index].noteExts.map(function(item,index) {
                        if (val.delId === item.signId) {               
                            _this.noteList[val.index].noteExts.splice(index, 1);
                        }
                    })
                }       
                
            }
        },
        created(){
            var _this = this;
            window.addEventListener('message', function (e, data) {
                
                if (e.data == '' || e.data.type == "webpackWarnings") {
                    return false;
                }
                var updata = JSON.parse(e.data);
                if(updata.isUpdateNote){
                       // if (_this.isRefer != 'refer') {return false;}
                    if(_this.curIndex === 2){
                        _this.lookReferArr[_this.referActive.index].noteCount ++ ;
                        _this.lookReferArr[_this.referActive.index].referNote.push(e.data);
                    }else if(_this.curIndex === 3){
                        _this.sourceReferArr[_this.referActive.index].noteCount ++ ;
                        _this.sourceReferArr[_this.referActive.index].citeNote.push(e.data);
                    }
                }
            
            }, false);
        },
        mounted(){
               // 所有笔记获取showType
               this.getAllNotes();

               // 参考文献
               this.getLookRefer();

               // 引证文献
               this.getSourceRefer();
               if ($(".study-r .note-ul").find('img') && $(".study-r .note-ul").find('img').length>0) {
                    var noteTimer1 = setTimeout(function () {
                    $(".study-r .note-ul").find('img').popImg();
                    clearTimeout(noteTimer1);
                }, 1000);
               }
              
        },
        methods:{
            ...mapMutations('topSign', Object.keys(topSign.mutations)),
            ...mapActions('topSign', Object.keys(topSign.actions)),
            ...mapMutations(['setQuoteShow','setQuoteData',"setETopSign","setFileType","singleCollect","setReferCollectClass","setCollectShow","setCiteCount","setReferActive","setRightStyle","setCenterStyle","setRightIconStyle","isDragShow","setLookRefer","setSourceRefer","setReadIframeShow","setReferTitle"]),
            ...mapMutations('pdfData', ["setNoteList","delNoteFun"]),
            ...mapMutations('ueditorData', ["setUeContent","getUeContent","setTopSigns","clearTopSign"]),
            showType(index){
                this.cur = index;
            },
            //更多参考引证文献跳转
             goMoreCnkiNode(addr) {
                window.open(window.CnkiNode + '/KCMS/detail/detail.aspx?dbcode=' + window.InitData.dbCode
                    + '&dbname=' + window.InitData.tableName + '&filename=' + window.InitData.fileName+'&IsLiterature='+addr);
            },
             isLoginout(item){
                var _this = this;
                  pdfApi.getForReasonableTips({}).then((res) => {
                   
                _this.myQuote(item);
                }).catch((err) => {
                }).finally(() => {
                });
            },
            //引用
            myQuote(item){
                var quoteObj = {
                    quoteNum:0,
                    originalData:[{
                        'DbCode': item.dbCode, 	 
                        'TableCode': item.tableName, 	 
                        'FileCode': item.fileName, 	 
                        'FileSourceType': window.InitData.FileSourceType

                    }]                    
                }
                this.setQuoteData(quoteObj);
                this.setQuoteShow(true);
            },
            //添加划线笔记标签
            addNSigns(item,index){
                var signObj = {
                    objId:item.id,
                    type:2,
                    index:index
                }
                this.setTopSignArr([]);
                this.setETopSign(true);
                this.getSigns(signObj);
            },
            //我的笔记
            getAllNotes(){
                var _this = this;
                pdfApi.GetNotes({
                    "appId": window.InitData.AppId,
                    "literatureId": window.InitData.FileSourceType == '1' ? window.InitData.Lid : window.InitData.fileName
                }).then((res) => {
                    _this.setNoteList(res.notes);
                }).catch((err) => {
                }).finally(() => {
                });
            },
            // 参考文献
            getLookRefer(){
                var _this = this;
                pdfApi.GetRefer({
                    "appId": window.InitData.AppId,
                    "dbcode": window.InitData.dbCode,
                    "tablename": window.InitData.tableName,
                    "filename": window.InitData.fileName,
                    "type": 1,
                    "page": 1,
                }).then((res) => {
                    res.refer.map(function (item) {
                        item.showReferNoteFlag = false;
                        item.noteCount = 0
                        item.referNote = [];
                        if(res.allReferNotes.length > 0&&res.allReferNotes.length!==null){
                            res.allReferNotes.map(function (note) {
                                if (note.sourceId === item.dbCode + '|' + item.fileName) {
                                    item.noteCount += 1;
                                    item.referNote.push(note);
                                }
                            });
                        }
                    })
                    _this.setLookRefer(res.refer);
                }).catch((err) => {
                }).finally(() => {
                });
            },
            //引证文献
            getSourceRefer(){
                var _this = this;
                pdfApi.GetRefer({
                    "appId": window.InitData.AppId,
                    "dbcode": window.InitData.dbCode,
                    "tablename": window.InitData.tableName,
                    "filename": window.InitData.fileName,
                    "type": 3,
                    "page": 1,
                }).then((res) => {
                        _this.setCiteCount(res.count);
                        res.refer.referenceInfoList.map(function (item) {
                        item.showReferNoteFlag = false;
                        item.noteCount = 0
                        item.citeNote = [];
                        if(res.allCiteNotes.length > 0){
                            res.allCiteNotes.map(function (note) {
                                if (note.sourceId === item.dbCode + '|' + item.fileName) {
                                    item.noteCount += 1;
                                    item.citeNote.push(note);
                                }
                            });
                        }
                    })
                    _this.setSourceRefer(res.refer.referenceInfoList);
                }).catch((err) => {
                }).finally(() => {

                });
            },
            // 滚动加载更多 引证文献
            showMoreCites() {
                var h = $(".citedLit").height();//div可视区域的高度
                var sh = $(".citedLit")[0].scrollHeight;//滚动的高度
                var st = $(".citedLit")[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离

                if (h + st+150 >= sh) {
                    if (this.citeIndex <= Math.ceil(this.citeCount / 20 )) {
                        this.getSourceRefer();
                    }
                }
            },
            //删除笔记
            delNote(note,item){
                var _this = this;
                layer.confirm('<p style="margin-bottom: 35px;">您是否要删除这条笔记?</p>', { icon: 3, title: '提示' }, function (index) {
                    pdfApi.delNote({
                        noteId: note.id,
                        appId: window.InitData.AppId
                    }).then((res) => {

                        _this.delNoteFun(item);
                        // _this.$message({
                        //     message: '删除笔记成功',
                        //     type: 'success'
                        // });
                        layer.msg("删除成功",{skin:" layui-layer tip-green "})
                        var pageNo = note.sectionId.replace("load-box","") - 1 ;
                        // $("#read_midbox .load-box").find("."+note.id).remove();
                        if (note.type === 3){
                            _this.pageArr[pageNo].curNoteArr =  _this.pageArr[pageNo].curNoteArr.filter(function (item) {
                                return item.noteId !=  note.id;
                            })
                        }else if(note.type === 4){
                            _this.pageArr[pageNo].curLineArr =  _this.pageArr[pageNo].curLineArr.filter(function (item) {
                                return item.noteId !=  note.id;
                            })
                        } else if(note.type === 12){
                            _this.pageArr[pageNo].curPiArr =  _this.pageArr[pageNo].curPiArr.filter(function (item) {
                                return item.noteId !=  note.id;
                            })
                        }

                    }).catch((err) => {
                       // layer.msg('删除失败',{skin:" layui-layer tip-red"})
                        // _this.$message.error('删除失败');
                    }).finally(() => {

                    });
                    layer.close(index);
                });

            },
            //编辑笔记
            editNote(noteId){
                var _this = this;
                _this.clearTopSign();
                console.log(noteId)
                for(var i in _this.noteList ){
                    if(noteId === _this.noteList[i].id){
                        _this.setUeContent(_this.noteList[i].content);
                        _this.initSignsIdArr = _this.noteList[i].noteExts;
                        _this.setTopSigns( _this.noteList[i].noteExts);
                        break;
                    }
                }
                layer.open({
                    type: 1,
                    title: '编辑笔记',   //标题
                    area:["410px","475px"],
                    offset:"r",
                    content: $('#ueBox'),
                    zIndex:10, //层优先级
                    btn: ['确定', '取消'], //按钮组
                    yes: function(index, layero){
                        _this.getUeContent();
                        var ueCon = _this.ueText ;
                        // console.log("edit:"+ueCon+"-----topSignsArr:"+_this.topSignsArr);
                        var signInfo  =  _this.getSignInfo();
                        if(_this.ue.hasContents()){
                            ueCon = encodeURIComponent( ueCon);
                        }else {
                            layer.msg("您还没有输入内容",{skin:" layui-layer tip-orange "});
                            return false;
                        }
                        var editPara = {
                            noteId: noteId,
                            delSignIds: signInfo.delSignId,
                            addSignNames: signInfo.addSignName,
                            studyId: window.InitData.Topic,
                            appId: window.InitData.AppId,
                            content:ueCon
                        }
                        // debugger;
                        _this.editInfoFun(editPara);
                        layer.close(index);
                    },
                    cancel: function(index, layero){
                        layer.close(index)
                        return false;
                    }
                });
            },
            editInfoFun(data){
                var _this = this;
                pdfApi.SetEditNote(data).then((res) => {
                    for (var i in _this.noteList) {
                        if (_this.noteList[i].id == res.note.id) {
                            _this.noteList.splice(i, 1, res.note);
                            break;
                        }
                    }
                    var noteTimer1 = setTimeout(function () {
                        $(".study-r .note-ul").find('img').popImg();
                        clearTimeout(noteTimer1);
                    }, 1000);
                    layer.msg("编辑笔记成功",{skin:" layui-layer tip-green "});
                }).catch((err) => {
                }).finally(() => {
                });
            },
            // 计算删除的标签Id和添加的标签名
            getSignInfo(){
                var _this = this;
                var newArr = _this.topSignsArr;
                var addSignArr = []; //添加的标签
                var delSignArr = []; //删除的标签
                var addSignName = '';
                var delSignId = '';
                // 计算添加的标签
                for (let i = 0; i < newArr.length;i++){
                    if (_this.initSignsArr.indexOf(newArr[i]) == -1) {
                        addSignArr.push(newArr[i]);
                    }
                    addSignName = addSignArr.join(",");
                }

                // 计算删除的标签
                for (let i = 0; i < _this.initSignsArr.length; i++) {
                    if (newArr.indexOf(_this.initSignsArr[i]) == -1) {
                        for (let j = 0; j < _this.initSignsIdArr.length; j++) {
                            if (_this.initSignsIdArr[j].signName === _this.initSignsArr[i]) {
                                delSignArr.push(_this.initSignsIdArr[j].id);
                            }
                        }
                    }
                    delSignId = delSignArr.join(",");
                }
                var signInfoObj = {};
                signInfoObj.addSignName = addSignName;
                signInfoObj.delSignId = delSignId;

                return signInfoObj;
            },
            findSameNote(index,type,id,location){
                if (location == null) {
                    return false;
                }
                $(".note-ul").find('.'+id).addClass('is-cur').siblings('li').removeClass('is-cur');
                $("#read_midbox .load-box .cur").removeClass('cur');
                $("#read_midbox .load-box").find('.'+id).addClass('cur');

                var parentHeight = $("." + id).parents(".load-box")[0].offsetTop,
                    mineTop = $("." + id).eq(0).position().top;
                $("#read_mid_srollbar").scrollTop(parentHeight + mineTop-95);

            },
            getFileTypeFun(item , index){
                var _this = this         
                pdfApi.getFileType({ fileName:item.fileName}).then((res) => {
                  _this.setFileType(res.isExitFile);
                  _this.openReferPage(item,index);
                }).catch((err) => {
                    layer.msg("无法打开此文献",{skin:" layui-layer tip-orange "});
                }).finally(() => {
                });
            },
            openReferPage(item,index){
                
                if(this.curIndex === 2){
                    this.setReferActive({type:'lookRefer',index:index})
                }else if(this.curIndex === 3){
                    this.setReferActive({type:'sourceRefer',index:index})
                }
                var fileName = item.fileName, tableName = item.tableName, dbCode = item.dbCode, fileType = item.fileType;              
                this.setReferTitle(item.title);

                // 设置收藏信息
                var singleObj = {
                    dbCode:dbCode,
                    fileCode: fileName,
                    fileSourceType: 1,
                    tableCode: tableName,
                    toGroupId: "",
                };
                this.options.params = singleObj;
                this.options.type = 3;
                var href = window.InitData.ApplicationPath + 'readonline.ashx?filename=' + fileName + '&tablename=' + tableName + '&dbcode=' + dbCode + '&filesourcetype=1&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=refer' + '&pageType=POPPAGE#';
                var readHerf = window.InitData.ApplicationPath + 'readonline.ashx?filename=' + fileName + '&tablename=' + tableName + '&dbcode=' + dbCode + '&filesourcetype=1&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=' + '&pageType=POPPAGE#';
                
                if(this.isRefer === 'estudy'&& window.InitData.isMac) {
                     this.handleOpenedArticle();
                } else {
                    this.setReadIframeShow({
                        isShow:true,
                        referSrc:href,
                        readSrc:readHerf
                    });
                }
            },
            handleOpenedArticle () {
                var Type = null; // 平台名称
                var urlEstudy = window.InitData.domain + window.InitData.ApplicationPath + 'readonline.ashx?filename=' + fileName + '&tablename=' + tableName + '&dbcode=' + dbcodeName + '&filesourcetype=1' + '&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=estudy' + '&pageType=';
                this.setupWebViewJavascriptBridge(function (bridge) {
                    /*JS给ObjC提供公开的API，在ObjC端可以手动调用JS的这个API。接收ObjC传过来的参数，且可以回调ObjC*/
                    bridge.registerHandler('handleSendOpenedReferInfo', function (platFormName, responseCallback) {
                        Type = platFormName;
                        responseCallback({
                            'urlTemp': urlEstudy
                        });
                    });

                    /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
                    bridge.callHandler('handleGetPlatFormName', { 'opened': '1' }, function (platFormName) {
                        Type = platFormName;
                    });
                });
                return Type;
            },
            // ios estudy 连接桥
            setupWebViewJavascriptBridge (callback) {
                if (window.WebViewJavascriptBridge) {
                    callback(WebViewJavascriptBridge);
                }

                if (window.WVJBCallbacks) {
                    window.WVJBCallbacks.push(callback);
                }

                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function () {
                    document.documentElement.removeChild(WVJBIframe);
                }, 0);
            },
            //清空
            clearChoose(){
                this.collectArr = [];
            },
            // 参考文献全部收藏
            checkAll(){
                if(this.isCheckAll === false){
                    if(this.curIndex == 2){
                        this.collectArr  =  this.lookReferArr;

                    }else{
                        this.collectArr  =  this.sourceReferArr
                    }

                }else{
                    this.collectArr = [];
                }
                this.isCheckAll = !this.isCheckAll;
            },
            //收藏到
            collectTo(){
                this.singleCollect(false);
                if(this.collectArr.length === 0){
                
                    layer.msg("请选择至少一篇文献",{skin:" layui-layer tip-orange "});
                    return ;
                }
                var curCollectArr = [];
                this.collectArr.map(function (item) {
                     let obj = {};
                     obj.dbCode = item.dbCode;
                     obj.fileCode = item.fileName;
                     obj.fileSourceType = 1;
                     obj.tableCode = item.tableName;
                    curCollectArr.push(obj);
                })
                var optionObj = {
                    knsKeys:curCollectArr,
                    subjectId:''
                };
                this.options.params = optionObj;
                this.options.type = 4;
                this.setReferCollectClass(true);
                this.setCollectShow(true);

            },
        }
    }
</script>

<style scoped>
    .pdfRight_box .drag-btn{position: absolute;top: 0;bottom: 0;left: -4px;width: 4px;cursor: w-resize;}
    .study-r-t{position:relative; height:45px;line-height:44px;text-align:center;font-size:14px;color:#666;background:#eceff4; border-bottom:1px solid #d9dfe8;justify-content: space-around;display: flex;display: -webkit-flex;}
    .study-r-t .ckwx{display: inline-block;cursor: pointer;margin: 0 4%;line-height: 41px;}
    .study-r-t .ckwx.b{font-weight: normal;color:#333;border-bottom:3px solid #ff8125;}
    .tab-btn{position:absolute;top:0;bottom:0;height:44px; width:20px;text-align:center;background: #eceff4; border:0 solid #d9dfe8; z-index: 2; cursor: pointer;left:0;border-right-width:1px}

    .r-hide {position: absolute;top: 46px;bottom: 0;left: 0;right: 0;overflow-y: scroll;padding: 5px 8px;}
    .r-hide .note-ul .note-li {margin: 8px 12px;padding: 15px 15px 12px;box-sizing:border-box; word-break: break-all;color:#666;background: #fff;cursor: pointer;}
    .note-li .li-top{position: relative;overflow: hidden;}
    .note-li:hover{box-shadow:0 0 6px rgba(0,0,0,.12);outline: 1px solid #fccbad;}
    .cg9{color: #999;}
    .note-li:hover .ico-box-r{right:0;}
    .li-top .ico-box-r{ position:absolute;right: -78px;top:-2px;font-size: 16px;color:#3594ff; /*background:#f5f5f5;*/transition-duration: .3s;}
    .li-top .ico-box-r a{margin-left:6px;}
    .li-top .ico-box-r a:hover,.part-b a:hover svg{color:#f80;}
    .li-content{margin-top: 7px;}
    .r-hide .note-ul .is-cur{background: #fbf5dd;box-shadow: 0 0 5px #fccbad;outline: 1px solid #fccbad;}
    .li-bottom{margin-top: 7px;overflow: hidden;}

    .li-bottom .fl{float: left;}


    .n-m{margin-top: 7px;}
    .ovhide {overflow: hidden;}
   /* .note-li .mark-sm{margin:4px;padding: 0 4px; max-width: 8em;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;color: #cb9f7a; border: 1px solid #cb9f7a;border-radius: 2px;}*/
    .mark-sm{display: inline-block;margin: 0 2px 0 0;padding:2px 4px;vertical-align: middle;line-height: 1.4;font-size:12px;color: #666;background:#fff;border:1px solid #d7d7d7;border-radius:2px;}
    .bfc-l{float: left;margin-right: 5px;}

    /*参考文献*/
    .note-list{box-sizing: border-box;padding: 10px 5px;}
    .note-list li{margin-bottom:15px; clear:both;font-size:12px;line-height:18px;word-break: break-all;color: inherit;position: relative;}
    .note-list a:hover{color:#2a8cd7;text-decoration: none;}
    .note-tr-i{margin-top:2px;float:right;font-size:12px;color: #8595ae;}
    .co, .co svg {color: #ff7624;} 

    /*参考文献收藏功能*/
    .top-form {padding: 8px 4px;font-size: 12px;border-bottom: 1px solid #d5d5d5;}
    .top-form .check{top:-1px;}
    .note-list li{position:relative;padding-left:23px}
    .note-list .check-f{position:absolute;left:0;top:2px}
    .note-list .check-f input[type=checkbox],.check-f input[type=checkbox]{margin-right:0;cursor: pointer;}
    .tip-word{position:absolute;z-index:1;top:24px;left:8px;background:#fff;color:#333;padding:6px 13px;border-radius:4px;border:1px solid #999;box-shadow:0 0 10px rgba(153,153,153,.5)}
    .disable .check{background:#f3f3f3;border:1px solid #ddd}
    .check-f.disable input[type=checkbox]:checked+.check{background:#f3f3f3;border:1px solid #ddd}
    .check-f.disable input[type=checkbox]:hover+.check{background:#f3f3f3;border:1px solid #ddd}
    .tnp-p{font-size:14px;color:#333;line-height:18px;margin-bottom:6px}
    .title-null-pop{position:absolute;top:5vh;text-align:center;left:0;right:0;padding:25px 20px;background:#fff;border-radius:6px;border:1px solid #e6e6e6;box-shadow:0 0 8px rgba(96,96,96,.32);z-index:101}
    .tnp-p+.btn{display:inline-block;margin-top:28px;font-size:12px;padding:7px 12px;border-radius:4px}
    .title-null-pop .btn-blue{color:#fff;background:#3594ff}
    .title-null-pop .btn-blue:hover{color:#fff;background:#3474d9}
    .btn.btn-line-orange{padding:3px 13px;font-size:12px;color:#f80;background:#f5f5f5;border-radius:4px;border:1px solid #f80}
    .btn-line-orange svg{font-size:13px}
    .top-form-l{float:left;margin-top:3px}
    .check-word .co{margin:0 3px}
    .radio-f{position: relative;display: table-cell;padding-right: 5px;}
.radio-f input[type=radio]{opacity:0;position: relative;z-index:1;}
.radio:before{content:"";position:absolute;top:2px;left:0;box-sizing:border-box;display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid #dde0e7;background:#fff;cursor:pointer;}
.radio-f input[type=radio]:checked+.radio:before{border:5px solid #409eff}
.check-f{position: relative;}
.check-f input[type=checkbox]{opacity:0;position: relative;z-index:1;margin-top:-8px;}
.check{position:absolute;top:2px;left:0;box-sizing:border-box;display:inline-block;width:14px;height:14px;background:#fff;border: 1px solid #dcdfe6;border-radius:2px;}
.check:after{content:"";display: block;width: 9px;height: 4px;margin: 2px 0 0 1px;border-bottom: 1px solid #fff;border-left: 1px solid #fff;transform: rotate(-45deg);}
.check-f input[type=checkbox]:checked+.check{background-color: #409EFF;border-color: #409EFF;}
.check-f input[type=checkbox]:hover+.check{border-color: #409EFF;cursor: pointer;}

.top-form+.note-list { max-height: calc(100vh - 148px);overflow-y: auto;}
</style>
<style>
    .note-li img{margin-top:10px;max-width: 100%;}
    .note-li img[src*="attachment/fileTypeImages"] {margin-top: 0;}
</style>