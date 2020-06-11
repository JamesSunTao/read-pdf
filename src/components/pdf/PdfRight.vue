<template>
    <section class="pdfRight_box">
        <div class="study-r-t" v-if="showNav">
             <span class="tab-btn tab-btn-r" id="js-tabBtn-r" @click="hideRight" :style="rightIconStyle" v-if="isRefer !== 'refer'">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-toRight1"></use>
                </svg>
            </span>
             <span class="ckwx"  @click="showType(1)"  :class="cur===1 ? 'b' : ''">
                 我的笔记
                 <u class="ding">{{noteList.length}}</u>
             </span>
            <span class="ckwx"  @click="showType(2)"  :class="cur===2 ? 'b' : ''"  v-if="fileSType ==1">
                 参考文献
                 <u class="ding">{{lookReferArr.length>0 ? lookReferArr.length:0}}</u>
             </span>
            <span class="ckwx"  @click="showType(3)"  :class="cur===3 ? 'b' : ''" v-if="fileSType ==1">
                 引证文献
                 <u class="ding">{{citeCount}}</u>
            </span>
            <!--<span class="ckwx"  @click="showType(3)"  :class="cur===3 ? 'b' : ''">-->
                 <!--全文笔记-->
                 <!--<u class="ding">{{noteList.length}}</u>-->
             <!--</span>-->
        </div>
        <keep-alive>
            <RightContent :curIndex="cur"/>
        </keep-alive>

        <!--<div class="r-hide" v-show="cur==3">-->
            <!--<PdfAllNote/>-->
        <!--</div>-->
        <!--拖拽-->
        <div class="drag-btn" @mousedown = "isDragShow({ dragShow:true,direction:2})"></div>
    </section>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import PdfAllNote from  '../pdf/PdfAllNote.vue'
    import RightContent from  '../pdf/RightContent.vue'
    import pdfApi from '@/api/pdf.js'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    import ueditorData from '@/store/modules/pdf/UeditorStore.js'
    export default {
        name: "PdfRight",
        props:['showNav'],
        components: {
            PdfAllNote,RightContent
        },
        data(){
            return {
                cur:1,
            }
        },
        computed: {
            ...mapState( ["isHideR","citeCount","rightIconStyle","lookReferArr","sourceReferArr","fsType","isRefer","fileSType"]),
            ...mapState('pdfData', ["noteList"]),
        },
        mounted(){
            this.initRightPage();
        },
        methods:{
            ...mapMutations(["setHideR","setRightStyle","setCenterStyle","setRightIconStyle","isDragShow","setCollectShow"]),
            ...mapMutations('pdfData', ["setNoteList"]),
            ...mapMutations('ueditorData', ["setUeContent","getUeContent","setTopSigns","clearTopSign"]),
            initRightPage(){
                if(window.InitData.Act === "refer" || window.InitData.Act === "compare"){
                    this.isHideR =  true;
                }
            },
            showType(index){
                this.cur = index;
                this.setCollectShow(false);
            },
            hideRight(){
                var rightW= $(".study-r-t").width()+1,rightStyle={},centerStyle={},rightIconStyle={};
                var centerL = $(".study-c").position().left;
                if(this.isHideR === false){
                    rightStyle = {
                        "right": -rightW + "px",
                        "width": rightW + "px"
                    };
                    rightIconStyle ={
                        "left": -26 + "px",
                        "transform":"rotate(180deg)"
                    };
                    centerStyle = {
                        "left":centerL + "px",
                        "right":0 + "px"
                    };

                }else{
                    rightStyle = {
                        "right": 0 + "px",
                        "width": rightW + "px"
                    };
                    rightIconStyle ={
                        "left": 0 + "px",
                        "transform":"rotate(0deg)"
                    };
                    centerStyle = {
                        "left":centerL + "px",
                        "right":rightW + "px"
                    }
                }
                this.setRightIconStyle(rightIconStyle);
                this.setRightStyle(rightStyle);
                this.setCenterStyle(centerStyle);
                this.setHideR(!this.isHideR) ;
            },
        }
    }
</script>

<style scoped>
    .pdfRight_box .drag-btn{position: absolute;top: 0;bottom: 0;left: -4px;width: 4px;cursor: w-resize;}
    .study-r-t{position:relative; height:45px;line-height:44px;text-align:center;font-size:14px;color:#666;background:#eceff4; border-bottom:1px solid #d9dfe8;justify-content: space-around;display: flex;display: -webkit-flex;}
    .study-r-t .ckwx{display: inline-block;cursor: pointer;margin: 0 4%;line-height: 41px;}
    .study-r-t .ckwx.b{font-weight: normal;color:#333;border-bottom:3px solid #ff8125;}
    .tab-btn{position:absolute;top:0;bottom:0;height:44px; width:20px;text-align:center;background: #eceff4; border:0 solid #d9dfe8; z-index: 2; cursor: pointer;left:0;border-right-width:1px}

    .r-hide {position: absolute;top: 46px;bottom: 0;left: 0;right: 0;overflow-y:  scroll;padding: 5px 8px;}
    .r-hide .note-ul .note-li { margin: 8px 12px;padding: 15px 15px 12px;box-sizing:border-box;word-break: break-all;color:#666;background: #fff;cursor: pointer;}
    .note-li .li-top{position: relative;overflow: hidden;}
    .note-li:hover{box-shadow:0 0 6px rgba(0,0,0,.12);outline: 1px solid #fccbad;}
    .cg9{color: #999;}
    .note-li:hover .ico-box-r{right:0;}
    .li-top .ico-box-r{ position:absolute;right: -78px;top:-2px;font-size: 16px;color:#3594ff; /*background:#f5f5f5;*/transition-duration: .3s;}
    .li-top .ico-box-r a{margin-left:6px;}
    .li-top .ico-box-r a:hover,.part-b a:hover svg{color:#f80;}
    .li-content{margin-top: 7px;}
    .r-hide .note-ul .is-cur{background: #fbf5dd;box-shadow: 0 0 5px #fccbad;outline: 1px solid #fccbad;}
    .li-bottom{margin-top: 7px;overflow: hidden;}
    .li-bottom .fl{float: left;}
    .note-li img{margin-top:10px;}

    .n-m{margin-top: 7px;}
    .ovhide {overflow: hidden;}
  /*  .note-li .mark-sm{margin:4px;padding: 0 4px; max-width: 8em;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;color: #cb9f7a; border: 1px solid #cb9f7a;border-radius: 2px;}*/
    .mark-sm{display: inline-block;margin: 0 2px 0 0;padding:2px 4px;vertical-align: middle;line-height: 1.4;font-size:12px;color: #666;background:#fff;border:1px solid #d7d7d7;border-radius:2px;}
    .bfc-l{float: left;margin-right: 5px;}

    /*参考文献*/
    .note-list{box-sizing: border-box;padding: 10px 5px;}
    .note-list li{margin-bottom:15px; clear:both;font-size:12px;line-height:18px;word-break: break-all;color: inherit;position: relative;}
    .note-list a:hover{color:#2a8cd7;text-decoration: none;}
    .note-tr-i{margin-top:2px;float:right;font-size:12px;color: #8595ec;}
    .co, .co svg {color: #ff7624;} 
</style>