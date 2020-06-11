<template>
    <section>       
        <div class="saveGroup"> 
            <a :href='streadSrc'  id="stu-full-screen" class="btn-blue btn-scroll" target="_blank" v-if="!isXml || isRefer=='refer'">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-read"></use>
                </svg>
                <span class="btn-scroll-span">展开阅读</span>
            </a>
            <a href="javascript:void(0)" class="btn-orange btn-scroll" @click.stop="referSave" v-if="!isXml || isRefer=='refer'">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-collection"></use>
                </svg>
                <span class="btn-scroll-span">收藏到</span>
               <collectarticle v-if="collectShow && !readIframeShow.isShow"  :options="options" @close="setCollectShow(false)"></collectarticle>
            </a>
        </div>
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    data () {
        return {
         streadSrc:window.InitData.ApplicationPath + 'readonline.ashx?filename=' + window.InitData.fileName + '&tablename=' + window.InitData.tableName + '&dbcode=' + window.InitData.dbCode + '&filesourcetype=1&topic=' + window.InitData.Topic + '&appId=' + window.InitData.AppId + '&devtype=' + '&pageType=POPPAGE#'
        };
    },
    computed: {
        ...mapState(["isRefer","isXml","readIframeShow",'options',"referTitle","collectShow"]),
    },
    methods:{
        ...mapMutations(["setReadIframeShow","setCollectShow"]),
        referSave(){

            // this.singleCollect(true);
            var singleObj = {
                dbCode: window.InitData.dbCode,
                fileCode: window.InitData.fileName,
                fileSourceType: window.InitData.FileSourceType,
                tableCode: window.InitData.tableName,
                toGroupId: "",
            };
            this.options.params = singleObj;
            this.options.type = 3;      
            this.setCollectShow(!this.collectShow);
        },
    }
}

</script>
<style scoped>
  .saveGroup{    
      position: fixed;
        box-sizing: border-box;
        right: 0px;
        top: 64px;
        z-index: 101;
        width: 30px;
        height: 100px;
   
    }
    .btn-scroll{position:absolute;box-sizing:border-box;right:0px;top:64px;z-index:101;width: 30px;height:30px;padding: 0 9px 0 7px;white-space:nowrap;border-radius:4px 0 0 4px;text-align:center;line-height: 26px;color:#fff;}
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