/* jshint esversion: 6 */
import store from '../../vIndex.js'

const ueditorModule = {
    namespaced: true,
    state: {
        ue:null,
        ueText:"",
        topSignsArr:[],
        initSignsArr:[],
    },
    mutations: {
        // 实例化editor编辑器
        initEditor(state){
            state.ue = UE.getEditor('editor',{
                toolbars: [['bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'link', 'attachment', 'simpleupload']],
                wordCount: false,
                autoHeightEnabled: false,
                enableContextMenu: false,
                enableAutoSave: false,
                elementPathEnabled: false,
                initialFrameHeight: 240,
            });
            //加载后台配置
            state.ue.loadServerConfig();
        },
        setTopSigns(state,result){
            //debugger;
            for (var i in result) {
                state.topSignsArr.push(result[i].signName);
                state.initSignsArr.push(result[i].signName);
            }
        },
        clearTopSign(state){
            state.topSignsArr = [];
        },
        getUeContent(state){
            var ueContent = state.ue.getContent();
            console.log(ueContent);
            state.ueText = ueContent;
        },
        setUeContent(state,content){
           // state.ue.setContent(content);
            state.ue.loadServerConfig();
            var readyCount = 0;//ueditor的ready事件会触发两次，确保只执行一次ready回调函数。
            state.ue.addListener("ready", function () {
                if (readyCount === 0) {
                    if (content) {
                        state.ue.setContent(content);
                    } else {
                        state.ue.setContent('');
                    }
                    setTimeout(function () {
                        state.ue.focus(true);
                    }, 150);
                    readyCount++;
                }
            });

        },
    },
    actions: {


    },
}

export default ueditorModule
if(store.state.ueditorData) store.unregisterModule('ueditorData');
store.registerModule('ueditorData', ueditorModule);

