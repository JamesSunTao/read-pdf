<template>
    <div class="art-top" v-show="headerShow" :class="{'top-hide':isShow}" @mouseenter="onMouseover()" @mouseleave="onMouseout()">
        <div class="top-left">
            <a href="#" id="stu-full-screen" title="全屏" v-if="isRefer != 'refer'" @click="showFull">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-quanpingzuidahua"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tuichuquanping"></use>
                </svg>
            </a>
            <a href="javascript:;" id="openinNewWindow" title="全屏" v-if="isRefer == 'refer'" @click="showReferFull">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-book1"></use>
                </svg>
            </a>

            <a href="javascript:void(0);" id="btnCopyCancel" title="取消选择文字" @click="btnCopyCancel" :class="isDrag ? 'cur' : ''">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-hand"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" id="btnCopy" title="选择文字" @click="btnCopy" :class="!isDrag ? 'cur' : ''">
                <svg class="icon icon-ch-word" aria-hidden="true">
                    <use xlink:href="#icon-ch-word"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" title="适应宽度">
                <svg class="icon icon-heng" aria-hidden="true" @click="zoomPage(0)">
                    <use xlink:href="#icon-heng"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" title="适应高度">
                <svg class="icon icon-shu" aria-hidden="true"  @click="zoomPage(2)">
                    <use xlink:href="#icon-shu"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" title="放大" class="percentage" @click="zoomPage(1)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-add02"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" title="缩小" class="percentage" @click="zoomPage(-1)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-minus02"></use>
                </svg>
            </a>
            <a href="javascript:void(0);" title="批注" style="display:inline-block;" :class=" isAddPeg ? 'cur' : ''" @click="addPeg">
                <svg class="icon annotation" aria-hidden="true">
                    <use xlink:href="#icon-biaozhu1"></use>
                </svg>
            </a>
            <a href="javascript:void(0)" title="对比" id="compare" v-if="isRefer !== 'refer'" @click="compareReadFun">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-duibi"></use>
                </svg>
            </a>
        </div>

        <div class="ss-page">
            <a href="#" @click="prePage()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-goLeft"></use>
                </svg>
            </a>
            <input type="text" id="pageIndex" :value="initPageNo"   @keyup.enter="gotoPage(initPageNo)" @blur="gotoPage(initPageNo)"/>
            <span class="vm"> / {{totalPage}}</span>
            <a href="#" @click="nextPage()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-goRight"></use>
                </svg>
            </a>
        </div>
        <a class="art-top-btn" @click="showDialog1()"><svg aria-hidden="true" class="icon"><use xlink:href="#icon-open"></use></svg></a>
        <HeaderREstudy/>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    import HeaderREstudy from '../public/HeaderREstudy'
    export default {
        name: "EstudyNav",
        data(){
            return {
                inputNo:5,
                data1:4,
                totalPage:window.InitData.pageCount,
                isShow:false,
                timer:null,
            }
        },
        components:{HeaderREstudy},
        computed: {
            ...mapState(['headerShow','isDrag','isRefer','otherArcInfo','iframSrcObj']),
            ...mapState('pdfData', ["initPageNo","isAddPeg","originalWidth"]),
        },
        methods:{
            ...mapMutations(["setReferCollectClass","setCompareIfrShow","showArtTop","isDragFun","setCenterStyle","setLeftStyle","setRightStyle","setLeftIconStyle","setRightIconStyle","setTaskInfo","setCompare"]),
            ...mapMutations('pdfData',["setAddPeg","zoomPageW"]),
            ...mapActions('pdfData', ["LoadPreNext","prePage","nextPage","setPageNoF"]),
            gotoPage(){
                var page = $("#pageIndex").val();
                this.setPageNoF(page);
            },
            addPeg(){
                if (this.isAddPeg === false){
                    this.setAddPeg(true);
                } else{
                    this.setAddPeg(false);
                }
            },
            showFull(){
                this.setLeftIconStyle({"right":"0px","transform":"rotate(0deg)"});
                this.setRightIconStyle({"left":"0px","transform":"rotate(0deg)"});
                this.setLeftStyle({"left":"0px","width":"280px"});
                this.setRightStyle({"right":"0px","width":"410px"});
                this.setCenterStyle({"left":"280px","right":"410px"});
                this.zoomPageW({
                    status:0,
                    isFull:false
                });
                this.showArtTop(false);
                this.fullScreen();
            },
            /*全屏展示*/
            fullScreen() {
                //var el = document.documentElement;
                var el = document.documentElement;
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                } else if (typeof window.ActiveXObject != "undefined") {
                    // for Internet Explorer
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            zoomPage(bool){
                this.zoomPageW({
                    status:bool,
                    isFull:false
                });
            },
            // 拖拽阅读
            btnCopyCancel(){
                this.isDragFun(true);
            },
            // 划词阅读
            btnCopy(){
                this.isDragFun(false);
            },
            showReferFull(){
                var href = window.InitData.ApplicationPath + 'article/pdfonline?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode=' + window.InitData.dbCode + '&filesourcetype='+window.InitData.FileSourceType + '&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&act=referxml' + '&pageType=POPPAGE#/pdf.html';
                window.open(href);
            },
            // 对比阅读
            compareReadFun(){
                var _this = this;
                _this.setCompare(true);

                pdfApi.getAllTask().then((res) => {
                    _this.setTaskInfo({show:true,taskListArr:res.result});
                    layer.open({
                        type: 1,
                        title: "选择文献",
                        area: ['880px', ''],
                        zIndex: 800,
                        shade: 0.3,
                        offset: 'auto',
                        resize: false,
                        //shadeClose: true, //点击遮罩关闭
                        content: $('.contrast-box'),
                        btn: ["确定", "取消"],
                        yes: function (index, layero) {

                            if(_this.iframSrcObj.iframSrc2.length <= 0){
                                layer.msg("请选择一篇文献再进行对比阅读",{skin:" layui-layer tip-orange "});
                                return false;
                            }else{
                                debugger
                                layer.close(index);
                                _this.setCompare(false);
                                _this.setCompareIfrShow(true);

                            }
                        },
                        cancel: function (index, layero) {//取消事件
                            _this.setCompare(false);
                            layer.close(index);
                        },
                        end: function (index, layero) {//无论是确认还是取消，只要层被销毁了，end都会执行，不携带任何参数。layer.open关闭事件
                            _this.setCompare(false);
                            layer.close(index);
                        }
                    });
                }).catch((err) => {
                }).finally(() => {
                });
            },
            //隐藏组件
           showDialog1(){
                this.isShow =!this.isShow;
           },
            //鼠标进入遮盖栏后此处隐藏掉
           onMouseover(){
                this.isShow=false;
           },
            //鼠标进入遮盖栏后此处显示出来
           onMouseout(){
                clearTimeout(this.timer);  //清除延迟执行 
                this.timer = setTimeout(()=>{   //设置延迟执行
                      this.isShow=true;
                      console.log('ok');
                },5000);
           }
        }
    }
</script>

<style scoped>
    /*center-top*/
   /*  .art-top{position:relative;top:0;left:0;padding:4px 22px 4px 15px;text-align:center;background:#eceff4; border-bottom:1px solid #d9dfe8;z-index: 5;transition:0.3s;} */
    .ss-page {display: inline-block;zoom: 1;vertical-align: middle;margin-top: 4px;}
    .ss-page a {margin: 0px 5px 0;vertical-align: middle;color: #506697;}
    .ss-page a:hover{color: #3594ff;}
    .ss-page input {width: 50px;height: 20px;line-height: 20px;border: 1px solid #b5bdca;border-radius: 2px;text-align: center;}
    .vm {vertical-align: middle;}
    .cur{color: #ff8125;}
</style>