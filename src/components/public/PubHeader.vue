<template>
    <section class="H-Box" @click.stop="stopEv">
        <div class="pop-study-t clearfix" ms-controller="PaperRead" v-if="isRefer == 'refer'">
            <img src=".././../assets/images/jiao.png"  class="radio-img" />
            <h1 class="pop-study-ht" :title="referTitle">
                {{referTitle}}
            </h1>
        </div>
        <!-- top -->
        <div class="study-t clearfix" id="PaperRead" ms-controller="PaperRead" v-if="isRefer != 'refer'">
            <div class="study-tl">
                <a href="#" class="return" title="" @click="returnFun" v-if="!isLimited">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-fanhui"></use>
                    </svg>
                    <span class="tip-title" title="返回专题列表">返回专题列表</span>
                </a>
                <h1 class="study-ht" :title="pdfTitleHover" v-html="pdfTitleObj.tit1">
                </h1>
                <a v-if="!(fileType==-1)" href="javascript:void(0)" class="node-a"  @click="goCnkiNode">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shujuxiangqing"></use>
                    </svg>
                    <span class="tip-title" >文献详情</span> 
                </a>
            </div>

            <!-- <h1 class="study-ht" :title="tilu" v-if="!!tilu&&!!pdfInfo&&pdfInfo.title">
                {{pdfInfo.title}}
                <em v-if="pdfInfo.resourceType">（{{pdfInfo.resourceType}}）</em>
            </h1> -->
            <!-- <h1 class="study-ht" :title="tilu" v-if="!!tilu&&!!pdfInfo&&pdfInfo.title && fileType== null ">
                 {{pdfInfo.title}}
                <em v-if="pdfInfo.resourceType">（{{pdfInfo.resourceType}}）</em>
            </h1> -->
            <div class="study-top-right" id="centerTop" ms-controller="centerTop">
                <a  href="javascript:void(0)" @click.stop="openXml"  class="svg-a i-f i-xml pdf-read" v-if="isXmlFile">
                    <span class="tip-title">xml阅读</span>
                </a>
                <a  v-if="FileSourceType==1" href="javascript:void(0)" title="" class="btn-laa svg-a js-phone-erwei" @click="QRCodeShowFun">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-phone"></use>
                    </svg>
                    <span class="tip-title">手机阅读</span>
                    <div class="erwei-pop" v-show="QRCodeShow">
                        <img id="qrious">
                    </div>
                </a>
                <a  v-if="!(fileType==11 || fileType==10)" href="javascript:void(0)" title="" class="btn-laa svg-a printPdf" @click="printFun()">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-print"></use>
                    </svg>
                    <span class="tip-title">打印</span>
                </a>
                <!-- <a v-if="!(fileType==11 || fileType==10) && FileSourceType == 1" href="#" title="查看知网节" class="btn-laa svg-bg svg-aa js-showCNkiNode" @click="goCnkiNode">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhiwangjie"></use>
                    </svg> -->
                <!--    <span class="tip-title">知网节</span> -->
                <!-- </a> -->
                <HeaderRight />
            </div>
        </div>
        <!-- top -->
    </section>
