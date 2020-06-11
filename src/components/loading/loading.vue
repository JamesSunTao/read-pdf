<template>
<div class="empty-box">
        <!-- 下载 -->
        <div class="loading-2" id="loading" v-if="codeStatus== '1'">
            <div class="loading-left">
                <img src="../../assets/images/loading.gif" />
            </div>
            <p>文献正在转换中，请稍候！</p>
        </div>

        <!-- 上传到HFS服务器 -->
         <div class="loading-2" id="uploadHfs" v-if="codeStatus == '5000'">
            <div class="loading-left">
                <span class="loading-num" id="percentage"></span>
                <img src="../../assets/images/loading.gif" />
            </div>
            <p>文献正在转换中，请稍候！</p>
        </div>
        <div class="loading-2" id="uploadHfs" v-if="codeStatus == '5001'">
            <div class="loading-left">
                <span class="loading-num" id="percentage"></span>
                <img src="../../assets/images/loading.gif" />
            </div>
            <p>文献正在转换中，请稍候！</p>
        </div>

        <!-- 碎片化 -->
        <div class="loading-2" id="chapter" v-if="codeStatus == '5002'">
            <div class="loading-left">
                <span class="loading-num" id="percentage"></span>
                <img src="../../assets/images/loading.gif" />
            </div>
            <p><span id="suipianhua"></span>文献正在转换中，请稍候！</p>
        </div>

        <!-- 正在打开文章 -->
        <div class="empity" id="finshed" v-if="codeStatus == '0'">
            <h3>正在打开，请稍候！</h3>
        </div>

        <!-- 打开失败 -->
        <div class="loading-2" id="failed" v-if="codeStatus == '-2'">
            <div class="loading-left">
                <img src="../../assets/images/tipTxt.png" />
            </div>
            <p id="error_msg">{{errorMsg}}</p>
        </div>
    </div>
</template>

<script>
import loadApi from '@/api/loadingApi.js'
export default {
    data () {
        return {
            time:1000,
            timeCount:0,
            codeStatus:'1',
            errorMsg:''
        };
    },
    created(){
        this.initCode()
    },
    watch:{
       timeCount(val){
            // debugger
            if (val >= 70000) {  // 总时间达到70s后 关闭定时器 提示用户稍后重试
                $("#error_msg").html("文件过大，后台正在拼命转换中，请稍后再来阅读！");
                clearInterval(window.timer);   
            }
       }
    },
    methods: {
        initCode(){
            if (window.InitData.DcType == 4) {
                this.time = 5000; // 博硕士5s请求一次
            } 
            var _this = this;
            window.timer = setInterval(function () {
            　　var data = {
                    "filename": window.InitData.fileName,
                    "dbcode": window.InitData.dbCode,
                    "tasktype": window.InitData.tasktype,
                    "blag": Math.random()
                }
                loadApi.GetCode(
                    data
                ).then((res) => {
                    _this.timeCount = _this.timeCount + _this.time;
                    _this.codeStatus = res.getcode;
                    if (res.getcode == '-2') {
                        _this.errorMsg = "文件过大，后台正在拼命转换中，请稍后再来阅读！"
                    } 
                    if (res.getcode == '0') {
                       clearInterval(window.timer);   
                       var urlPdf =  window.InitData.ApplicationPath +  'readonline.ashx?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode=' + window.InitData.dbCode + '&filesourcetype='+window.InitData.FileSourceType+'&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype='+window.InitData.Act + '&customReading='+window.InitData.CustomReading+'&pageType=POPPAGE#';
                       window.location.href =  urlPdf;              
                    }
                }).catch((err) => {
                    
                     clearInterval(window.timer); 
                     
                }).finally(() => {
                
                });　　　
            }, _this.time) ;
          
        }
    }
}

</script>
<style>
    .empty-box {position: relative; height:100%;background: #f4f4f4;}
    .empity{ position: absolute;top: 30%;bottom: 0;left: 0; right: 0;text-align: center;}
    .empity h3{font-size:24px;}
    .empity p{font-size:16px;margin:10px 0 20px;}
    .empity .btn{font-size:15px;color:#fff;padding:8px 20px;background: #428bca;border-radius:3px;}
    .loading,.loading-2{position:absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);/* margin-top: -45px; */min-width: 350px;max-width: 400px;/* text-align: center; */padding: 20px 10px;background:#fff;margin: 0 auto;overflow:hidden;/* display: inline-block; */*margin-left:-165px;border-radius: 10px;box-shadow: 0 0 10px #000;border: 1px solid #e6e6e6;box-shadow: 0 0 8px 0 rgba(96,96,96,.32);word-wrap: break-word;transition: 0.3s;}
    .loading p, .loading-left, .loading-2 p{display:inline-block;*display: inline;zoom:1;vertical-align: middle;font: 16px/1.5 "\5FAE\8F6F\96C5\9ED1";}
    .loading img{width: 63px;height: 63px;vertical-align: middle;}
    .loading p{ width: 82%; margin-left: 4%;}
    .loading-left{position: relative;width:63px;height:63px;margin-right: 10px;}
    .loading-num{position: absolute;top: 50%; left: 50%; margin-top: -12px;margin-left: -20px;width: 40px;text-align: center;}
    .loading-2 img{width:100%;}
    .loading-left+p {max-width:300px;}

    .empty-box-Reference .loading-2{margin-left: -150px;margin-top: 0;}
</style>