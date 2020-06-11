<template>
      <!--学科资源包 -->
      <div class="resourec-wrap"><!--如需展开给此处增加show样式名-->
          <div class="resource-title">
              <a href="javascript:;" class="res-ta" :class="{'cur':vtype===1}" @click="dealType(1)">
                  <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-list_icon"></use>
                  </svg>
                  <span class="res-t">目录</span>
              </a>
              <a href="javascript:;" class="res-ta" :class="{'cur':vtype===2}"  @click="dealType(2)">
                  <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-ziyuan"></use>
                  </svg>
                  <span class="res-t">拓展资源</span>
              </a>
              <a href="javascript:;" class="res-ta" :class="{'cur':vtype===3}"  @click="dealType(3)">
                  <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-ziyuan2"></use>
                  </svg>
                  <span class="res-t">编者笔记</span>
              </a>
          </div>
          
          <!-- 目录  默认是全部展开的，点击标题收起内容，收起方法已写到注释中-->
          <div class="resource-con" :class="{'resource-con-cur':vtype===1}">
              <div class="note-list-hide" >
                  <div class="note-list-box" v-for ="(catalogItem,index) in sourceData" :class="{'hide-box':!catalogItem.level}" :key="'source1'+index"><!--如需收起在此处增加hide-box样式名-->
                      <div class="f-list-title">
                          <svg class="icon" aria-hidden="true" @click="catalogItem.level=!catalogItem.level">
                              <use xlink:href="#icon-toRight1"></use>
                          </svg>
                          <span class="nbsp1">{{catalogItem.title}}</span>
                      </div>

                      <ul class="f-list">
                          <!-- 这里的fatherID 仅仅是用来判断当前激活的index，无实际功能性作用 -->       
                          <li class="f-li" v-for="(caItem,caindex) in catalogItem.xmrdResource" @click="catalogItem.fatherID=caindex" :key="'caItem'+caindex">
                              <i class="i-f" :class="iconType(caItem)"></i>
                              <a :href="addUrl(caItem)" target="_blank" class="f-a" :class="{'cur':catalogItem.fatherID == caindex}">{{caItem.resourceTitle}}</a>
                          </li>                     
                      </ul>
                  </div>
              </div>
          </div>
          <!-- 拓展资源-->
          <div class="resource-con" :class="{'resource-con-cur':vtype===2}">
              <div class="f-list-hide">
                    <ul class="f-list">
                        <li class="f-li"  v-for ="(tuoItem,index) in sourceData2" :key="'source2'+index">
                            <i class="i-f" :class="iconType(tuoItem)"></i>
                            <a :href="addUrl(tuoItem)"  target="_blank" class="f-a">{{tuoItem.resourceTitle}}</a>
                        </li>
                    </ul>
                    <ul v-if="isSource2_show">
                        <li class="i-null-box">
                            <i class="i-null">&#161</i><span>无拓展资源！</span>
                        </li>
                    </ul>
              </div>
          </div>
          <!-- 笔记 -->
          <div class="resource-con" :class="{'resource-con-cur':vtype===3}">
              <div class="res-note-top" v-if="sourceData3.length>0">
                  <div class="fl">共<span>{{sourceData3.length}}</span>条笔记</div>
                  <div class="fr">编者：<span>jsuzzy</span></div>
              </div>
              <div class="res-note-hide"> 
                  <ul class="note-ul">
                      <li class="res-note-li"  v-for ="(noteItem,noteIndex) in sourceData3" :key="noteIndex">
                          <div class="res-note-time">{{noteItem.createTime}}</div>
                          <div class="n-m i">原文：{{noteItem.quote}} </div>
                          <div class="n-m">笔记：<span v-html="noteItem.content" class="noteCon"></span></div>
                      </li>               
                  </ul>
                   <ul v-if="isSource3_show">
                        <li class="i-null-box">
                            <i class="i-null">&#161</i><span>无笔记内容！</span>
                        </li>
                    </ul>
              </div>
          </div>
      </div>
      <!--学科资源包 over -->

</template>

