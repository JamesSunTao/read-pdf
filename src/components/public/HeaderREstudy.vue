<template>
    <div class="pubHeader">
        <a href="javascript:void(0)" title="" class="btn-laa js-phone-erwei" @click.stop="QRCodeShowFun" v-if="fileSType ==1">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-phone"></use>
            </svg>
            <span class="tip-title">手机阅读</span>
            <div class="erwei-pop" v-show="QRCodeShow"><img id="qrious"></div>
        </a>
        <div class="star-group" title="文献重要度">          
            <a href="javascript:;" class="star star_1" :class="{'starActive':startNum==1}" @click="scoreFun(1)"><label for="starid1">差</label></a>
            <a href="javascript:;" class="star star_2" :class="{'starActive':startNum==2}" @click="scoreFun(2)"><label for="starid2">较差</label></a>
            <a href="javascript:;" class="star star_3" :class="{'starActive':startNum==3}" @click="scoreFun(3)"><label for="starid3">普通</label></a>
            <a href="javascript:;" class="star star_4" :class="{'starActive':startNum==4}" @click="scoreFun(4)"><label for="starid4">较好</label></a>
            <a href="javascript:;" class="star star_5" :class="{'starActive':startNum==5}" @click="scoreFun(5)"><label for="starid5">好</label></a>
        </div>
        <a href="javascript:void(0)" id="" class="btn-la" @click="isLoginout" v-if="isFileSourceType==1">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-iconyinyong1"></use>
            </svg>
            <span class="tip-title">引用</span>
        </a>
        <a href="#" id="litMarkBtn" class="btn-la" @click.stop="goTopSignFun">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tag"></use>
            </svg>
            <span class="tip-title">标签</span>
        </a>

        <a href="javascript:;" class="btn-la" id="wenSave" style="margin-left:6px;" @click.stop="wenSave()">
            <svg class="icon" aria-hidden="true" ms-on-click="showCollectPanel">
                <use xlink:href="#icon-collection"></use>
            </svg>
            <span class="tip-title">收藏</span>
        </a>
        <AssemblyLayer v-show="showAssembly"  @closeAssembly='goAssemblyFun'/>
        <TopSign v-show="showTopSign" @closeTopSign='goTopSignFun'/>
        <collectarticle v-if="collectShow && !readIframeShow.isShow" :class="{'refer-collection':referCollectClass}" :options="options" @close="setCollectShow(false)"></collectarticle>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import QRious  from '@/assets/js/qrious.js'
    import AssemblyLayer from "../pdf/AssemblyLayer"
    import TopSign from "../pdf/TopSign"
    import topSign from '@/store/modules/public/topSign.js'

    import pdfApi from '@/api/pdf.js'
    //import "@/assets/css/collectArticle.css"
    // import collect from "@/assets/js/collect.min.js"
    export default {
        name: "HeaderREstudy",
        components:{AssemblyLayer,TopSign},
        data(){
            return {
                isFileSourceType:window.InitData.FileSourceType,
                fileType:window.InitData.DcType,
                isHideH:false,
                startNum:window.InitData.StudyInfo == null ? "" : window.InitData.StudyInfo.Grade
            }
        },
        computed: {
            ...mapState(['QRCodeShow','showAssembly','showTopSign','pdfTitleObj','isLimited','isRefer','referTitle','options','collectShow','readIframeShow',"fileSType","referCollectClass","isSingleCollect"]),
        },
        created(){
            this.getPdfInfo();
            this.initHead();
        },
    
        methods:{
            ...mapActions('topSign', Object.keys(topSign.actions)),
            ...mapMutations(['setQuoteShow','setQuoteData','signShowFun','setQRCodeShow','setShowAssembly','setShowTopSign','singleCollect','setPdfInfo','setTwoColumn',"setLeftStyle","setCenterStyle","setRightStyle","setCollectShow","setReferCollectClass","setRightIconStyle"]),
            initHead(){
                if(window.InitData.Act === "compare"){
                    this.isHideH =  true;
                }
            },
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
            QRCodeShowFun(){
                if(this.QRCodeShow === false){
                    var qr = new QRious({
                        element:document.getElementById('qrious'),
                        size:200,
                        value:window.InitData.TrilalReadUrl

                    });
                }
                this.setQRCodeShow(!this.QRCodeShow) ;
            },
            //获取题录信息
            getPdfInfo(){
                var _this = this;
                pdfApi.GetPdfInfo({
                    tableName: window.InitData.tableName,
                    dbCode: window.InitData.dbCode,
                    fileName: window.InitData.fileName,
                    fsType: window.InitData.FileSourceType
                }).then((res) => {
                    _this.setPdfInfo(res.tilu);

                }).catch((err) => {
                }).finally(() => {
                });
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
            // 笔记汇编
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
                    //this.getExsistedSigns();
                }
            },
            // 收藏
            wenSave(){
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
                this.setShowTopSign(false);
                this.setShowAssembly(false);
                this.setReferCollectClass(false);
                this.setCollectShow( !this.collectShow);
            },
        }
    }
</script>
<style scoped>
.btn-laa:hover .tip-title{ display: block;}
    .refer-collection {right: -402px !important;top: 90px;}
    .refer-collection .arrow:before,.refer-collection  .arrow:after{display:none}
    .js-phone-erwei {position: relative;}
    .erwei-pop,.print-tip{ position:absolute;top:0;top: 29px;left:-50px;padding:10px;background: #fff;border-radius: 2px;box-shadow: 0 0 6px 1px rgba(165,165,165,.54); z-index: 10;}
    .pop-study-t{position:  relative;height: 44px;line-height: 44px;border-bottom: 2px solid #3990d7;background: #fff;}
    .pop-study-t:before{content: "";position: absolute;left: 0;top: 0;height: 43px;width: 100px;background: url('.././../assets/images/jiao-bj.png') center;}
    .pop-study-ht{box-sizing: border-box;float: right;position: relative;width:calc(100% - 100px);height: 43px; padding: 0 100px 0 0;vertical-align: top;text-align: center;font-size: 18px;font-weight: bold; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;z-index: 1;background:linear-gradient(to bottom, rgba(214,214,216,1) 0%,#f4f4f7 57%);}

    .estudy-wrap .svg-a{padding: 0 1px 0 6px;}
    .estudy-wrap .svg-a+.svg-a {margin-left: -4px;}
    .svg-a{position:relative;vertical-align: middle;color:#506697;}
    .svg-a svg {font-size: 18px;}
    .svg-a+.svg-a{margin-left:10px;}
    .svg-a:hover{color:#3594ff;}
    .star label{opacity: 0;}

    .pubHeader {float: right;position: relative;display:inline-block;margin:10px 0;line-height: 1;vertical-align:middle;}
    .pubHeader  .btn-la.cur{color:#2a8cd7}
    .pubHeader .top-left > a {margin-left: 5px;}
    .pubHeader  .btn-la{color:#506697;width:auto;height:auto;height: 16px;line-height: 16px;margin: 0 2px;background:transparent!important}
    .pubHeader  .btn-la:hover{color:#3594ff;}
    .btn-la:hover .tip-title,.btn-hb:hover .tip-title,.return:hover .tip-title{display:block;}
    /*
    .starf:checked + .star {background-color:#eceff4}.layout-box .btn-la{color:#d4d2d3;}
    .pubHeader .btn-la{ }
    .pubHeader  .layout-box {padding: 0;margin: 0 5px;border: none;}
    .pubHeader #top_signWarp{right: -20px;}*/
</style>