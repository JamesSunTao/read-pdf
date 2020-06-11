<template>
 <section class="pdfRight_box">
        <div class="study-r-t">
            <span class="ckwx">
                我的笔记
                <u class="ding">7</u>
            </span>
        </div>  
        <div class="r-hide">
            <ul class="note-ul">
                <li class="note-li" @click="playByTime('2:10')">
                    <div class="li-top">
                        <span class="cg9">时间：1:13</span>
                        <div class="ico-box-r">
                            <a href="javascript:;" title="编辑">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edtor"></use>
                                </svg>
                            </a>
                            <a href="javascript:;" title="删除">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-del1"></use>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="n-m">
                        <span class="fl" >笔记：</span>
                        <span> 我是笔记，我是笔记</span>
                    </div>
                    <div class="n-m">
                        <span class="bfc-l">
                            <span class="cy">标签：</span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tag"></use>
                            </svg>
                        </span>
                        <div class="ovhide">
                            <span class="mark-sm" >标签1</span> <span class="mark-sm" >标签3</span> <span class="mark-sm" >标签2</span>
                        </div>
                    </div>
                    <div class="li-bottom">
                        <span class="fl" >创建时间：</span>
                        <span> 2019-09-09 11:25</span>
                    </div>
                </li>
            </ul>
            
             <div class="btn-block-box" ><a href="javascript:;" class="btn-block" @click="addNote">添加笔记</a> </div>
             
        </div> 
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ueditorData from '@/store/modules/pdf/UeditorStore.js'
export default {
    data () {
        return {
             
        };
    },
    computed:{
       ...mapState('ueditorData',['ueText'])
    },
    methods: {
        ...mapMutations('ueditorData', ["getUeContent","clearTopSign"]),
        addNote(){
            this.$parent.pauseFun();
            var _this = this;
            layer.open({
                type: 1,
                title: '添加笔记',   //标题
                area:["410px","475px"],
                offset:"r",
                content: $('#ueBox'),
                zIndex:10, //层优先级
                btn: ['确定', '取消'], //按钮组
                yes: function(index, layero){
                    //do something
                    _this.getUeContent();
                    // console.log("getfromUe:"+content);
                    // _this.noteReplay();
                    layer.close(index);
                },
                cancel: function(index, layero){
                    layer.close(index)
                    return false;
                }
            });
       },
       playByTime(time){
          this.$parent.playFun(35)
       }
    }
}

</script>
<style scoped>
.btn-block-box{position: absolute;left: 0;right: 0;bottom: 0;padding:10px 13px;background:#fff}
.btn-block{display:block;height:36px;line-height:36px;text-align:center;color:#fff;background:#3594ff;border-radius:4px}
.pdfRight_box  .note-ul {overflow-y: auto; height: calc(100% - 56px);}
.pdfRight_box {height: 100%;}
.study-r-t{position:relative; height:45px;line-height:44px;text-align:center;font-size:14px;color:#666;background:#eceff4; border-bottom:1px solid #d9dfe8;justify-content: space-around;display: flex;display: -webkit-flex;}
    .study-r-t .ckwx{display: inline-block;cursor: pointer;margin: 0 4%;line-height: 41px;}
    .study-r-t .ckwx.b{font-weight: normal;color:#333;border-bottom:3px solid #ff8125;}
    .tab-btn{position:absolute;top:0;bottom:0;height:44px; width:20px;text-align:center;background: #eceff4; border:0 solid #d9dfe8; z-index: 2; cursor: pointer;left:0;border-right-width:1px}

    .r-hide {position: absolute;top: 46px;bottom: 0;left: 0;right: 0;overflow-y: scroll;padding: 5px 8px;}
    .r-hide .note-ul .note-li {margin: 8px 12px;padding: 15px 15px 12px;box-sizing:border-box;word-break: break-all;color:#666;background: #fff;cursor: pointer;}
    .note-li .li-top{position: relative;overflow: hidden;}
    .note-li:hover{box-shadow:0 0 6px rgba(0,0,0,.12);outline: 1px solid #fccbad;}
    .cg9{color: #999;}
    .note-li:hover .ico-box-r{right:0;}
    .li-top .ico-box-r{ position:absolute;right: -78px;top:-2px;font-size: 16px;color:#3594ff; /*background:#f5f5f5;*/transition-duration: .3s;}
    .li-top .ico-box-r a{margin-left:6px;}
    .li-top .ico-box-r a:hover,.part-b a:hover svg{color:#f80;}
    .li-content{margin-top: 7px;}
    .r-hide .note-ul .is-cur{background: #fbf5dd;}
    .li-bottom{margin-top: 7px;overflow: hidden;}
    .li-bottom .fl{float: left;}
    .note-li img{margin-top:10px;}
    .note-li img[src*="attachment/fileTypeImages"] {margin-top: 0;}
    .n-m{margin-top: 7px;}
    .ovhide {overflow: hidden;}
  /*  .note-li .mark-sm{margin:4px;padding: 0 4px; max-width: 8em;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;color: #cb9f7a; border: 1px solid #cb9f7a;border-radius: 2px;}*/
    .mark-sm{display: inline-block;margin: 0 2px 0 0;padding:2px 4px;vertical-align: middle;line-height: 1.4;font-size:12px;color: #666;background:#fff;border:1px solid #d7d7d7;border-radius:2px;}
    .bfc-l{float: left;margin-right: 5px;}

    /*参考文献*/
    .note-list{box-sizing: border-box;padding: 10px 5px;}
    .note-list li{margin-bottom:15px; clear:both;font-size:12px;line-height:18px;word-break: break-all;color: inherit;position: relative;} 
    .note-list a:hover{color:#2a8cd7;text-decoration: none;}
    .note-tr-i{margin-top:2px;float:right;font-size:12px;color: #8595ae;}
    .co, .co svg {color: #ff7624;}
</style>