<template>
    <section id="water_mark">
        <div class="water_mark_box"   :style="zoomPageStyle">
            <div v-for="(pageItem,index) in pageArr" :key="'loadBox'+index">
                <div class="load-box"   v-if="pageItem.imgSrc" >
                    <img class="pdfImg" :src="pageItem.imgSrc" alt=""/>
                    <img class="CNKILogo-pub CNKILogo CNKILogo1"  src="../../../src/assets/images/CNKILogo.png"  v-if="pageItem.imgSrc"/>
                    <img class="CNKILogo-pub CNKILogo CNKILogo2"  src="../../../src/assets/images/CNKILogo.png" v-if="pageItem.imgSrc"/>
                    <!--<div class="under_Line"  v-for="lineItem in pageItem.printLineArr"  :style="lineItem.style"></div>-->
                </div>
            </div>
          
            <div class="print_note" v-if="waterNum > 0">
                <h1 class="note-h1">~ 笔记内容 ~</h1>
                <ul class="note-ul">
                    <li class="note-li" v-for="(noteItem , liIndex) in noteList" :key="liIndex">
                        <div class="li-top">
                            <span class="cg9">{{noteItem.createTime}}</span>
                        </div>

                        <div class="n-m">
                            <span v-if="noteItem.type==10"><img :src="noteItem.quote" /></span>
                            <span v-if="noteItem.type!=10" v-html="noteItem.quote" class="i"></span>
                        </div>
                        <div class="n-m" v-if="noteItem.noteExts && noteItem.noteExts.length">
                        <span class="bfc-l">
                            <span class="cy">标签：</span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tag"></use>
                            </svg>
                        </span>
                            <div class="ovhide">
                                <span class="mark-sm" v-for="(noteExtItem,index) in noteItem.noteExts" :key="'noteItem'+index">{{noteExtItem.signName}}</span>
                            </div>
                        </div>
                        <div class="li-bottom">
                            <span class="fl" v-if="noteItem.type==12">批注：</span>
                            <span class="fl"  v-if="noteItem.type==3">笔记：</span>
                            <span v-html="noteItem.content"></span>
                        </div>
                    </li>
                </ul>
                <div class="CNKILogo-posa">
                    <img class="CNKILogo"  src="../../../src/assets/images/CNKILogo.png" v-for="(item,index) in waterNum"  :key="'cnkiLogo'+index" alt="">
                </div>

            </div>

        </div>
    </section>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfData from '@/store/modules/pdf/pdfContent.js'

    export default {
        name: "PrintPdf",
        data(){
          return {
              waterNum:0
          }
        },
        computed: {
            ...mapState('pdfData', Object.keys(pdfData.state)),
        },
        watch:{
            noteList(val){
                this.initPrintData();
            }
        },
        mounted(){
            this.initPrintData();
        },
        methods:{
            initPrintData(){
                var noteNum = this.noteList.length;
                this.waterNum = parseInt(noteNum / 5)+5;
            }
        }

    }
</script>

<style scoped>
    #water_mark{position: absolute; left: 0;right: 0;top: 0;bottom: 0;margin:auto; background: rgba(0,0,0,0.5);z-index: 100000;}
    .water_mark_box{position: relative;background: #fff;overflow: hidden;}

    .water_mark_box .load-box{position: relative;}
    .water_mark_box .load-box .pdfImg{width: 100%;}
    .water_mark_box .load-box .mark-line {position: absolute;border-bottom: 2px solid #f60;}

    .CNKILogo-pub {position: absolute;left: 0;right: 0;margin: auto;}
    .water_mark_box .load-box .CNKILogo1{top: 15px;}
    .water_mark_box .load-box .CNKILogo2{bottom: 15px;}

    .r-hide {position: absolute;top: 46px;bottom: 0;left: 0;right: 0;overflow-y: auto;padding: 5px 8px;}
    .note-ul{box-sizing:border-box;padding: 10px 38px; }
    .r-hide .note-ul .note-li {margin: 8px 12px;word-break: break-all;color:#666;background: #fff;cursor: pointer;}
    .note-li {margin-top: 15px;box-sizing: border-box;padding: 10px 15px;}
    .note-li .li-top{position: relative;overflow: hidden;}
    .cg9{color: #999;}
    .li-top .ico-box-r{ position:absolute;right: -78px;top:-2px;font-size: 16px;color:#2a8cd7; /*background:#f5f5f5;*/transition-duration: .3s;}
    .li-top .ico-box-r a{margin-left:6px;}
    .li-top .ico-box-r a:hover,.part-b a:hover svg{color:#f60;}
    .li-content{margin-top: 7px;}
    .r-hide .note-ul .is-cur{background: #fbf5dd;}
    .li-bottom{margin-top: 7px;overflow: hidden;}

    .li-bottom .fl{float: left;}
    .print_note{position: relative;overflow: hidden;padding-top: 80px;}
    .CNKILogo-posa {position: absolute;left: 0;right: 0;top:0;margin: auto;}
    .print_note .CNKILogo-posa .CNKILogo:nth-child(2n+1){display:block;margin:1cm auto 12cm auto;}
    .print_note .CNKILogo-posa .CNKILogo:nth-child(2n){display:block;margin:12cm auto 1cm auto;}
    .note-h1{text-align: center;font-weight: 600;}
</style>