<template>
    <div id="top_signWarp" class="top_signWarp">
        
        <div class="cur_tagBox stExact">
            <span class="tag_item" v-for="(sign,index) of topSignArr" :key="index">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tag"></use>
                </svg>
                {{sign.label}}
                <a class="tab-x" @click="deleteSign(sign.id)">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-close1"></use>
                    </svg>
                </a>
            </span>

            <div class="tag-text">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tag"></use>
                </svg>
                <input type="text" class="js-txtLitSignNote" @keyup.enter="addSignFun(signName)" @blur="addSign1(signName)"   v-model="signName" id="txtLitSignNote" placeholder="请输入标签名"/>
            </div>
        </div>
        <div class="posr js-lit-label">
            <div class="tag-box">
                <h5 class="tag-ht">从已有标签中直接添加：</h5>
                <div class="tag-group tag-group-k on js-lit-tag-group">
                        <span class="js-lit-addExistNoteSign" v-for="(all_sign,item) of allSignArr"  @click="existLabel(all_sign.tagName,all_sign.iD,item,all_sign.active)" :class="{cga1:all_sign.active}" :key="item">{{all_sign.tagName}}</span>
                </div>
            </div>
        </div>
        <div class="btn-group-bottom ">
            <a class="btn btn-primary" @click="cancelTopSignFun">关闭</a>
        </div>
        
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import topSign from '@/store/modules/public/topSign.js'
    export default {
        name: "TopSign",
        data(){
            return {
                //topSignArr:[],
                signName:"",
            }
        },
        created(){
          // this.initTopSign();
          this.getExsistedSigns()

        },
         computed:{
        ...mapState('topSign', Object.keys(topSign.state)),
    },
    watch:{
        allSignArr(){
            this.compareArr();
        }
    },
    methods: {
        ...mapMutations('topSign', Object.keys(topSign.mutations)),
        ...mapActions('topSign', Object.keys(topSign.actions)),
            // 初始化本篇文献标签
            initTopSign() {
                var _this = this;
                pdfApi.GetLitSignsByFileCode({
                    "filecode": window.InitData.fileName,
                    "dbCode": window.InitData.dbCode
                }).then((res) => {
                    _this.topSignArr = res.lables;
                }).catch((err) => {
                }).finally(() => {
                });
            },
          
            // 本篇已有标签置灰
            compareArr() {
                var _this = this;
                for (var i in _this.allSignArr) {
                    _this.$set(_this.allSignArr[i], 'active', false);
                    for (var j in _this.topSignArr) {
                        if (_this.allSignArr[i].tagName == _this.topSignArr[j].label) {
                            _this.$set(_this.allSignArr[i], 'active', true);
                        }
                    }
                }
            },
            // 点击已有标签添加标签
            existLabel(signName,signId,index,isActive){
                if(isActive){
                    layer.msg("标签已存在，请勿重新添加",{skin:" layui-layer tip-orange "});
                    return false;
                }else{
                   this.addSignFun(signName,signId,true);
                }
            },
            //输入框失焦时触发
            addSign1(signName){
               if(signName === ""){
                   return false;
               }else{
                   this.addSignFun(signName);
               }
            },
            // 回车添加标签
            addSignFun(signName,signId,exist){
                var _this = this;
                var isExactOrNote = false;
                if(_this.activeItem==null){
                    isExactOrNote = false;
                }else{
                    isExactOrNote = true;
                }
                if(this.validateSign(signName)){
                    pdfApi.AddFileSign({
                        "fileCode": window.InitData.fileName,
                        "signLabel": signName,
                        "fileSourceType": window.InitData.FileSourceType,
                        "tableName": window.InitData.tableName,
                        "dbCode": window.InitData.dbCode,
                        "topic": window.InitData.Topic,
                        "signId": exist ? signId:'',
                        "appid":window.InitData.AppId,
                        "objectId":isExactOrNote?_this.activeItem.objId : "",
                        "type":isExactOrNote?_this.activeItem.type:""
                    }).then((res) => {
                        var newSignObj = {
                            "label":signName,
                            "id":res.outSignId
                        };
                        if (isExactOrNote) {
                          var addData =  {
                                type:1,
                                index:_this.activeItem.index,
                                val:{
                                    signId:res.outSignId,
                                    signName:signName
                                }
                            };
                            if(_this.activeItem.type == 2){
                                this.setWatchNSigns(addData); 
                            }
                            if(_this.activeItem.type == 3){
                                this.setWatchESigns(addData); 
                            }
                          
                        }
                       
                        var hasSign = false;
                        _this.allSignArr.map(function (item,index) {
                            if (item.tagName ==  signName) {
                                _this.$set(_this.allSignArr[index], 'active', true);
                                hasSign = true;
                            }
                        });
                        if (hasSign === false) {
                            _this.allSignArr.push({ tagName: signName, id: res.outSignId,active:true})
                        }
                        _this.topSignArr.push(newSignObj);
                        layer.msg("添加成功！",{skin:" layui-layer tip-green "});
                        _this.signName = "";
                    }).catch((err) => {
                    }).finally(() => {
                    });
                }
            },
            //删除标签
            deleteSign(signId){
                var _this = this;
                var isExactOrNote = false;
                if(_this.activeItem==null){
                    isExactOrNote = false;
                }else{
                    isExactOrNote = true;
                }
                pdfApi.DeleteFileSign({
                    "fileCode": window.InitData.fileName,
                    "dbCode": window.InitData.dbCode,                    
                    "fileSouceType": window.InitData.FileSourceType,
                    "signId": signId,
                    "appid":window.InitData.AppId,
                    "objectId":isExactOrNote?_this.activeItem.objId : "",
                    "type":isExactOrNote?_this.activeItem.type:""
                }).then((res) => {
                    var delIndex = -1;
                    _this.topSignArr.map(function (sign, index) {
                        if (sign.id === signId) {
                            delIndex = index;
                            _this.topSignArr.splice(index, 1);
                        }
                    });
                    _this.allSignArr.map(function (item, index) {
                        if (item.iD === signId) {
                            _this.$set(_this.allSignArr[index], 'active', false);
                        }
                    });
                    layer.msg("删除成功！",{
                        skin:" layui-layer tip-green"
                    });

                    // 文摘标签，划线标签操作
                     if (isExactOrNote) {
                          var addData =  {
                                type:-1,
                                index:_this.activeItem.index,
                                delIndex:delIndex,
                                delId:signId
                            };
                             if(_this.activeItem.type == 2){
                                this.setWatchNSigns(addData); 
                            }
                            if(_this.activeItem.type == 3){
                                this.setWatchESigns(addData); 
                            }
                          
                    }
                }).catch((err) => {
                }).finally(() => {
                });
            },
            //验证要添加的标签名
            validateSign(signTxt) {
                var _this = this;
                var flag = true;
                var reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g;
                if (!signTxt.length) {
                    // 标签不能为空
                    layer.msg("标签不能为空",{
                        skin:" layui-layer tip-orange "
                    });
                    flag = false;
                } else {                    
                    // 标签长度不超过50个字符
                    if (signTxt.length > 50) {
                        layer.msg("标签长度不超过50个字符",{
                            skin:" layui-layer tip-orange "
                        });
                        this.signName = "";
                        flag = false;
                        return false
                    }

                    // 标签只能包含中文、字母、数字
                    if (!reg.test(signTxt)) {
                        layer.msg("标签只能输入中文、字母、数字,2-10个字",{
                            skin:" layui-layer tip-orange "
                        });
                        this.signName = "";
                        flag = false;
                    }

                    // 标签已经存在
                    this.topSignArr.forEach(function (val, index) {
                        if (val.label == signTxt) {
                            layer.msg("标签已经存在",{
                                skin:" layui-layer tip-orange "
                            });
                            _this.signName = "";
                            flag = false;
                        }
                    });
                }
                return flag;
            },
            cancelTopSignFun(){
                this.$emit("closeTopSign", false)
            },
        }
    }
