<template>
  <section>
     <Home/>
  </section>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import Home from  './videoRead'
    export default {
    components: {
        Home
      // Home: () => import(/* webpackChunkName: "XMLRead" */ './views/XMLRead.vue')
      // Home: () => {
      //   if(window.test === 1) return import(/* webpackChunkName: "XMLRead" */ './views/XMLRead.vue')
      //   else return import(/* webpackChunkName: "PDFRead" */ './views/PDFRead.vue')
      // }
    },

    mounted(){
        this.initLimited();
        // this.SetReadReocdFun();
    },
    methods:{
        // 添加至最近阅读记录
        ...mapMutations(["setLimited","setFsType"]),
        initLimited(){
            if(window.InitData.IsLimited === 1){
                this.setLimited(true);
            }
            this.setFsType(window.InitData.FileSourceType);
        },
        SetReadReocdFun(){
            pdfApi.SetReadReocd({
                appId: window.InitData.AppId,
                dbCode: window.InitData.dbCode,
                tableName: window.InitData.tableName,
                fileName: window.InitData.fileName,
                fileSrcType: window.InitData.FileSourceType
            }).then((res) => {
            }).catch((err) => {
            }).finally(() => {
            });
        }
    }
  }
</script>
<style>
  /*reset*/
  html,body{ height: 100%;}
  body, p, dl, dd, pre, h1, h2, h3, h4, h5, h6,form,ul, ol{margin: 0px;font-weight:normal;list-style: none;}
  ul {padding: 0;}
  a{text-decoration: none;}

  /*弹窗统一化*/
  .layui-layer {border-radius:2px;box-shadow: 0 0  12px rgba(157,155,155,.3);}
  .layui-layer-loading{border: none;box-shadow: none;}
  .layui-layer-title{padding: 0 18px;height: 42px;line-height: 42px;font-size: 16px;color: #333;background: #ecf2f8;border-bottom: 1px solid #edecec;border-radius: 2px 2px 0 0;}
  .layui-layer-btn a,.layui-layer-btn .layui-layer-btn0,.layui-layer-btn .layui-layer-btn1{height: 32px;line-height: 33px;padding: 0 24px;font-size: 14px;margin: 0;border-radius: 2px;}
  .layui-layer-btn{text-align:center;padding:0 0 25px!important;}
  .layui-layer-btn .layui-layer-btn1 {margin-left: 12px;color: #666;background: #fff;border: 1px solid #c4c4c4;}
  .layui-layer-btn .layui-layer-btn1:hover{color: #2a8cd7;background: #ecf5fd;border: 1px solid #b8dbf6;}
  .layui-layer-btn .layui-layer-btn0 {color: #fff;background-color: #2a8cd7;border-color: #2a8cd7;}
  .layui-layer-btn .layui-layer-btn0:hover {border-color: #1d78be; background-color: #1d78be;}
  .layui-layer-setwin {right: 13px;top: 17px;}
  .layui-layer-dialog .layui-layer-content .layui-layer-ico{display: none;}
  .layui-layer-dialog .layui-layer-padding {width: 493px;height: 54px;padding:25px 25px 0;font-size: 16px;}
  .layui-layer-content{padding:25px;box-sizing:border-box;height: auto !important}
  .layui-p {padding-bottom: 25px;min-height: 40px;}
  .layui-layer-loading .layui-layer-content {margin: 0 auto;}
  .p0 .layui-layer-content{padding:0}

</style>
