<template>
    <section id="fullMenuWarp">
        <div class="study-l-t">
            <span class="ckwx menu-title"><span>~</span>目录<span>~</span></span>
        </div>
        <div class="l-hide">
            <ul id="treeFullBox" class="ztree ztree-fbg" :class="[{'pdf-ztree': !isTreeCatalog}]"></ul>
        </div>
    </section>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    export default {
        name: "FullCatalog",
        data(){
            return {
                treeData:window.InitData.catalog,
                treeSetting:{
                    view: {
                        dblClickExpand: false,
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
        mounted() {
            this.zTreeInit();
        },
        computed: {
            ...mapState(['isTreeCatalog']),
            ...mapState('pdfData', ['initPageNo']),
        },
        methods: {
            ...mapActions('pdfData', ["LoadPreNext"]),
            goPage(pageNo){
                this.LoadPreNext(pageNo);
            },
            zTreeInit(){
                $.fn.zTree.init($("#treeFullBox"), this.treeSetting, this.treeData);
                var zTree = $.fn.zTree.getZTreeObj("treeFullBox"); //默认第一个高亮
                var firstNode=zTree.transformToArray(zTree.getNodes())[this.initPageNo-1];
                zTree.selectNode(firstNode, false);
            },
            PageToZTreeNode() {
                var treeObj = $.fn.zTree.getZTreeObj('treeFullBox');
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
        }

    }
</script>

<style>
    #fullMenuWarp{position: absolute;left: auto;right: 0;top: 0;bottom: 0;width: 65%;z-index: 102;background: #fff;box-shadow: 0 0 12px 7px rgba(35,35,37,.3);}
    #fullMenuWarp .study-l-t{position:relative; height:80px;padding: 0 0 0 16px;line-height:80px;text-align:center;font-size:14px;color:#666;background:#fff;}
    #fullMenuWarp .tab-btn{position:absolute;top:0;bottom:0; height:44px; width:20px;text-align:center;background: #eceff4; border:0 solid #d9dfe8; z-index: 2; cursor: pointer;}
    #fullMenuWarp .tab-btn-l{right: 0px;border-left-width: 1px;}
    #treeFullBox{padding: 5px 0 5px 5px;}
    #treeFullBox li{padding: 4px 0;margin-bottom: 5px;}
    #treeFullBox li a {display: inline-block;width: 78%; cursor: pointer;padding: 15px 65px;font-size: 14px;text-decoration: none;}
    #treeFullBox li a.curSelectedNode {color:red;background: none;border: none}
    #treeFullBox li a:hover{background:#e1e7f1; }
    /*.node_name{font-size: 16px;margin-left: 10px;}*/
    .menu-title{font-size:24px;text-align:center;line-height:100px}
    .menu-title span{margin:0 10px;color:#b9b8b8;font-size:30px}
    #fullMenuWarp .l-hide{top:80px;}
    #fullMenuWarp #treeFullBox li {border-top: 1px dashed #e8e8e8;cursor: pointer;}
    #fullMenuWarp .ztree-fbg li span.button.switch {
        margin-top: 19px;
    }
</style>