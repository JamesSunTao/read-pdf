<template>
    <div class="pubHeader">
        <div class="star-group" title="文献重要度">
        <!--<input type="radio" id="starid1" class="starf starf_1" value="1" :checked="startNum==1?'checked':''" name="starf"> 
            <a href="javascript:;" class="star star_1" @click="scoreFun(1)"><label for="starid1">差</label></a>
            <input type="radio" id="starid2" class="starf starf_2" value="2" :checked="startNum==2?'checked':''" name="starf">
            <a href="javascript:;" class="star star_2" @click="scoreFun(2)"><label for="starid2">较差</label></a>
            <input type="radio" id="starid3" class="starf starf_3" value="3" :checked="startNum==3?'checked':''" name="starf">
            <a href="javascript:;" class="star star_3" @click="scoreFun(3)"><label for="starid3">普通</label></a>
            <input type="radio" id="starid4" class="starf starf_4" value="4" :checked="startNum==4?'checked':''" name="starf">
            <a href="javascript:;" class="star star_4" @click="scoreFun(4)"><label for="starid4">较好</label></a>
            <input type="radio" id="starid5" class="starf starf_5" value="5" :checked="startNum==5?'checked':''" name="starf">
            <a href="javascript:;" class="star star_5" @click="scoreFun(5)"><label for="starid5">好</label></a>  -->


            <a href="javascript:;" class="star star_1" :class="{'starActive':startNum==1}" @click="scoreFun(1)"><label for="starid1">差</label></a>
            <a href="javascript:;" class="star star_2" :class="{'starActive':startNum==2}" @click="scoreFun(2)"><label for="starid2">较差</label></a>
            <a href="javascript:;" class="star star_3" :class="{'starActive':startNum==3}" @click="scoreFun(3)"><label for="starid3">普通</label></a>
            <a href="javascript:;" class="star star_4" :class="{'starActive':startNum==4}" @click="scoreFun(4)"><label for="starid4">较好</label></a>
            <a href="javascript:;" class="star star_5" :class="{'starActive':startNum==5}" @click="scoreFun(5)"><label for="starid5">好</label></a>
        </div> 
        <a href="javascript:void(0)" id="" class="btn-la btn-la-svg" @click="isLoginout" v-if="isFileSourceType==1">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-iconyinyong2"></use>
            </svg>
            <span class="tip-title">引用</span>
        </a>
        <a href="#" id="litMarkBtn" class="btn-la" @click="goTopSignFun">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tag"></use>
            </svg>
            <span class="tip-title">标签</span>
        </a>

        <a herf="javascript:;" class="btn-la collect" id="wenSave"  @click="wenSave">
            <svg class="icon" aria-hidden="true" ms-on-click="showCollectPanel">
                <use xlink:href="#icon-collection"></use>
            </svg>
            <span class="tip-title">收藏</span>
        </a>
        <a  v-if="!(fileType==11 || fileType==10)" href="#" id="noteAssembly" title="笔记汇编" class="btn-hb posr" @click="goAssemblyFun">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-huibian"></use>
            </svg>
            <span >笔记汇编</span>
        </a>
        <AssemblyLayer v-show="showAssembly" @closeAssembly='goAssemblyFun' />
        <TopSign v-if="showTopSign" @closeTopSign='goTopSignFun' />
        <collectarticle v-if="collectShow && !readIframeShow.isShow" :class="{'refer-collection':referCollectClass}" :options="options" @close="setCollectShow(false)"></collectarticle>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import AssemblyLayer from "../pdf/AssemblyLayer"
    import TopSign from "../pdf/TopSign"
    import topSign from '@/store/modules/public/topSign.js'
    import pdfApi from '@/api/pdf.js'
 
    export default {
        name: "PubHeader",
        components:{AssemblyLayer,TopSign},
        data(){
            return {
                isFileSourceType:window.InitData.FileSourceType,
                isHideH:false,
                count:0,
                startNum:window.InitData.StudyInfo == null ? "" : window.InitData.StudyInfo.Grade,
                fileType: window.InitData.DcType,
            }
        },
        computed: {
            ...mapState(['showAssembly','showTopSign','isSingleCollect','pdfTitleObj','isLimited','isRefer','referTitle','options','collectShow','readIframeShow','referCollectClass']),
        },
        created(){
            // this.getPdfInfo();
            this.initHead();
        },
        methods:{
            ...mapActions('topSign', Object.keys(topSign.actions)),
            ...mapMutations(['setQuoteShow','setQuoteData','signShowFun','setQRCodeShow','setShowAssembly','setShowTopSign','setMemberTipData','singleCollect','setReferCollectClass','setPdfInfo','setTwoColumn',"setLeftStyle","setCenterStyle","setRightStyle","setCollectShow"]),
            isLoginout(){
                var _this = this;
                  pdfApi.getForReasonableTips({}).then((res) => {
                   
                _this.myQuote();
                }).catch((err) => {
                }).finally(() => {
                });
            },
            
            myQuote(){
                
                var quoteObj = {
                    quoteNum:0,
                    originalData:[{
                        'DbCode': window.InitData.dbCode, 	 
                        'TableCode': window.InitData.tableName, 	 
                        'FileCode': window.InitData.fileName, 	 
                        'FileSourceType': window.InitData.FileSourceType

                    }]                    
                }
                this.setQuoteData(quoteObj);
                this.setQuoteShow(true);
            },
            initHead(){
                if(window.InitData.Act === "compare"){
                    this.isHideH =  true;
                }
            },
            //打分
            scoreFun(item){
                var _this = this;
                pdfApi.setScore({
                    "dbCode": window.InitData.dbCode,
                    "tableName": window.InitData.tableName,
                    "inPutStudyId": window.InitData.Topic,
                    "fileCode": window.InitData.fileName,
                    "fsType": window.InitData.FileSourceType,
                    "score": _this.startNum
                }).then((res) => {
                    if (item != _this.startNum) {
                        _this.startNum = item;
                    }else{
                        _this.startNum = _this.startNum>0?0:item;
                    }
                    if (this.startNum==0) {
                        layer.msg("取消打分",{skin:" layui-layer tip-orange "});
                    }else{
                        layer.msg("打分成功",{skin:" layui-layer tip-green "});  
                    }
                
                }).catch((err) => {
                }).finally(() => {
                });
            },
          
            
            goAssemblyFun(){
                this.setCollectShow(false);
                this.setShowTopSign(false);
                this.setQRCodeShow(false);
                this.setShowAssembly(!this.showAssembly);
            },
            goTopSignFun(){  
                this.signShowFun();
                if(this.showTopSign){
                    this.getSigns();
                   // this.getExsistedSigns();
                }
            },
            // 收藏
            // wenSavePre(){
            //     var _this = this;
            //     pdfApi.IsHasNumberAuth({                                  
            //         rightCode: 'BASE_IS_COLLECT',                  
            //     }).then((res) => {
            //       _this.wenSave();
            //     }).catch((err) => {                    
            //         _this.setMemberTipData({code:err.msg,show:true});
            //     }).finally(() => {

            //     }); 
            // },
            wenSave(){
                 this.setShowAssembly(false);
                  this.setQRCodeShow(false);
                this.setShowTopSign(false);
                this.options
                this.singleCollect(true);
                var singleObj = {
                    dbCode: window.InitData.dbCode,
                    fileCode: window.InitData.fileName,
                    fileSourceType: window.InitData.FileSourceType,
                    tableCode: window.InitData.tableName,
                    toGroupId: "",
                };
                this.options.params = singleObj;
                this.options.type = 3;
                this.setReferCollectClass(false);
                this.setCollectShow( !this.collectShow);
            },
        }
    }
</script>
<style scoped>
    .refer-collection {right: 0px !important;top: 160px;}
    .refer-collection .arrow:before,.refer-collection  .arrow:after{display:none}
    .pubHeader{float: right;position: relative;}
    .pop-study-t{position:  relative;height: 44px;line-height: 44px;border-bottom: 2px solid #3990d7;background: #fff;}
    .pop-study-t:before{content: "";position: absolute;left: 0;top: 0;height: 43px;width: 100px;background: url('.././../assets/images/jiao-bj.png') center;}
    .pop-study-ht{box-sizing: border-box;float: right;position: relative;width:calc(100% - 100px);height: 43px; padding: 0 100px 0 0;vertical-align: top;text-align: center;font-size: 18px;font-weight: bold; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;z-index: 1;background:linear-gradient(to bottom, rgba(214,214,216,1) 0%,#f4f4f7 57%);}
    .btn-hb{color:#fff;background:#3594ff;height:30px;line-height:30px;display:inline-block;vertical-align:middle;border-radius:30px;font-size:12px;padding:0 15px}
    .btn-hb:hover{background:#3474d9}
    .btn-hb svg{font-size:14px}
</style>