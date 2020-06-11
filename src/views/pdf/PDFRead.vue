<template>
  <div class="pdf" @click="hideFun">
      <Ueditor/>
      <PubHeader v-if="isRefer === '' && headerShow || isRefer === 'refer'&& headerShow"/>
    <div class="study-wrap" :class="{'study-wrap-bottom':(isRefer === 'estudy' || isRefer === 'compare')}">
      <!--左边栏 目录-->
        <div class="study-l" :style="leftStyle"  :class="{'study-hide':isHideL}">
          <Catalog/>
        </div>
      <!--中间 正文部分-->
        <div class="pdfFullBox">
            <div class="study-c" :style="centerStyle" :class="{'collectIndex':isRefer === 'estudy' && collectShow}">
                <!--全屏时显示的有才按钮组-->
                <PdfFullNav  v-if="!headerShow"/>
                <FullCatalog v-if="fullMenu"/>
                <PdfFullNote v-if="fullNote"/>
                <NavTop v-if="isRefer === ''"/>
                <EstudyNav v-if="isRefer === 'estudy'"/>
                <PDFContent/>
            </div>
        </div>
      <!--右边栏 笔记，参考文献-->
        <div class="study-r" :style="rightStyle" :class="{'study-hide':isHideR}">
            <PdfRight :showNav="true"/>
        </div>
    </div>
     <Drag v-if="dragObj.dragShow"/>
    <!--摘录--> 
    <Extract v-show="isRefer === '' || isRefer === 'estudy'"/>
    <!--参考文献，引证文献弹出层-->
    <ReferIframe v-if="readIframeShow.isShow"/>
    <CompareSelect />
    <CompareIfram v-if="compareIfrShow"/>
    <PrintPdf/>
    <login-reg :Clientip="Clientip" :ssoappid="ssoappid" :ssoappkey="ssoappkey" :loginshow = "loginshow" :url="url" :lang="lang" :message="message"
                    @closelogin="closeLogin"></login-reg>

    <tip :showform="memberTipData.showform" :show="memberTipData.show" :lang="memberTipData.lang" :environment="memberTipData.environment" :code="memberTipData.code" :tipcontent="memberTipData.tipcontent"  @closetip='closeTip'>
     </tip>  

    <referBtn v-if="isRefer == 'refer'"/>
     <div class="shaw" v-if="showETopSign">
  <TopSign v-if="showETopSign" @closeTopSign='closeTopSignFun'/> 
     </div>

  <!-- 引文复制组件 -->
     <quote :show="quoteShow" :num='quoteData.quoteNum' :selftoken='selftoken' :original-data="quoteData.originalData"  @close='closeQuote'></quote>
   
    <!-- //目录保存为大纲 -->
    <div class="tip-color-wrap"  id="catalog-save-tip" v-if="catalogTipShow">
        <span class="tip-color tip-orange">正在保存中, 请稍后...</span>
    </div>
    <Subject v-if="isXMRDFile == 1"></Subject>  
    <TipBox v-if="isCopy"></TipBox>  
    <colorSelect v-if="colorData.show" :colorData="colorData"></colorSelect>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import pdfApi from '@/api/pdf.js'
import PDFContent from  '@/components/pdf/PDFContent.vue'
import  Catalog from  '@/components/pdf/Catalog.vue'
import  FullCatalog from  '@/components/pdf/FullCatalog.vue'
import  PubHeader from  '@/components/public/PubHeader.vue'
import  NavTop from  '@/components/pdf/NavTop.vue'
import  PdfRight from  '@/components/pdf/PdfRight.vue'
import  Drag from  '@/components/pdf/Drag.vue'
import  Ueditor from  '@/components/public/Ueditor.vue'
import  PdfFullNav from  '@/components/pdf/PdfFullNav.vue'
import  PdfFullNote from  '@/components/pdf/PdfFullNote.vue'
import  ReferIframe from  '@/components/pdf/ReferIframe.vue'
import  CompareSelect from  '@/components/public/compareSelect.vue'
import  CompareIfram from  '@/components/public/compareIfram.vue'
import  EstudyNav from  '@/components/estudy/EstudyNav.vue'
import  PrintPdf from '@/components/pdf/PrintPdf.vue'
import Subject from '@/components/public/subject.vue'
import referBtn from '@/components/pdf/referBtn.vue'
import TipBox from '@/components/pdf/TipBox.vue'
import TopSign from "@/components/pdf/TopSign"
import colorSelect from '@/components/public/colorSelect.vue'


