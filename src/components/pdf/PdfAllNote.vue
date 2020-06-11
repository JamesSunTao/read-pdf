<template>
    <div class="chat-hide"  id="discom-scrollContainer">
        <ul id="discom-ulGlobleNote">
            <li >
                <div class="clearfix">
                    <div class="fl">
                        <a href="#" class="img-head-box mr5">
                            <img  class="img-head img-head-sm" />
                        </a>
                        <a href="#" class="name">孙涛</a>
                        <span class="ml10 f12c9">2019 12 45 62</span>
                    </div>
                </div>
                <p class="word-p">按时发达 胜多负少的 胜多负少的发送大萨达舒服点</p>
                <div class="clearfix part-b">
                    <a href="javascript:void(0);">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-pinglun3-copy"></use>
                        </svg>
                    </a>
                    <a href="javascript:;">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-duihaoqipao2"></use>
                        </svg>
                        <span>2</span>
                    </a>
                    <a href="javascript:;" title="@Resources.Common.Delete">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-del1"></use>
                        </svg>
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    export default {
        name: "PdfAllNote",
        data(){
            return {

            }
        },
        created(){

           this.getAllComments();
        },
        methods: {
            getAllComments() {
                var params = {
                    appId: window.InitData.AppId,
                    srcId: window.InitData.dbCode.length > 0 ? window.InitData.Lid : window.InitData.fileName,
                    page: 1,
                    pageCount: 7
                }
                pdfApi.GetAllComments(
                    params
                ).then((res) => {
                    if(res){

                    }
                }).catch((err) => {


                }).finally(() => {
                });

            },
        }
    }
</script>

<style scoped>
    .word-p{line-height:24px;margin-left:36px;word-break: break-all;}
    .reply-box {margin: 5px 0 5px 10px;}
    .reply-top .dis-time{float:right;margin-top:8px; color: #999; font-size: 12px}
    .bage{position:absolute;bottom:0;right:-1px; display:inline-block;width:9px;height:9px;background:#42bc00;border:2px solid #fff;border-radius:50%;}
    .flex-h100{flex-direction: column;display: -webkit-flex; height: 100%;}
    .learn-people {max-height:132px;overflow:hidden;}
    .chat-hide{height: 100%;padding: 15px 20px 63px;overflow-y:auto;background:#f4f4f4;border-top:1px solid #d8dfe5;/* position:absolute; *//* top:188px; *//* bottom:73px; *//* left:0; *//* right:0; */}
    .chat-hide li{margin-bottom:10px;border-bottom: 1px dashed #d5d5d5;}
    .chat-hide2{position:absolute;top:0px;bottom:73px;left:0;right:0;padding: 15px 20px 5px;overflow-y:auto;background:#f4f4f4;border-top:1px solid #d8dfe5;}
    .chat-hide2 li{margin-bottom:10px;}
    .learn-talk-box{position:absolute;top: 46px;bottom:0;left:0;right:0; background:#f8f8f8;}
    .lurking .bage{display:none;}
    .ml10{ margin-left: 10px;}
    .f12c9,.dis-time{color:#999;font-size:12px;}
    .part-b{margin:5px 0;font-size:12px;text-align: right;}
    .part-b a{margin-left:10px;padding-bottom:2px;}
    .part-b .cur{color: #ff944c;border-bottom: 2px solid #ff944c;}
    .part-b svg{font-size:16px;color:#3990d7;}

</style>