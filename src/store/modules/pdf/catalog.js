/* jshint esversion: 6 */
import store from '../../index.js'
const catalogModule = {
    namespaced: true,
    state: {
        treeData:window.InitData.catilage,
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
    },
    mutations: {
        zTreeInit(state){
            $.fn.zTree.init($("#treeBox"), state.treeSetting, state.treeData);
            var zTree = $.fn.zTree.getZTreeObj("treeBox"); //默认第一个高亮
            var firstNode=zTree.transformToArray(zTree.getNodes())[0];
            zTree.selectNode(firstNode, false);
        },
        goPage(state,pageNo){
            this.LoadPreNext(pageNo);
        },

    },
    actions: {


    },
}

export default catalogModule
if(store.state.catalogData) store.unregisterModule('catalogData');
store.registerModule('catalogData', catalogModule);