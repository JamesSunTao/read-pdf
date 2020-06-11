/* jshint esversion: 6 */ 
import topSignApi from '@/api/public/topSign.js';
import store from '@/store/index.js';
//顶部标签
const topSignModule={
    namespaced: true,
    state: {
        allSignArr: [],//获取的已有标签
        topSignArr: [],  //已经选择的标签
        topSignsVal: [],
        activeItem:null,
        watchNSigns:null,
        watchESigns:null ,//检测摘录标签 type: 0代表未增减，1代表增加，-1代表减少
       // signName: ""
    },
    mutations: {
        setWatchNSigns(state,obj){
            state.watchNSigns = obj;
        },
        setWatchESigns(state,obj){
            state.watchESigns = obj;
        },
        //设置已经存在的标签
        setTopSigns(state,data){
            state.allSignArr=$.extend(true, [], data.lables);
        },
        setTopSignArr(state,res){
          state.topSignArr = res;
        },
        //设置已经选择的标签
        setSelectedSigns(state,data){
            
            state.topSignArr = $.extend(true, [], data.lables);
            state.topSignArr.forEach((val)=>{
                if(val.label) state.topSignsVal.push(val.label);
            });
        },
        //添加成功
        haddleAddLabel(state,option){
            layer.msg("添加成功",{skin:" layui-layer tip-green "});
            state.topSigns.push({ label: option.signVal, id: option.data.outSignId });
            if(!option.ifExsisted){
                state.allSignArr.push({ TagName: option.signVal, ID: option.data.outSignId });
            }
            state.topSignsVal.push(option.signVal);
        },
        //删除标签
        haddleDeleteLabel(state,option){
            state.topSigns.map(function (sign, index) {
                if (sign.id === option.id) {
                    state.topSigns.splice(index, 1);
                }
            });
            for (var i = 0, len = state.topSignsVal.length; i < len ; i++) {
                if (state.topSignsVal[i] == option.label) {
                    state.topSignsVal.splice(i, 1);
                }
            }
        },
        // 记录当前激活标签的具体信息
        setActiveItem(state,res){
            state.activeItem = res;
        }

    },
    actions: {
      
        //获取已有标签
        getExsistedSigns({state,commit}){
            topSignApi.getExsistedSigns({
                //studyId: window.InitData.Topic
              }).then((data) => {
                 commit('setTopSigns', data);
              });
        },
        //获取已经选择的标签
        getSigns({state,commit},item){
            //debugger
            commit("setActiveItem",item);
            topSignApi.getSigns({
                "filecode": window.InitData.fileName,
                "dbCode": window.InitData.dbCode,
                "appid":window.InitData.AppId,
                "objectId":item?item.objId : "",
                "type":item?item.type:""

              }).then((data) => {
                  commit('setSelectedSigns', data);
              });
        },
        //添加标签ajax请求
        addLabel ({ state, commit },option) {
             //{signVal:txtVal,ifExsisted:false}
            topSignApi.addLabel({
                filecode: window.InitData.fileName,
                signLabel: option.signVal,
                fileSourceType: window.InitData.FileSourceType,
                tableName: window.InitData.tableName,
                dbCode: window.InitData.dbCode,
                topic: window.InitData.Topic,
                signId: option.id
            }).then((data) => {
                commit('haddleAddLabel',{data:data,signVal:option.signVal,ifExsisted:option.ifExsisted});
              }).catch((err) => {
              }).finally(() => {
              }); 
        },
        //点击已有标签
        existLabel({state,dispatch},option) {
            if (state.topSignsVal.indexOf(option.label) != -1) {
                layer.msg("标签已存在，请勿重复添加",{skin:" layui-layer tip-orange "});
                return;
            } else {
                dispatch('addLabel',{signVal:option.label,ifExsisted:true});
            }
        },
        //删除标签
        deleteSign({commit},option ) {
            topSignApi.deleteSign({
                filecode: window.InitData.fileName,
                dbCode: window.InitData.dbCode,
                studyId: window.InitData.Topic,
                fileSouceType: window.InitData.FileSourceType,
                signId: option.id
            }).then((data) => {
                layer.msg(data,{skin:" layui-layer tip-orange "});
                commit('haddleDeleteLabel',option);
              }).catch((err) => {
              }).finally(() => {
              });
        },
    }
};
export default topSignModule;
if(store.state.topSign) store.unregisterModule('topSign');
store.registerModule('topSign', topSignModule);