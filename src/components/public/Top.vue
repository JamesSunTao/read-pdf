// 导航top栏
<template>
    <div>
        <div class="study-t clearfix js-originalReadTop" id="centerTop">
            <a href="#" class="return" title="" v-on:click="goToThematicList">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
                <span class="tip-title" title="返回专题列表">返回专题列表</span>
            </a>
            <h1 class="study-ht">{{readContentInfo.Title||readContentInfo.EnglishTitle}}</h1>
            <div class="study-top-right" id="study-top-right">
                <div class="layout-box">
                    <a href="#" class="btn-la cur" id="threeColumn">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-sanlan1"></use>
                        </svg>
                        <span class="tip-title">三栏</span>
                    </a>
                    <a href="#" class="btn-la " id="twoColumn">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-lianglan1"></use>
                        </svg>
                        <span class="tip-title">两栏</span>
                    </a>
                </div>
                <a v-if="!(fileType==11)&& FileSourceType == 1" href="#" title="查看知网节" class="svg-bg js-showCNkiNode" v-on:click="viewCNKINode" >
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhiwangjie"></use>
                    </svg>
                </a>
                <div class="star-group" title="文献重要度">
                   <!--  <input type="radio" id="starid1" class="starf starf_1" value="1" name="starf" v-bind:checked="studyInfo.Grade==1?true:false">
                   <label for="starid1" class="star star_1">差</label>
                   <input type="radio" id="starid2" class="starf starf_2" value="2" name="starf" v-bind:checked="studyInfo.Grade==2?true:false">
                   <label for="starid2" class="star star_2">较差</label>
                   <input type="radio" id="starid3" class="starf starf_3" value="3" name="starf" v-bind:checked="studyInfo.Grade==3?true:false">
                   <label for="starid3" class="star star_3">普通</label>
                   <input type="radio" id="starid4" class="starf starf_4" value="4" name="starf" v-bind:checked="studyInfo.Grade==4?true:false">
                   <label for="starid4" class="star star_4">较好</label>
                   <input type="radio" id="starid5" class="starf starf_5" value="5" name="starf" v-bind:checked="studyInfo.Grade==5?true:false">
                   <label for="starid5" class="star star_5">好</label> -->

                    <input type="radio" id="starid1" class="starf starf_1" value="1" name="starf" v-bind:checked="studyInfo.Grade==1?true:false">
                    <a href="javascript:;" class="star star_1"><label for="starid1">差</label></a>
                    <input type="radio" id="starid2" class="starf starf_2" value="2" name="starf" v-bind:checked="studyInfo.Grade==2?true:false">
                    <a href="javascript:;" class="star star_2"><label for="starid2">较差</label></a>
                    <input type="radio" id="starid3" class="starf starf_3" value="3" name="starf" v-bind:checked="studyInfo.Grade==3?true:false">
                    <a href="javascript:;" class="star star_3"><label for="starid3">普通</label></a>
                    <input type="radio" id="starid4" class="starf starf_4" value="4" name="starf" v-bind:checked="studyInfo.Grade==4?true:false">
                    <a href="javascript:;" class="star star_4"><label for="starid4">较好</label></a>
                    <input type="radio" id="starid5" class="starf starf_5" value="5" name="starf" v-bind:checked="studyInfo.Grade==5?true:false">
                    <a href="javascript:;" class="star star_5"><label for="starid5">好</label></a>
                </div>
                <a v-if="!(fileType==11&&fileType==10)" href="#" title="笔记汇编" id="noteAssembly" class="btn-la posr" v-on:click="noteAssemble">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-huibian"></use>
                    </svg>
                    <span class="tip-title">笔记汇编</span>
                </a>
                <a href="#" id="litMarkBtn" title="标签" class="btn-la" v-on:click="addSigns">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-tag"></use>
                    </svg>
                    <span class="tip-title">标签</span>
                </a>
                
                <a herf="javascript:;" class="btn-la" title="收藏" style="background: rgb(255, 129, 37);">
                    <svg class="icon" aria-hidden="true" ms-on-click="showCollectPanel">
                        <use xlink:href="#icon-collection"></use>
                    </svg>
                    <span class="tip-title">收藏</span>
                </a>
            </div>
        </div>
        <div id="topsigns" v-show="showAddSignFlag">
            <TopSign v-on:closeSelectSign="addSigns"/>
        </div>
    </div>
</template>
<style src="@/assets/css/top.css"></style>

<script>
    import TopSign from '@/components/public/TopSign.vue'
    export default {
        name:'Top',
        props:['readContentInfo'],
        components:{
            TopSign
        },
        data:()=>{
            return{
                studyInfo:window.InitData.StudyInfo,
                showAddSignFlag:false,    //点击标签展示或隐藏标签组件
                fileType: window.InitData.DcType,
            }
        },
        methods:{
            //√返回专题列表
            goToThematicList(){
                    window.open(window.InitData.psmcUrl+'#/MyStudy','_self');
            },
            //√查看知网节
            viewCNKINode(){
                    window.open(window.CnkiNode + '/KCMS/detail/detail.aspx?dbcode=' + window.InitData.dbCode
                    + '&dbname=' + window.InitData.tableName + '&filename=' + window.InitData.fileName,'_blank');
                    this.showAddSignFlag=false;
            },
            //笔记汇编
            noteAssemble(){
                // if (basicInfo.notes.length === 0) {
                //     layer.msg('请您添加笔记后再汇编');
                //     return false;
                // }
                var myload = layer.load(2);
                    //var myWin = window.open('about:blank');
                var myWin = window.open(window.InitData.ApplicationPath + "article/Compiling");
                $.ajax({
                    url: window.InitData.ApplicationPath + 'LitNotes/AssemblyCoorperate',
                    type: 'POST',
                    data: {
                        topic: window.InitData.Topic, literatureId: window.InitData.FileSourceType === '1' ? window.InitData.Lid : window.InitData.fileName,
                        type: 1, sourceTitle: basicInfo.paperTitle, appId: window.InitData.AppId
                    },
                    dataType: 'json',
                    async: true
                }).done(function (json) {
                    if (json.Code === 200) {
                        myWin.location.href = window.InitData.XmlEditorUrl
                        + '/PersonalBook/Index/' + json.Data.Id;
                        layer.close(myload);
                    }else {
                        if (json.Data.Type === 2) {
                            layer.msg('汇编集内容为空！',{skin:" layui-layer tip-orange "});
                            layer.close(myload);
                            return;
                        }else{
                            layer.msg('汇编失败',{skin:" layui-layer tip-red"});
                            layer.close(myload);
                        }
                    }
                });
                this.showAddSignFlag=false;
            },
            //点击标签
            addSigns(){
                this.showAddSignFlag= !this.showAddSignFlag;
            }


        }
    }
</script>