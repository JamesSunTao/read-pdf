<template>
    <section id="catalog_box">
        <div class="study-l-t" >
            <a href="javascript:;" class="list-btn" @click="showMenuFun" title="选项" v-if="isTreeCatalog" :class="{'cur':showMenu}" ><!--选中后增加cur样式名-->
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-down-list"></use>
                </svg>
            </a>
            <ul class="set-list" v-show="showMenu">          
                <li @click="expandCagalog" :class="{'cur':menuCur=='expandCatalog'}">
                    <a href="#">
                        <span>{{isExpend?"折叠":"展开"}}</span>   
                        全部目录
                    </a>
                </li>             
                <li :class="{'cur':menuCur=='saveMenu'}" @click="saveMenu"  v-if="fileSType==1"> <!--不可点击状态增加disable-li样式名-->
                    <a href="#">
                        目录保存为写作大纲
                    </a>
                </li>
            </ul>
            <span>目录</span>
            <span class="tab-btn tab-btn-l" id="js-tabBtn-l" @click="hideLeft" :style="leftIconStyle">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-goBack1"></use>
                </svg>
            </span>
        </div>
        <div class="l-hide">
            <!-- 非树形结构添加此类名 pdf-ztree-->
            <ul id="treeBox" class="ztree ztree-fbg" :class="[{'pdf-ztree': !isTreeCatalog}]"></ul>
        </div>
        <!--拖拽-->
        <div class="drag-btn" @mousedown = "isDragShow({ dragShow:true,direction:1})"></div>
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import pdfApi from '@/api/pdf.js'
import { debuglog } from 'util';
    export default {
        name: "Catalog",
        data(){
            return {        
                menuCur:'',   
                showMenu:false,       
                isExpend:false,
                treeData:window.InitData.catalog,
                treeSetting:{
                    view: {
                        dblClickExpand: true,
                        showLine: false,
                        selectedMulti: false,
                        expandSpeed: "fast"
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'pid',
                            rootPid: ''

                        },
                        key: {
                            title: "name"
                        }
                    },
                    callback: {
                        beforeClick: (treeId, treeNode)=> {
                            this.goPage(parseInt(treeNode.page))
                        }
                    }
                },
            }
        },
        computed: {
            ...mapState(['isHideL','fileSType','leftStyle',"leftIconStyle","isTreeCatalog","pdfTitleObj"]),
        },
        mounted() {
            this.zTreeInit();
            this.initPage();
        },
        methods: {
            ...mapMutations(["setHideL","setCatalogTipShow","setLeftStyle","setCenterStyle","setLeftIconStyle","isDragShow","setRightStyle","setRightIconStyle"]),
            ...mapActions('pdfData', ["LoadPreNext"]),
            expandCagalog(){             
                  this.isTreeCatalog
                  this.menuCur = 'expandCatalog';
                  this.isExpend = !this.isExpend;             
                  var treeObj = $.fn.zTree.getZTreeObj("treeBox");
                  treeObj.expandAll(this.isExpend);
                  this.showMenu = false;
            }, 
            saveMenu(){
                var _this = this;
               this.menuCur = 'saveMenu';
               this.showMenu = false;
               this.setCatalogTipShow(true);
               var saveData = {
                    dbCode: window.InitData.dbCode,
                    fileCode: window.InitData.fileName,
                    fileSourceType: window.InitData.FileSourceType,
                    tableCode: window.InitData.tableName,
                    topic: window.InitData.Topic,
                    literatureId: window.InitData.FileSourceType === '1' ? window.InitData.Lid : window.InitData.fileName,
                    sourceTitle: this.pdfTitleObj.title,
                    appId: window.InitData.AppId,
                    fileName: window.InitData.fileName,
                    fsType: window.InitData.FileSourceType,
                    taskId: -1
               }
               pdfApi.SavePdfCatalogToWritingOutline(
                    saveData
                ).then((res) => { 
                    _this.setCatalogTipShow(false);
                    layer.msg("保存成功",{skin:" layui-layer tip-green "});
                }).catch((err) => {
                     layer.msg("保存失败",{skin:" layui-layer tip-red "});
                }).finally(() => {
                  
                });
            },
            showMenuFun(){
                this.showMenu = !this.showMenu;              
            },
            initPage(){
                if(window.InitData.Act === "refer" || window.InitData.Act === "compare"){
                    var leftW= $("#catalog_box").width()+1,
                        rightW= $(".study-r-t").width()+1;
                    this.isHideL = true;
                    this.setLeftStyle({left:-leftW+"px", "width": leftW + "px"});
                    this.setLeftIconStyle({right: -21 + "px", transform:"rotate(180deg)"});
                    this.setRightIconStyle({left: -21 + "px",transform:"rotate(180deg)"});
                    this.setRightStyle({right:-rightW + "px",width: rightW + "px"});
                    this.setCenterStyle({left:0,right:0});
                }
            },
            goPage(pageNo){
                this.LoadPreNext(pageNo);
            },
            zTreeInit(){
                $.fn.zTree.init($("#treeBox"), this.treeSetting, this.treeData);
                var zTree = $.fn.zTree.getZTreeObj("treeBox"); //默认第一个高亮
                var firstNode=zTree.transformToArray(zTree.getNodes())[0];
                zTree.selectNode(firstNode, false);
            },
            PageToZTreeNode() {
                var treeObj = $.fn.zTree.getZTreeObj('treeBox');
                var node = treeObj.getNodes();
                var nodes = treeObj.transformToArray(node);
                for (var i = 0, len = nodes.length; i < len; i++) {

                    if ( parseInt(nodes[i].page == 4)) {
                        var currentNode = nodes[i];
                        break
                    }
                    if ( parseInt(nodes[i].page)>4) {
                        var currentNode = nodes[i - 1];
                        break
                    }
                }
                treeObj.selectNode(currentNode, false);
            },
            hideLeft(){
                var leftW= $("#catalog_box").width()+1,leftStyle={},centerStyle={},leftIconStyle={};
                var centerR = $(".study-c").position().right;
                if(this.isHideL === false){
                     leftStyle = {
                        "left": -leftW + "px",
                        "width": leftW + "px"
                    };
                    leftIconStyle ={
                        "right": -21 + "px",
                        "transform":"rotate(180deg)"
                    };
                    centerStyle = {
                        "left":0 + "px",
                        "right":centerR + "px"
                    };

                }else{
                     leftStyle = {
                        "left": 0 + "px",
                        "width": leftW + "px"
                    };
                    leftIconStyle ={
                        "right": 0 + "px",
                        "transform":"rotate(0deg)"
                    };
                    centerStyle = {
                        "left":leftW + "px",
                        "right":centerR + "px"
                    }
                }
                this.setLeftIconStyle(leftIconStyle);
                this.setLeftStyle(leftStyle);
                this.setCenterStyle(centerStyle);
                this.setHideL(!this.isHideL);
            },
        }
    }
