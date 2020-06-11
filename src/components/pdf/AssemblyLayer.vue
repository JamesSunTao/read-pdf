<template>
    <!--@*汇编弹层*@-->
    <section class="assemblyWarp">
        <div class="assembly-pop arrow">
            <div class="assemblyNav">
                <a href="javascript:;" :class="{'cur':cur==1}" @click.stop="assemblyFun(1)">按笔记标签汇编</a>
                <a href="javascript:;" :class="{'cur':cur==2}" @click.stop="assemblyFun(2)">编辑已有汇编文档</a>
            </div>
            <ul class="assembly-box">
                <li class="assembly" v-show="cur==1">
                    <div class="ass-con" id="assembly2"><img src="../../assets/images/huibian.jpg" /></div>
                </li>
                <li class="assembly" v-show="cur==2">
                    <div class="ass-con" id="assembly3">
                        <ul class="ass-ul"  v-if="assemblyList.length>0">
                            <li class="ass-li" v-for="assemItem in  assemblyList" @click="setAssemUrl(assemItem.id)" :key="assemItem.id">
                                <input name="subtd" type="radio"> <u class="ass-radio"></u>
                                <p><a href="javascript:;" >{{assemItem.title}}</a></p>
                            </li>
                        </ul>
                        <p v-else class="no-list"> 当前不存在汇编过的文档</p>
                    </div>
                </li>
            </ul>
            <div class="assem-btn">
                <div class="layui-layer-btn layui-layer-btn-">
                    <a class="layui-layer-btn0 savebian" @click="goAssemblyFunPre">确定</a>
                    <a class="layui-layer-btn1 cancelbian" @click="cancelFun">取消</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    export default {
        name: "AssemblyLayer",
        data(){
            return {
                cur:1,
                assemblyList:[],
                no_list:false,
                assemblyId_active:""
            }
        },
        computed: {
            ...mapState(['pdfTitleObj']),
            ...mapState('pdfData', ["noteList"])
        },
        methods:{
             ...mapMutations(['setMemberTipData']),
            assemblyFun(type){
               this.cur = type;
               if(type === 2){
                  this.getAssemblyType2();
               }
            },
            getAssemblyType2(){
                var _this = this;
                pdfApi.GetAssemblyList({
                    "fileCode": window.InitData.fileName,
                    "dbCode": window.InitData.dbCode,
                    "pageIndex": 1,
                    "pageSize": 100
                }).then((res) => {
                    _this.assemblyList = res.result;
                    if (_this.assemblyList.length <=0) {
                        _this.no_list = true;
                    }
                }).catch((err) => {
                }).finally(() => {
                });
            },
            setAssemUrl(url){
                this.assemblyId_active = url;
            },
               // 笔记汇编
            goAssemblyFunPre(){
                var _this = this;
                pdfApi.IsHasNumberAuth({                                  
                    rightCode: 'EXPORT_NOTE_COUNT',  
                    dbCode:window.InitData.dbCode,

                }).then((res) => {
                  _this.savebianFun();
                }).catch((err) => {                    
                    //_this.setMemberTipData({code:err.msg,show:true});
                }).finally(() => {

                }); 
            },
            savebianFun(){
                if(this.cur === 2){
                    if (this.assemblyId_active === "") {
                        layer.msg('请先选择汇编文档',{skin:" layui-layer tip-orange "});
                    } else {
                        let liUrl = '/XmlEditor/PersonalBook/Index/'+ this.assemblyId_active;
                        window.open(liUrl);
                    }
                }else{
                    this.noteAssemblyFun();
                }
            },
            noteAssemblyFun(){
                var _this = this;
                if (_this.noteList.length === 0) {
                    layer.msg('请您添加笔记后再汇编',{skin:" layui-layer tip-orange "});
                    return false;
                }
                var myload = layer.load(2);
                var myWin = window.open(window.InitData.ApplicationPath + "article/Compiling");
                pdfApi.GetAssemblyNew({
                    "topic": window.InitData.Topic,
                    "literatureId": window.InitData.FileSourceType === '1' ? window.InitData.Lid : window.InitData.fileName,
                    "type": _this.cur,
                    "sourceTitle": _this.pdfTitleObj.title,
                    "appId": window.InitData.AppId,
                    "fileName":window.InitData.fileName,
                    "dbCode":window.InitData.dbCode,
                    "fsType":window.InitData.FileSourceType,
                    "taskId": -1,
                    "isXml":0
                }).then((res) => {
                        myWin.location.href = '/XmlEditor/PersonalBook/Index/' + res.id;
                       layer.close(myload);
                }).catch((err) => {
                }).finally(() => {
                    _this.$emit("closeAssembly", false)
                });
            },
            cancelFun(){
                this.$emit("closeAssembly", false)
            }

        }
    }
</script>

<style scoped>
    /*汇编弹层*/
    .assemblyWarp .arrow:before{content: "";position: absolute;top: -15px;right: 60px;width: 0;height: 0;border: 8px solid transparent;border-bottom-color: #fff;}
    .assemblyWarp .arrow:after {border-bottom-color: #fff;}
    .assembly-pop{position:absolute;width:660px;right:20px;top:40px; background:#fcfcfc;border:1px solid #c0c4cc;box-shadow:0 0 2px rgba(68,116,197,.14);z-index:10}
    .assembly-pop.arrow:before,.assembly-pop.arrow:after {right: 100px;}
    .assembly{list-style:none}
    .assemblyNav{min-height: 51px;}
    .assemblyNav>a{color:#333; box-sizing:border-box;float:left;width:50%;text-align:center;line-height:50px;font-size:16px;border-bottom:1px solid #edecec;border-right:0;}
    .assemblyNav .cur{color:#3594ff;border-bottom:3px solid #3594ff}
    .ass-con{box-sizing:border-box;position:absolute;left:0;top:52px;width:100%;height:390px;overflow-y:auto;padding:20px;font-size:14px;text-align:center;color:#333;background:#fff;background:#fcfcfc;transition:all .3s;z-index:0;}
    .ass-con img{display:block;margin:0 auto; border:1px solid #f1f2f3;box-shadow:0 0 2px rgba(68,116,197,.14)}
    .assembly-two .ass-t {width: 50%;}

    .ass-ul{counter-reset:section 0 heading 0}
    .ass-ul li p{counter-increment:section;overflow: hidden;line-height: 1.7;}
    .ass-ul li p:before{content:counter(section) '.'}
    .ass-li{position:relative;font-size:14px;padding: 10px 7px;background:#fff;border:1px solid #f1f2f3;border-radius:2px;margin-bottom:10px;text-align:left;cursor:pointer;transition:.3s;white-space: normal;}
    .ass-li:hover{border-color:#fccbad;box-shadow:0 0 7px 1px rgba(252,203,173,.35)}
    .ass-li input{position:absolute;top:0;width:100%;height:100%;left:0;opacity:0;cursor: pointer;}
    .ass-radio{display:inline-block;width:16px;height:16px;text-align: center;line-height: 16px;font-size: 12px;border-radius:50%;color: #fff;background:#2a8cd7;float:left;margin: 4px 6px 0 4px;text-decoration: none;opacity:0;}
    .ass-li input:checked+.ass-radio{opacity:1}
    .ass-radio:before {content: "\2713";}
    .assembly-box{height:444px}
    .assembly-pop .layui-layer-btn.layui-layer-btn-{padding:0 0 18px!important}
    .no-list{font-size: 20px;box-sizing: border-box; padding-top: 40px;}
</style>