</template>
<style src="@/assets/css/public/pub_header.css"></style>
<script>
    import QRious from '@/assets/js/qrious.js'
    import { mapState, mapMutations, mapActions } from 'vuex'
    import AssemblyLayer from "../pdf/AssemblyLayer"
    import TopSign from "../pdf/TopSign"
    import pdfApi from '@/api/pdf.js'
    import HeaderRight from '../public/HeaderRight'

    export default {
        name: "PubHeader",
        components: { AssemblyLayer, TopSign, HeaderRight },
        data() {
            return {
                
                fileType: window.InitData.DcType,
                show: false, // 是否显示收藏弹出框
                isHideH: false,
                startNum: window.InitData.StudyInfo == null ? "" : window.InitData.StudyInfo.Grade,
                FileSourceType:window.InitData.FileSourceType
            
            }
        },
        computed: {
            ...mapState(['xmlFileUrl','isXmlFile','QRCodeShow','pdfTitleObj','pdfTitleHover', 'isLimited', 'isRefer', 'referTitle']),
        },
        created() {
            
            this.initHead();
        },
        mounted(){
           

        },
        methods: {
            ...mapMutations(["setQRCodeShow","setCollectShow","setMemberTipData"]),
            openXml(){
                var xmlFileUrl = window.InitData.ApplicationPath + 'readonline.ashx?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode='+window.InitData.dbCode+'&filesourcetype='+window.InitData.FileSourceType+'&topic='+window.InitData.Topic+'&appId='+window.InitData.AppId+'&customReading=xml';
                var result =  window.open(xmlFileUrl,`xml-${window.InitData.fileName}`);
                result.focus(); 
            },
            QRCodeShowFun() {
                if (this.QRCodeShow === false) {
                    var qr = new QRious({
                        element: document.getElementById('qrious'),
                        size: 200,
                        value: window.InitData.TrilalReadUrl

                    });
                }
                this.setQRCodeShow (!this.QRCodeShow);
            },
            initHead() {
                if (window.InitData.Act === "compare") {
                    this.isHideH = true;
                }
            },
            stopEv(){

            },
            // //获取题录信息
            getPdfInfo(){   
                 debugger 
                var _this = this;
                pdfApi.GetPdfInfo({
                    tableName: window.InitData.tableName,
                    dbCode: window.InitData.dbCode,
                    fileName: window.InitData.fileName,
                    fsType: window.InitData.FileSourceType
                }).then((res) => {
                    console.log(res)
                   
                    _this.setPdfInfo(res.tilu);
            
                }).catch((err) => {
                }).finally(() => {
                });
            },

            // 打印功能
            printFun() {
                this.addClassToDom();
                window.print();
                // $("#water_mark").hide();
                // $(".study-wrap").show();               
            },
            //在打印模式下给兼容Firefox
            addClassToDom() {
                var ua = navigator.userAgent;
                if (/firefox/i.test(ua)) {
                    $("#water_mark").show();
                    $(".study-wrap").hide();
                }
            },
            //返回专题列表
            returnFun() {
                var url = window.InitData.psmcUrl;
                window.location.href = url;
            },
            //跳转知网节
            goCnkiNode() {
                window.open(window.CnkiNode + '/KCMS/detail/detail.aspx?dbcode=' + window.InitData.dbCode
                    + '&dbname=' + window.InitData.tableName + '&filename=' + window.InitData.fileName);
            },
        }
    }
</script>
<style scoped>
 .pdf-read{cursor: pointer;}
/*    .study-ht .a-hide {
        font-size: 14px;
    }*/
    .pop-study-t {
        position: relative;
        height: 44px;
        line-height: 44px;
        border-bottom: 2px solid #3990d7;
        background: #fff;
    }
    .btn-laa:hover .tip-title{ display: block;}

        .pop-study-t:before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            height: 43px;
            width: 100px;
            background: url('.././../assets/images/jiao-bj.png') center;
        }

    .pop-study-ht {
        box-sizing: border-box;
        float: right;
        position: relative;
        width: calc(100% - 100px);
        height: 43px;
        padding: 0 100px 0 0;
        vertical-align: top;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 1;
        background: linear-gradient(to bottom, rgba(214,214,216,1) 0%,#f4f4f7 57%);
    }

    .svg-a {
        position: relative;
        vertical-align: middle;
        color: #506697;
    }

        .svg-a svg {
            font-size: 18px;
        }

        .svg-a + .svg-a {
            margin-left: 10px;
        }
        .svg-aa{position: relative;}

        .svg-a:hover {
            color: #3594ff;
        }

    .erwei-pop, .print-tip {
        position: absolute;
        top: 0;
        top: 29px;
        left: -50px;
        padding: 10px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 0 6px 1px rgba(165,165,165,.54);
        z-index: 10;
    }

        .erwei-pop img {
            display: block;
            cursor: default !important;
        }

    .print-tip {
        line-height: 1;
        color: #f60;
    }
    .H-Box {
        position: relative;
        z-index: 13;
    } 
    .radio-img {position: relative;z-index: 1;-webkit-animation-name: radio-img;animation-name: radio-img;-webkit-animation-duration: 1s;animation-duration: 1s;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation-iteration-count:1;animation-iteration-count:1;}
    @-webkit-keyframes radio-img {0% {width:0}100% {width:100px;}}
   
</style>
<style >
em {
        font-style: normal;
        font-weight: 800;
    }
</style>