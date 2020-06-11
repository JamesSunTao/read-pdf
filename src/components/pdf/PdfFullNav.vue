<template>
    <div class="btn-group-black">
        <a href="#" class="btn-bl layer_tuichuquanping" title="退出全屏" @click="closeFull">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tuichuquanping"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl" id="menu-btn" title="显示目录" @click="menuFun">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-list_icon"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl" id="note-btn" title="显示笔记" @click="noteFun">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-edit2"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl percentage" title="放大" @click="zoomPage(1)">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-add"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl percentage" title="缩小" @click="zoomPage(-1)">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jian"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl mt5" title="上一页" @click="prePage">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-goBack1"></use>
            </svg>
        </a>
        <a href="#" class="btn-bl" title="下一页" @click="nextPage">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-toRight1"></use>
            </svg>
        </a>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    export default {
        name: "pdfFullNav",
        data(){
            return {

            }
        },
        computed: {
            ...mapState(['fullMenu','fullNote']),
        },
        created(){
            window.addEventListener('keydown', this.quit);
        },
        mounted(){
        },
        beforeDestory(){
            window.removeEventListener('keydown', this.quit)
        },
        methods:{
            // ...mapMutations(["setLeftStyle","setRightStyle"]),
            ...mapMutations('pdfData',["zoomPageW"]),
            ...mapMutations(["setCenterStyle","showArtTop","showFullMenu","showFullNote"]),
            ...mapActions('pdfData', ["prePage","nextPage"]),
            zoomPage(bool){
                var zoomObj = {
                    status:bool,
                    isFull:true
                }
                this.zoomPageW(zoomObj);
            },
            closeFull(){
                this.showArtTop(true);
                this.zoomPageW({
                    status:4,
                    isFull:false
                });
                this.setCenterStyle({
                    left:280+'px',
                    right:410+'px'
                })
                this.exitFull();
            },
            quit(e){
                var key = e.keyCode;
                if (key === 27) {
                    console.log('退出全屏')
                    this.showArtTop(true);
                    this.zoomPageW({
                    status:0,
                    isFull:false
                });
                this.setCenterStyle({
                    left:280+'px',
                    right:410+'px'
                })
                    this.exitFull();
                }
            },
            menuFun(){
                this.showFullMenu(!this.fullMenu);
            },
            noteFun(){
                this.showFullNote(!this.fullNote);
            },
            //退出全屏
            exitFull() {
                // 判断各种浏览器，找到正确的方法
                var el = document;
                var exitMethod = el.exitFullscreen || //W3C
                    el.mozCancelFullScreen || //Chrome等
                    el.webkitExitFullscreen || //FireFox
                    el.msExitFullscreen; //IE11
                if (exitMethod) {
                    exitMethod.call(el);
                }
                else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .btn-group-black{position: absolute;width: 40px;height: 300px;right: -64px;top: 50%;transform: translate(0,-50%);z-index: 9999;}
    .btn-bl{display:block;width:38px;padding:13px 0;text-align:center;line-height:1; font-size:22px;color:#cb9f7a;background:#fdf9f5;border:1px solid #faddc5;margin-top:-1px;cursor: pointer;}
     .btn-bl.cur, .btn-bl:hover{color:#3594ff}
    .btn-bl {color: #fff;border-color: #606166; background: #272626;}
    .btn-group-black{position: absolute; right: -64px;top: 50%;transform: translate(0,-50%);z-index:9999;}
    .mt5{ margin-top:5px;}
</style>