</script>

<style scoped>
    #top_signWarp{position: fixed;    top: 45px; right: 15px;left: auto;z-index:10;width: 550px;height: 315px;padding:10px; text-align: left; white-space: normal;background:#fff;border: 1px solid #d5d5d5;}
    .cur_tagBox{height: 90px;overflow-y:auto;margin-bottom: 10px;box-sizing: border-box;padding-top:5px; }
    .tag_item{display:inline-block;position: relative; padding:3px 4px;margin-right:6px;vertical-align:top;border:1px solid #fff;border-radius: 4px;}
    .tag_item:hover{border: 1px solid #dcdcdc;}
   .tab-x{opacity:0;position: absolute;display: inline-block;right: -10px;top: -12px;/* margin: -4px 0 0 2px; */vertical-align:middle;font-size: 12px;color: #fff;width: 27px;height: 27px;line-height: 25px;text-align: center;border-radius: 50%;background: #3594ff;transform: scale(.5);cursor:pointer;}

    .tag_item:hover .tab-x{opacity:1;}
    .tag-text{display:inline-block;width: 115px;height: 30px;line-height: 30px;padding-left:10px;vertical-align: top;border: 1px solid #dcdcdc;border-radius: 4px;}
    .tag-text input[type="text"]{width:93px; height: 27px;padding-left:0;border: none;vertical-align: top;}
    .tag_item svg{vertical-align:middle;margin:-1px 2px 0 0;}

    .tag-box{position:absolute;top:0;left: -10px;right: -10px;border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;box-shadow: 0 0px 8px 0px rgba(165,165,165,.5);z-index: 1000;}
    .layui-layer-content .tag-box{left:0;right:0;background: #fff;border:1px solid #dcdcdc;}
    .tag-wrap .edui-default .edui-editor{margin:0;}
    .tag-ht{padding: 0 15px;height: 30px;line-height: 30px;text-indent: 0;color: #999;background: #f3f3f3;}
    .tag-group{height:100px; padding: 0 15px;margin: 10px 0;font-size: 0;/*background:#fff;box-shadow:0 3px 8px 0px rgba(165,165,165,.5);*/overflow-y:auto;line-height: 1.7}
    .tag-group span{display:inline-block;margin:0 20px 15px 0;font-size:14px;cursor:pointer;}
    .tag-group span:hover{color:#2a8cd7;}
    .tag-group-k span{position: relative;padding-left: 10px;margin-bottom:10px;vertical-align:top;}
    .tag-group-k span:before{content: "";position: absolute;left: -2px;top: 9px;display: inline-block; width: 6px;height: 6px; margin-right: 5px;background: #c3d4e2;border-radius: 50px;vertical-align: middle;}
    .cga1{color:#a1a1a1;}
    .tag-group .cga1:hover{color:#a1a1a1;}
    .tag-group-k .cga1:before{content:"";background:#a1a1a1;}
    .btn-group-bottom{position: absolute;bottom: 0;left: 0;right: 0;text-align:center;}
    .btn-primary, .btn-primary:active, .btn-primary:focus {color: #fff;background-color:#3594ff;cursor: pointer;}
    .btn-group-bottom .btn{margin:0 5px 25px;display: inline-block;padding: 2px 24px;line-height: 34px;height: 34px;}
    .btn-primary:hover{color: #fff;background: #3474d9;}
</style>