<script>
import pdfApi from '@/api/pdf.js'
export default {
    data () {
        return {
            curType:0,
            vtype:0,
            sourceData:[],
            sourceData2:[],
            sourceData3:[],
            reqData:false,
            reqData2:false,
            reqData3:false,
            isSource2_show:false,
            isSource3_show:false
        };
    },
    created(){
       
    },
    methods: {
        initCatlogData(){
            var _this = this;
              if (_this.reqData) {
                 return false;
             }
            pdfApi.GetPackFullInfos({
                "dbCode":window.InitData.dbCode
            }).then((res) => {
                _this.reqData = true;
                _this.sourceData = res.result.xmrdSection
            }).catch((err) => {
            }).finally(() => {
            });
        },
        // 拓展资源
        initPackData(){
            var _this = this;
              if (_this.reqData2) {
                 return false;
             }
            pdfApi.GetPackExitFiles({
                "dbCode":window.InitData.dbCode,
                "fileNames":window.InitData.fileName
            }).then((res) => {       
                _this.reqData2 = true;        
                _this.sourceData2 = res.result;
                if (res.result.length == 0) {
                    _this.isSource2_show = true;
                    console.log(111)
                }
            }).catch((err) => {
            }).finally(() => {
            });
        },
         initPackNotes(){
             var _this = this;
             if (_this.reqData3) {
                 return false;
             }
            pdfApi.GetPackNotes({
               "dbCode":window.InitData.dbCode,
               "fileNames":window.InitData.fileName
            }).then((res) => {
                _this.reqData3 = true;
                _this.sourceData3 = res.result;
                 if (res.result.length == 0) {
                    _this.isSource3_show = true;
                }
            }).catch((err) => {
            }).finally(() => {
            });
        },
        addUrl(it){
           return  window.InitData.ApplicationPath + 'readonline.ashx?filename=' + it.resourceFileName + '&tablename=' + it.resourceTableCode + '&dbcode=' + it.packName + '&filesourcetype=' + it.fileSourceType + '&topic=&appId=&devtype=';
        },
        dealType(num){                     
            if(this.curType !== num ){
                this.vtype = num;
                this.curType = num;
                switch (num) {
                    case 1:
                        this.initCatlogData()
                        break;
                    case 2:
                        this.initPackData()
                        break;
                    case 3:
                        this.initPackNotes()
                        break;    
                    default:
                        return false
                        break;
               }
            }else{
                this.vtype = 0;
                this.curType = 0;
        }
        
        },
        iconType (data) {
            
            let reg = /xml/ig;
            if (data.fileSourceType == 1) {
                if (reg.test(data.fileType)) {
                    return "i-xml";
                } else {
                    return "i-pdf";
                }
            } else {
                if (data.fileType == '7') {
                    return "i-xml";
                } else if (data.fileType == '5') {
                    return "i-pdf";
                } else if (data.fileType == '4' || data.fileType == '6') {
                    return "i-ppt";
                } else if (data.fileType == '3') {
                    return "i-caj";
                } else if (data.fileType == '1' || data.fileType == '2') {
                    return "i-word";
                } else if (data.fileType == '0') {
                    return "i-menu";
                } else {
                    return "i-other";
                }
            }  
        }
    }
}

</script>
<style scoped>
/*学科资源包*/
.resource-title{position:fixed;right:0;top:30%;z-index:11;background:#dfebff;border:1px solid #c8ddff;border-right:0;border-radius: 4px 0 0 4px;/* overflow: hidden; */}
.res-ta{display:block;text-align:center;width:38px;box-sizing:border-box;padding:10px 7px;color:#506697;font-size:12px;line-height:1.2;}
.res-ta+.res-ta{margin-top:1px;}
.res-ta.cur,.res-ta.cur:hover{background:#3474d9;color:#fff}
.res-ta:hover{background:#7b9ccf;color:#fff}
.res-ta svg{font-size:20px;margin-bottom:7px}
.res-ta:first-child{border-radius: 4px 0 0 0}
.res-ta:last-child{border-radius: 0 0 0 4px}
.f-li{line-height:24px;overflow:hidden;margin-top:15px;padding:0 20px 0 18px}
.icon{cursor: pointer;}
/* .i-f{display:inline-block;width:16px;height:16px;line-height:1;font-size:17px;margin:4px 7px 0 0;float:left;vertical-align:middle; background:url(../../assets/images/study-type.png) no-repeat center;}
.f-a,
.i-f.cy{background:0 0}
.i-xml{background-position: -27px -3px;}
.i-pdf{background-position: -1px -3px;}
.i-menu{background-position: -56px -3px;}
.i-ppt{background-position: -108px -3px;}
.i-word{background-position: -134px -3px;}
.i-caj{background-position: -81px -3px;}
.i-other{background-position:-164px -3px}
.i-picture{background-position:-191px -3px}
.i-book{background-position:-218px -3px}
.i-video{background-position:-245px -3px}
.i-music{background-position:-272px -3px}
.i-file{background-position:-297px -3px} */
.i-list a{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.resource-con{position:fixed;right:0;top:45px;bottom:0;width:438px;padding-right:38px;background:#f2f9ff;z-index:10;box-sizing:border-box;box-shadow:0 2px 8px rgba(83,83,83,.32);border:1px solid #e1ebf3;transition:.3s;right:-438px}
.resource-con-cur{right:0}
.resource-con:after{content:"";width:36px;height:100%;position:absolute;right:0;top:0;background:#dfebff;border:1px solid #c8ddff}
.f-list-hide,.note-list-hide{height:100%;overflow-y:auto}
.res-note-hide{height:calc(100% - 33px);overflow-y:auto}
.f-a{overflow:hidden;display:block}
.f-a.cur,.f-a:hover{color:#3594ff;}
.res-note-top{font-size:12px;color:#666;line-height:32px;height:32px;padding:0 14px;overflow:hidden;background:#fff;border-bottom:1px solid #e1ebf3}
.res-note-li{box-sizing:border-box;word-break:break-all;color:#333;line-height:24px;margin:0 20px;padding:10px 0;background:0 0}
.res-note-li+.res-note-li{border-top:1px solid #e1ebf3}
.res-note-time{font-size:12px;color:#999}
.n-m.i{color:#999}
.f-list-title{font-size:14px;font-weight:700;margin-bottom:-10px;margin-top:10px}
.nbsp1{margin-right:1em}
.note-list-hide .f-li{padding-left:40px}
.f-list-title svg{font-size:12px;color:#999;padding:10px;vertical-align:middle;margin-left:3px}
.note-list-box+.note-list-box{margin-top:30px}
.hide-box .f-list-title svg{transform:rotate(90deg)}
.hide-box .f-list{height:0;overflow:hidden}
.i-null {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid #ccc;
    text-align: center;
    background: #fff;
    line-height: 20px;
    color: #d0d0d0;
    transform: rotate(-180deg);
    font-size: 18px;
    margin: 0 5px 0 0;
    vertical-align: middle;
}
.noteCon{display: inline-block;}

    .i-null:before { 
        /* content:""; */
    }

li.i-null-box {
    text-align: center;
    margin: 40px auto;
    color: #666;
    font-size: 16px;
}

</style>