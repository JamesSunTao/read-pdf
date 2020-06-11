<template>
    <div id="ueBox">
        <div class="tag-wrap">
            <div class="tag-top">
                <label class="tag-l">添加标签:</label>
                <div class="tag-r">
                  <span class="tag js-delete"  v-for="(tagItem,index) in topSignsArr" :key="'tag'+index">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tag"></use>
                        </svg>
                        {{tagItem}}
                        <a title="删除" class="tab-x" @click="deleteSign(index)">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-close1"></use>
                            </svg>
                        </a>
                   </span>
                    <input id="txtSignNote" class="js-txtSignNote tag-text" type="text"   v-model="tabelName" @blur="blur(0)"  @keyup.enter.stop="addSign(0)" v-show="showTag" ref="gain" />
                    <span class="tag-add js-addSignNote" v-show="!showTag" @click="showTags">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-note_add"></use>
                        </svg>
                        标签
                    </span>
                </div>
            </div>
            <!--添加已有标签-->
            <div class="posr js-label" v-show="showTag" @click="showTags">
                <div class="tag-box">
                    <h5 class="tag-ht">从已有标签中直接添加：</h5>
                    <div class="tag-group tag-group-k on js-tag-group">
                        <span class="js-addExistNoteSign" v-bind:class="{cga1: topSignsArr.indexOf(signItem) > -1}" v-for="(signItem,index) in allSignsArr" @click="addMoreSign(signItem)" :key="'sign'+index">{{signItem}}</span>
                    </div>
                </div>
            </div>
            <!--编辑器-->
            <script id="editor" name="editor" type="text/plain"></script>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import ueditorData from '@/store/modules/pdf/UeditorStore.js'
    export default {
        name: "Ueditor",
        data(){
            return {
                editor:null,
                showTag:false,
                allSignsArr:[],
                signTimer:null,
                tabelName:"",
                isBlur:false,
            }
        },
        computed: {
            ...mapState('ueditorData', Object.keys(ueditorData.state)),
        },
        created(){
            this.getAllSigns();
        },
        mounted() {
            this.initEditor();
          //  this.setFocus(); // 自动聚焦
        },
        methods:{
            ...mapMutations('ueditorData', Object.keys(ueditorData.mutations)),
            showTags(){
                clearTimeout(this.signTimer);
                this.signTimer = null;
                this.showTag = true;
                // 输入框获取焦点
                this.$nextTick(() =>{
                    this.$refs.gain.focus()
                })
            },
            // 失去焦点
            blur(){
                this.isBlur = true;
                this.addSign(1);
                var _this = this;
                _this.signTimer = setTimeout(function () {
                    _this.showTag = false;
                    this.isBlur = false;
                }, 200);
            },
            //回车添加标签
            addSign(type) {
                var _this = this;               
                var tabelName = _this.tabelName;
                var reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g;
                if (!tabelName.length) {
                    if (type != 1) {               
                      layer.msg("标签不能为空",{skin:" layui-layer tip-orange "});
                    } 
                    return;
                } else {
                    if (!reg.test(tabelName)) {
                        layer.msg("标签只能输入中文、字母、数字,2-10个字",{skin:" layui-layer tip-orange "});
                        _this.tabelName = "";
                        return;
                    }
                    if (tabelName.length <= 50) {
                        if ($.inArray(tabelName, _this.allSignsArr) == -1) {
                            _this.allSignsArr.push(_this.tabelName);

                        }
                        if ($.inArray(tabelName, _this.topSignsArr) == -1) {
                            _this.topSignsArr.push(_this.tabelName);
                            _this.tabelName = "";
                        } else {
                            layer.msg("标签已经存在",{skin:" layui-layer tip-orange "});
                            _this.tabelName = "";
                            return;
                        }
                    } else {
                        layer.msg("标签长度不超过50个字符",{skin:" layui-layer tip-orange "});
                        _this.tabelName = "";
                        return;
                    }
                }
            },
            deleteSign(index){
                this.topSignsArr.splice(index, 1);
            },
            addMoreSign(signItem){
                var _this = this;           
                if (_this.topSignsArr.indexOf(signItem) === -1) {
                    _this.topSignsArr.push(signItem);
                    return;
                } else {
                    layer.msg("标签已经存在",{skin:" layui-layer tip-orange "});
                }
            },
            getAllSigns(){
                pdfApi.GetSignNames({studyId: window.InitData.Topic}).then((res) => {
                    if(res){
                       this.allSignsArr = res.data;
                    }
                }).catch((err) => {
                }).finally(() => {
                });
            },
        }
    }
