<template>
    <!-- 文献弹出层 -->
    <div id="readIframeDiv" class="readIframeDiv  pdf-none">
        <a href="#" class="close-bg" @click="closeReadIframe()">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-close1"></use>
            </svg>
        </a>
        <!-- <a :href="readIframeShow.readSrc" id="stu-full-screen" class="btn-blue btn-scroll" target="_blank" v-if="!isXml || isRefer=='refer'">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-read"></use>
            </svg>
            <span class="btn-scroll-span">展开阅读</span>
        </a>
        <a href="javascript:void(0)" class="btn-orange btn-scroll" @click="referSave" v-if="!isXml || isRefer=='refer'">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-collection"></use>
            </svg>
            <span class="btn-scroll-span">收藏到</span>
            <collectArticle v-if="collectShow && readIframeShow.isShow" :options="options" @close="setCollectShow(false)"></collectArticle>
        </a> -->
        <!--<div class="pop-study-t clearfix" id="PaperRead" ms-controller="PaperRead">-->
        <!--<img src=".././../assets/images/jiao.png" class="radio-img" />-->
        <!--<h1 class="pop-study-ht" :title="referTitle">-->
        <!--{{referTitle}}-->
        <!--</h1>-->
        <!--</div>-->
        <iframe width="100%" height="100%" align="center" frameborder="0" scrolling="no" class="Animation-toggle" id="readIframe" :src="readIframeShow.referSrc" name="popRead"></iframe>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: "ReferIframe",
        computed: {
            ...mapState(["isRefer","isXml","readIframeShow",'options',"referTitle","collectShow"]),
        },
        methods:{
            ...mapMutations(["setReadIframeShow","setCollectShow","setReadIframeShow"]),
            referSave(){
                this.setCollectShow( !this.collectShow);
            },
            closeReadIframe(){
                this.setReadIframeShow({
                    isShow:false,
                    referSrc:""
                })
                this.setCollectShow(false);
            }
        }
    }
</script>

<style scoped>
    .readIframeDiv {background: #fff; position: fixed;left: 279px;right: 409px;top: 20px;bottom: 0;height:auto!important;z-index: 100;box-shadow:0 0 4px rgba(18,18,18,.35), 0 0 20px rgba(18,18,18,.35)}
    .readIframeDiv:after {content: "";position: absolute;width: 100%;top: 46px; bottom: 0;left:0;background: #fff;z-index: 1;}
    .readIframeDiv iframe{position: relative;z-index: 2;}
    .close-bg{box-sizing: border-box;position: absolute;right: -29px;top: -20px;width: 56px;height: 56px;line-height: 56px;text-align:  center;font-size: 24px;color: #fff;background: rgba(0,0,0,0.5);border-radius: 50%;z-index: 101;cursor:pointer;}
    /*.pop-study-t{position:  relative;height: 44px;line-height: 44px;border-bottom: 2px solid #3990d7;background: #fff;}*/
    /*.pop-study-t:before{content: "";position: absolute;left: 0;top: 0;height: 43px;width: 100px;background: url('.././../assets/images/jiao-bj.png') center;}*/
    /*.pop-study-ht{box-sizing: border-box;float: right;position: relative;width:calc(100% - 100px);height: 43px; padding: 0 100px 0 0;vertical-align: top;text-align: center;font-size: 18px;font-weight: bold; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;z-index: 1;background:linear-gradient(to bottom, rgba(214,214,216,1) 0%,#f4f4f7 57%);}*/
/*参考文献弹层*/
    .btn-scroll{position:fixed;box-sizing:border-box;right:409px;top:64px;z-index:101;width: 30px;height:30px;padding: 0 9px 0 7px;white-space:nowrap;border-radius:4px 0 0 4px;text-align:center;line-height: 26px;color:#fff;}
    .btn-scroll:hover .btn-scroll-span,.btn-scroll.cur .btn-scroll-span{width:auto;}
    .btn-scroll:hover,.btn-scroll.cur{width:auto;}
    .btn-scroll.btn-orange{top:104px}
    .btn-scroll .icon{font-size:16px;vertical-align: middle;/* line-height: 30px; */}
    .btn-scroll-span{width:0;overflow:hidden;transition: .3s;display: inline-block;vertical-align: middle;/* line-height: 30px; */}

    .btn-blue{color:#fff;background-color: #3594ff;border-color: #3594ff;}
    .btn-blue:hover{color:#fff;background:#3474d9;border-color:#3474d9}
    .btn-orange{color:#fff;background:#f80;border-color:#f18100}
    .btn-orange:hover{color:#fff;background:#f18100;border-color:#f18100}
</style>