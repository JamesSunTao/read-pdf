<template>
    <div class="contrast-pop">
        <a href="#" class="close-bg" @click="setCompareIfrShow(false)">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-close1"></use>
            </svg>
        </a>

        <div class="contrast-iframe clearfix">
            <iframe class="art-hide" id="compare-iframe1" :src="iframSrcObj.iframSrc1"></iframe>
            <iframe class="art-hide" id="compare-iframe2" :src="iframSrcObj.iframSrc2"></iframe>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: "compareIfram",
        computed: {
            ...mapState(['iframSrcObj']),
        },
        methods:{
            ...mapMutations(["setCompareIfrShow"]),
        }

    }
</script>

<style scoped>
    .contrast-iframe{max-width:1920px;margin:0 auto;height:calc(100% - 40px);}
    .contrast-pop{position:fixed;top: 0;bottom: 0;left:0;right:0;background:rgba(0,0,0,.82);z-index:101;width:100vw;height: 100vh;z-index:13;}
    .contrast-pop .close-bg{box-sizing: border-box;position: absolute; z-index: 111;background: rgba(0,0,0,0.5); right:0;top:0;width: 56px;height: 56px;line-height: 56px;text-align:  center;font-size: 24px;color: #fff;border-radius: 50%;z-index: 101;cursor:pointer;}
    .contrast-pop .art-hide{float:left;width: calc(50% - 60px);height:100%;max-width: 2000px;margin-top:20px;margin-left:40px;min-height: calc(100% - 40px);margin-bottom: 20px;}
    .contrast-pop .art-hide+.art-hide{float:right;margin-right:50px;margin-left:0;}
</style>