export default {
  components: {
    Extract: () => import(/* webpackChunkName: "extract" */ '@/components/public/Extract.vue'),
    PDFContent,
    PubHeader,
    Catalog,
    FullCatalog,
    NavTop,
    PdfRight,
    referBtn,
    Ueditor,
    PdfFullNav,
    PdfFullNote,
    Drag,
    ReferIframe,
    CompareSelect,
    CompareIfram,
    PrintPdf,
    EstudyNav,
    Subject,
    TipBox,
    TopSign,
    colorSelect
  },
  data(){
    return {
        Clientip:window.InitData.Clientip,
        ssoappid:window.InitData.ssoAppId,
        ssoappkey:window.InitData.ssoAppKey,
        loginshow:window.InitData.loginshow,
        url:window.InitData.url,
        lang:window.locale,
        selftoken: (window.location.origin.indexOf("localhost")>=0)&&(window.token),
      
        
    }
  },

    computed: {
        ...mapState(['colorData','quoteData','quoteShow','showETopSign','isHideL','isHideR','isCopy','isXMRDFile','message','catalogTipShow','memberTipData','isOffLine','collectShow','headerShow','fullMenu','fullNote',"leftStyle","centerStyle","rightStyle","dragObj","readIframeShow","isRefer","navShow","isCompare","compareIfrShow"]),
        
   },
   
    created(){
      // alert('suntao')
        // this.setHideTop(false);
       this.allowToXml() 
    },
    watch:{
      isOffLine(){
        this.loginshow =  this.isOffLine;
      }
    },
    mounted(){
       this.getPdfInfo();
      this.AddReocd();
      this.loginshow =  this.isOffLine;  //判断是否登录
    },
  methods:{
      ...mapMutations(['setQuoteData','setQuoteShow','closeTopSignFun','hideFun','setPdfInfo','closeTip','setMemberTipData','setHideTop','setOffLine']),
      ...mapActions(['allowToXml']),
      closeQuote(){
        this.setQuoteShow(false);
      },
    // //获取题录信息
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
      closeLogin(){
        this.loginshow = false;
        this.setOffLine(false);
      },
      AddReocd(){
          pdfApi.AddReadReocd(
                    {
                      appId: window.InitData.AppId,
                      dbCode: window.InitData.dbCode,
                      tableName: window.InitData.tableName,
                      fileName: window.InitData.fileName,
                      fileSrcType: window.InitData.FileSourceType
                    }
                ).then((res) => {
                  console.log("")
                }).catch((err) => {
                  

                }).finally(() => {
                }); 
      },
  }
};
</script>
<style src="@/assets/css/public/reset.css"></style>
<style src="@/assets/css/pdf/pdf.css"></style>
<style>
.top_signWarp{z-index: 99 !important;width: 415px !important;}

.pdfFull_active{position: fixed;top: 0;bottom: 0;right: 0;left: 0;z-index: 10;background: rgba(0,0,0,0.8);}
.collectIndex{z-index: 13 !important;}
.tip-color-wrap {position: fixed;top: 40vh;left: 0; right: 0;text-align: center; z-index: 10;}
.layui-layer-msg,.tip-color{min-width:200px;max-width:400px;padding:13px 40px;text-align:center;font-size:14px;color:#333;background:#fff;border:1px solid #E6E6E6;border-radius:6px;box-sizing:border-box;box-shadow:none}
.layui-layer-msg .layui-layer-content{padding:0}
.layui-layer.tip-green,.tip-green{color:#29B049;background:#e3fde4;border:1px solid #C6E8C8;}
.layui-layer.tip-red,.tip-red{color:#F44C4C;background:#FFE4E4;border:1px solid #F5D0D0;}
.layui-layer.tip-orange,.tip-orange{color:#FF8800;background:#FFF9EC;border:1px solid #FFDCC9;}



</style>