</script>
<style>
  #ueBox{width: 360px;height: 348px;z-index: 800;display: none;margin-top: -25px;}
    .tag-top{margin-top:-25px;padding:10px 0;max-height:78px;overflow-y:auto;}
    .tag-l{float:left;margin:3px 5px 0 0;}
    .tag-r{ /*overflow: hidden; */display: table-cell;width: 9999px;}
    .tag-r-hide{height:90px;overflow-y:auto;}
  .tab-x{opacity:0;position: absolute;display: inline-block;right: -12px;top: -12px;/* margin: -4px 0 0 2px; */vertical-align:middle;font-size: 12px;color: #fff;width: 27px;height: 27px;line-height: 25px;text-align: center;border-radius: 50%;background: #3594ff;transform: scale(.5);cursor:pointer;}

    .tag:hover .tab-x{opacity:1;}
    .tab-x:hover{color:#f60;}
    .tag:hover{border: 1px solid #dcdcdc;}
    .tag-pop{width: 550px;height: 315px;padding:10px; text-align: left; white-space: normal;background:#fff;border: 1px solid #d5d5d5;z-index: 10;}
    .tag-add{display:inline-block;padding:3px 4px;color:#2a8cd7;cursor: pointer;}
    .tag{position: relative; display:inline-block;padding:3px 4px;margin-right:6px;vertical-align:top;border:1px solid #fff;border-radius: 4px;}
    .tag svg{vertical-align:middle;margin:-1px 2px 0 0;}
    .tag-text{display:inline-block;width: 90px;height: 30px;line-height: 30px;padding-left:10px;vertical-align: top;border: 1px solid #dcdcdc;border-radius: 4px;}
    .tag-text input[type="text"]{width:115px; height: 27px;padding-left:0;border: none;vertical-align: top;}
    .tag-box{position:absolute;top:0;left: -10px;right: -10px;border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;box-shadow: 0 0px 8px 0px rgba(165,165,165,.5);z-index: 1000;}
    .layui-layer-content .tag-box{left:0;right:0;background: #fff;border:1px solid #dcdcdc;}
    .tag-wrap .edui-default .edui-editor{margin:0;}
    .tag-ht{padding: 0 15px;height: 30px;line-height: 30px;text-indent: 0;color: #999;background: #f3f3f3;}
    .tag-group{height:100px; padding: 0 15px;margin: 10px 0;font-size: 0;/*background:#fff;box-shadow:0 3px 8px 0px rgba(165,165,165,.5);*/overflow-y:auto;}
    .tag-group span{display:inline-block;margin:0 20px 15px 0;font-size:14px;cursor:pointer;}
    .tag-group span:hover{color:#2a8cd7;}
    .tag-group-k span{position: relative;padding-left: 10px;margin-bottom:10px;vertical-align:top;}
    .tag-group-k span:before{content: "";position: absolute;left: -2px;top: 7px;display: inline-block; width: 6px;height: 6px; margin-right: 5px;background: #c3d4e2;border-radius: 50px;vertical-align: middle;}
    .cga1{color:#a1a1a1;}
    .tag-group .cga1:hover{color:#a1a1a1;}
    .tag-group-k .cga1:before{content:"";background:#a1a1a1;}
    .mark-sm{display: inline-block;margin: 0 2px 0 0;padding:2px 4px;vertical-align: middle;line-height: 1.4;font-size:12px;color: #666;background:#fff;border:1px solid #d7d7d7;border-radius:2px;}
    #topsigns{position: absolute; right: 15px;left: auto;z-index:10}
    .btn-group-bottom{position: absolute;bottom: 0;left: 0;right: 0;text-align:center;}
    .btn-group-bottom .btn{margin:0 5px 25px;display: inline-block;border-radius: 4px}

    .posr{ position:relative;}
    .layui-layer-content .tag-box{left:0;right:-3px;background: #fff;border:1px solid #dcdcdc;}
    .pop-tab-title{height:43px;line-height:39px;font-size:0;margin: -43px 0 0 190px;}

</style>