</script>
<style>
   #catalog_box .study-l-t{position:relative; height:45px;padding: 0 0 0 16px;line-height:44px;text-align:center;font-size:14px;color:#666;background:#eceff4; border-bottom:1px solid #d9dfe8;}
    #catalog_box .drag-btn{position: absolute;top: 0;bottom: 0;right: -4px;width: 4px;cursor: w-resize;}
    #catalog_box .tab-btn{position:absolute;top:0;bottom:0; height:44px; width:20px;text-align:center;background: #eceff4; border:0 solid #d9dfe8; z-index: 2; cursor: pointer;}
    #catalog_box .tab-btn-l{right: 0px;border-left-width: 1px;}
   /*左侧树*/
    .ztree-fbg {padding: 5px 0 5px 5px;}
    .ztree-fbg * {font:14px "\5FAE\8F6F\96C5\9ED1";}
    .ztree-fbg li a:hover {text-decoration:none;}
    .ztree-fbg a:hover {background:#e5e5e5;}
    .ztree-fbg li { position: relative; clear:both;}
    .ztree-fbg>li {padding: 4px 8px 4px 0px;clear: both;}
    .ztree-fbg li a{display: block;height:auto;padding: 0;vertical-align: middle;overflow:hidden;}
    .ztree-fbg li ul{margin: 2px 0 -2px 0;}
    .ztree-fbg>li>a>span+span{font-size:16px}
    .ztree-fbg li a.curSelectedNode_Edit {background-color:#FFE6B0; color:#fff;  background: #428bca; }
    .ztree-fbg li>a>span:first-child {display: none;}
    .curSelectedNode_Edit{border:none!important;}
    ul.ztree.zTreeDragUL {margin:0; padding:0; position:absolute;width:auto; height:auto;background-color:#cfcfcf; border:1px #ddd dotted; opacity:0.8; filter:alpha(opacity=80);z-index:10000;max-width:230px;line-height:28px;height:28px; }
    .ztree li a.tmpTargetNode_inner{border:none;background:#f8f8f8;height:auto;}
    .ztree-fbg li span.button{float: left;margin-right: 5px;}
    .ztree-fbg li a.curSelectedNode{height:auto;color: #fff;background: #c3d5e3;border-radius: 3px 0 0 3px; border: none;opacity:1;}
    .ztree-fbg li a > span:first-child + span {display: block;height: 30px;line-height: 30px;padding:0 10px 0 5px;color: #333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
    .ztree-fbg li span.button.chk.checkbox_true_full+a span:nth-child(2){color:#2e8ded;}
    .ztree-fbg li span {padding: 0;margin-right: 0;}
    .ztree-fbg li span.button.chk{margin-top:9px;}
    .ztree-fbg li span.button.switch{margin-top:4px;}
    /*左侧正常目录*/
    .pdf-ztree li a > span:first-child + span {display: inline-block;max-width: 87%;position:relative;height: 36px;padding: 0 15px 0 10px;line-height: 36px;overflow: visible;}
    .pdf-ztree li a>span:first-child{display: inline-block;width: 14px;height: 16px;vertical-align:  middle;opacity: 1;margin:-4px 0 0;background-size: 100% 100%!important;}
    .pdf-ztree li span.button.switch { display: none;}
    .pdf-ztree li a {padding-left: 65px;cursor:pointer}
    .pdf-ztree li a.curSelectedNode> span:first-child + span:before{border:none;}
   /*功能选项按钮及下拉菜单*/
    .list-btn{position:absolute;width:44px;width:32px;height:32px;line-height:32px;border-radius:4px;left:5px;top:6px;font-size:18px;color:#506697}
    .list-btn:after{content:"";display:inline-block;width:1px;height:21px;vertical-align:middle;background:#d5d5d5;position:absolute;right:-6px;top:6px}
    .list-btn:hover{color:#3594ff}
    .list-btn.cur{color:#fff;background:#3594ff}
    .set-list{position:absolute;top:41px;left:4px;max-width:230px;min-width:165px;font-size:14px;white-space:nowrap;background:#fff;border:1px solid #e6e6e6;border-radius:4px;z-index:10}
    .set-list li:nth-child(2):after{content:"";display:block;margin:0 3px 0 33px;border-bottom:1px solid #ececec}
    .set-list a{position:relative;display:block;max-width:100%;padding:0 20px 0 33px;height:32px;line-height:32px;text-align:left;color:#333;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .set-list svg{position:absolute;top:8px;left:13px;font-size:16px;color:#3594ff;z-index:1;opacity:0}
    .set-list a:hover{background:#f7f7f7}
    .set-list .cur svg{opacity:1}
</style>