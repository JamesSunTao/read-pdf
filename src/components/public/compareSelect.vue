<template>
    <div class="contrast-box" style="display: none;">
        <div class="contrast-top clearfix" >
            <div class="wx-select wx-static  contrast-select">
                <div class="wx-text" @click="showAllTask = !showAllTask">
                    <span class="select-text">{{curText}}</span>
                    <a href="#" class="db-jt"></a>
                </div>
                <!-- <select-Menu v-show="showAllTask" :taskData = "taskListObj.taskListArr"></select-Menu>   -->
                <ul class="select-up select-up-posr" v-show="showAllTask">
                    <li class='hasch' v-for="(item,index) in taskListObj.taskListArr"  @click="addCur1(item,index)" :key="'taskI'+index">
                        <a href='#' :class="{'db-jt':item.subTaskInfos.length>0}" @click.stop="item.summary = !item.summary"></a><span class='fold'  :class="{'cur':curIndex === index}">{{item.title}}</span>
                        <ul v-show="item.summary == true" >
                            <li v-for="(child_item , child_index) in item.subTaskInfos" @click.stop="addCur1(child_item,child_index)" :key="child_index"> 
                                <a href='#' :class="{'db-jt':child_item.subTaskInfos.length>0}"  @click.stop="child_item.summary = !child_item.summary"></a>
                                <span :class="{'cur':curIndex === child_index}">{{child_item.title}}</span>
                                <select-Menu :taskData = "child_item.subTaskInfos" :curIndex="curIndex" :show="child_item.summary"></select-Menu>  
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <a href="#" id="clearsub" class="cb vm" @click="clearSub">清除选择</a>

            <div class="search-top fr">
                <input id="searchstr3" type="text" placeholder="检索当前专题下的文献" v-model="titleKeyword" @keyup.enter="filterByKey" class="search-txt">
                <a href="#" id="search_btn3" class="search-btn" @click="filterByKey">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-search"></use>
                    </svg>
                </a>
            </div>
        </div>
        <div id="sub-table-content">
            <div class="con-table-hide" @scroll="onScroll">
                <table class="table">
                    <thead class="thead">
                    <tr>
                        <th>题名</th>
                        <th>作者</th>
                        <th>来源</th>
                        <th>类型</th>
                        <th  width="120px">出版年份</th>
                    </tr>
                    </thead>
                    <tbody id="sub-table">
                    <tr v-for="(detailItem,index) in detailList" :class="{'is-filter':detailItem.fileSourceType == 2 && !detailItem.fileCode}" :key="'detailItem'+index">
                        <td>
                            <span class="radio-f">
                                <input name="subtd" type="radio" value="" @click="getCurArcInfo(detailItem)" :disabled="detailItem.fileSourceType == 2 && !detailItem.fileCode">
                                <u class="radio"></u>
                            </span>
                            <i class="type" :class="detailItem.fileType"></i>
                            <span class="td-con"><span v-if="detailItem.fileSourceType == 2 && !detailItem.fileCode">（未上传全文）</span>{{detailItem.title}} <span style="color: rgba(115, 97, 97, 0.71);" v-if="!detailItem.title">暂无标题</span> </span>
                        </td>
                        <td v-if="detailItem.author != null">{{detailItem.author}}</td>
                        <td v-if="detailItem.author === null">---</td>
                        <td>{{detailItem.source}}</td>
                        <td>{{detailItem.resourceType}}</td>
                        <td>{{detailItem.postTime}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import SelectMenu from './selectMenu'
    export default {
        name: "compareSelect",
        components: {
            SelectMenu
        },
        data(){
            return {
               curIndex:0,
               curText:"",
               showAllTask:false,
               detailList:[],
               curStudyInfo:{},
               titleKeyword:"",
               isOff:true,
               curPage:1,
               bigPage:1,
               curItem:{}
            }
        },
        computed: {
            ...mapState(['taskListObj','isCompare','initStatus']),
           
        },
        
        watch:{
            taskListObj(val){
            
                if (!!this.taskListObj.taskListArr){
                    this.detailList = [];
                   this.curText  =  this.taskListObj.taskListArr[0].title;
                   if(this.initStatus === 0){
                       this.addCur1(this.taskListObj.taskListArr[0],0);
                       this.curStudyInfo = this.taskListObj.taskListArr[0];
                   }

                }
            }
        },
        
        methods:{
            ...mapMutations(['setIframSrcInfo','setInitStatus']),
            getCurArcInfo(item){
              var src2 =   window.InitData.domain + window.InitData.ApplicationPath.substr(1) + "readonline.ashx?" +
                "filename=" + item.fileCode + "&tablename=" + item.tableName + "&dbcode=" + item.dbcode +
                "&topic=&fileSourceType=" + item.fileSourceType + "&from=" + "right" + "&groupid=" +
                "&appId=" + window.InitData.AppId + "&devtype=compare";
                this.setIframSrcInfo(src2);

            },
            filterByKey(){
                this.addCur(this.curStudyInfo,0);
                this.setInitStatus(0);
            },
            onScroll(){
                var scrollTop = $(".contrast-box #sub-table-content .con-table-hide").scrollTop();
                var windowHeight = $(".contrast-box #sub-table-content .con-table-hide").height();  //窗口高度
               // console.log('scrollTop:'+scrollTop+'---windowHeight:'+windowHeight)
                if (scrollTop + windowHeight + 10 > $(".contrast-box #sub-table-content .con-table-hide>.table").height()) {
                   
                   if(this.isOff){
                       
                    this.curPage = this.curPage + 1;
                    console.log(this.curPage);
                     this.addCur(this.curItem,0)
                   }
                }
            },
            addCur1(item,index){
                this.detailList = [];
                this.bigPage = 1;
                this.curPage = 1;
                this.curItem = item;
                this.addCur(item,index);
            },
            addCur(item,index){
                if(this.curPage>this.bigPage){
                   return false;
                }
                this.isOff = false;
                var _this = this;
                this.curStudyInfo = item;
                this.curIndex = index;
                this.curText = item.title;
                $("#sub-table input[type='radio']:checked").prop("checked", false);
                pdfApi.getStudyDetail({
                    "studyId": item.id,
                    "signKey": "",
                    "fileName": window.InitData.fileName,
                    "titleKeyword": _this.titleKeyword,
                    "index": _this.curPage,
                    "pageSize": 10,
                    "status": 0,
                    "orderby": 2
                }).then((res) => {
                    _this.isOff = true;
                    _this.bigPage = Math.ceil(res.count/10);
                    $.each(res.data, function (index) {
                        _this.isOff = true;
                        var fileType = "";
                        if (res.data[index].fileSourceType == 1) {
                            if (res.data[index].fileType && res.data[index].fileType.toLowerCase().indexOf("xml") > -1) {
                                fileType = "type-xml";
                            }else {
                                fileType = "type-pdf";
                            }
                        } else if(res.data[index].fileSourceType == 2) {
                            switch (parseInt(res.data[index].fileType)) {
                                case 1: fileType = "type-word";
                                    break;
                                case 2: fileType = "type-word";
                                    break;
                                case 3: fileType = "type-caj";
                                    break;
                                case 4: fileType = "type-ppt";
                                    break;
                                case 5: fileType = "type-pdf";
                                    break;
                                case 6: fileType = "type-ppt";
                                    break;
                                case 7: fileType = "type-xml";
                                    break;
                                default:
                                    fileType = "type-other";
                            }
                        }else {
                            fileType = "type-other";
                        }
                        res.data[index].fileType = fileType;
                    })
                    _this.detailList = _this.detailList.concat(res.data);
                  
                    _this.showAllTask = false;

                }).catch((err) => {
                }).finally(() => {
                });
            },
            // 清除选择的文献
            clearSub(){
                this.setIframSrcInfo("");
                $("#sub-table input[type='radio']:checked").prop("checked", false);
            }
        }
    }
</script>

<style>
    #xml-read-content{background:#fbfaf8;}
    .xml-read-content .ChapterContainerWrap {height: 100%;overflow-y: auto;}
    .contrast-box .table{width:100%;border-collapse:collapse}
    .contrast-box .table th{box-sizing: border-box;font-weight:400;background:#f4f4f4;padding:9px;text-align: left;border-bottom: 1px solid #ebeef5;background: #ecf6ff;}
    .contrast-box .table td{box-sizing: border-box;padding:12px 9px;border-bottom: 1px dashed #ebeef5;}
    .contrast-box .table tr:nth-child(even) td{background:#fcfbfb}
    .contrast-box .table tr th:first-child{padding-left:10px;}
    .contrast-box .table tr td:first-child {position: relative;}
    .contrast-box .table input[type=radio]{margin: -2px 2px 0 0;}
    .contrast-top{margin-bottom:5px;padding: 0;line-height:32px;}
    .contrast-box{height:400px;margin-top: -10px;}
    .con-table-hide{max-height:350px;overflow-y:auto;border-top: 2px solid #2a8cd7;}
    .contrast-box tr td:nth-child(2),.contrast-box tr td:nth-child(3) {width: 160px;color:#606266}
    .contrast-box tr td:nth-child(4) {width: 70px;color:#606266}
    .contrast-box tr td:nth-child(5) {width: 60px;color:#606266}
    .contrast-select .cur ul{display:block}
    .db-jt{position:absolute;display:inline-block;width:0;height:0;border:5px solid transparent;vertical-align:middle;margin:0 0 0 5px;cursor:pointer}
    .wx-text .db-jt{right:10px;top:16px;border-top-color:#bbb;}
    .contrast-select .select-up-posr li.hasch:before,.contrast-select.wx-select:after{display:none!important;border-color:transparent!important;}
    .hasch .db-jt{top:13px;border-top-color: transparent;border-left-color: #d2d2d2;margin-top: -2px;z-index:1;}
    .hasch.cur .db-jt{border-top-color: #d2d2d2;border-left-color: transparent;margin-top: 1px;}
    .hasch>.db-jt,.wx-text .db-jt{opacity:1;}
    .contrast-select.wx-select{display: inline-block;margin-right:14px;width:280px;position: relative;vertical-align: top;}
    .contrast-select .wx-text{display: inline-block;width: 100%;height: 34px;line-height: 34px;background: #fff;border: 1px solid #dcdcdc;border-radius: 5px;cursor:pointer}
    .contrast-select .select-text{display: block;height: 32px;line-height: 30px;padding: 0 30px 0 7px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;border: 1px solid #fff;border-radius: 5px;cursor:pointer}
    .contrast-select .select-text:before{content: "";display: inline-block;width: 20px;height: 20px;margin-right:5px;vertical-align:middle;background:url("../../assets/images/ico-zj.png") no-repeat;cursor:pointer}
    .contrast-select .select-up{display: none;position: absolute;top:35px;width:280px;margin-top: 5px;margin-right: -42px;/* width: auto; */max-height: 200px;background: #fff;border:1px solid #d5d5d5;border-radius: 5px;overflow-y: auto;z-index: 10;}
    .contrast-select .select-up span{ cursor:pointer; position: relative;display: block;padding: 0 5px 0 19px;text-decoration: none;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; color:#333;}
    .contrast-select .select-up span:before{content:"";display: inline-block;width:20px;height:20px;margin-right:5px;vertical-align:middle;background:url("../../assets/images/ico-zj.png") no-repeat 0 -20px;}
    .contrast-select .select-up span:hover,.select-up span.cur{background: #f5f7fa;}
    .contrast-select .select-up i{position: absolute;left:10px;top:14px;}
    /*.contrast-select .select-up-posr>li:first-child{margin-left:0;}*/
    .contrast-select .select-up-posr li{position: relative;margin-left: 22px !important}
    .contrast-select.wx-static .select-up-posr{display: block;}
    .contrast-select.wx-static .select-up-posr:empty:before{content:"%";text-align:center;display:block;color:#666}
    /*.contrast-select li ul{display:none}*/
    .contrast-select .cur ul{display:block}
    .cb{color:#107bce;}
    .search-top {display: inline-block; *display: inline;zoom: 1;width: 200px; height: 32px;position: relative; float: right;}
    .search-txt{box-sizing: border-box;width: 100%;height: 100%;padding-right: 40px;border: none;vertical-align: top;background: #fff;border: 1px solid #ddd;border-radius: 4px;}
    .search-btn {display: inline-block;width: 35px;font-size: 18px;line-height: 30px;vertical-align: top;text-align: center;color: #999;border-radius: 0 4px 4px 0; background: #fff;cursor: pointer;position: absolute;right: 1px;top: 1px;}
    .search-txt:focus { border-color: #3594ff;}
    .radio-f{position: relative;display: table-cell;padding-right: 5px;}
    .radio-f input[type=radio]{opacity:0;position: relative;z-index:1;}
    .radio:before{content:"";position:absolute;top:2px;left:0;box-sizing:border-box;display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid #dde0e7;background:#fff;cursor:pointer;}
    .radio-f input[type=radio]:checked+.radio:before{border:5px solid #409eff}
    .type{display: table-cell;width: 20px;height: 20px;background:url("../../assets/images/study-type.png") no-repeat 0 0;vertical-align: middle;}
    .type-pdf{background-position: 1px 1px;}
    .type-xml {background-position: -24px 1px;}
    .type-other {background-position: -54px 1px;}
    .type-caj {background-position: -79px 1px;}
    .type-ppt {background-position: -105px 1px;}
    .type-word {background-position: -131px 1px;}
    .type-menu {background-position: -162px 1px;}
    .td-con {display: table-cell;padding-left: 4px;}

    .contrast-iframe{max-width:1920px;margin:0 auto;height:calc(100% - 40px);}
    .contrast-pop{position:fixed;top: 0;bottom: 0;left:0;right:0;background:rgba(0,0,0,.82);z-index:101;width:100vw;height: 100vh;z-index:13;}
    .contrast-pop .close-bg {right:0;top:0;/*width: 46px;height: 46px;line-height: 46px;font-size: 24px;background: rgba(0,0,0,.5) url(../Images/close-bg.png) no-repeat center; border-radius: 0;*/}
    .contrast-pop .art-hide{float:left;width: calc(50% - 30px);height:100%;max-width: 2000px;margin-top:20px;margin-left:20px;min-height: calc(100% - 40px);margin-bottom: 20px;}
    .contrast-pop .art-hide+.art-hide{float:right;margin-right:20px;}
    .is-filter{filter: opacity(0.5);}

</style>