<template>
    <div class="abstract-wrap" :style="style">
        <div class="unify-btn unify-btn1" @click="toggle" :class="{'hideExtract':isRefer=='refer'}">
            <i class="i-unify">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenzhai"></use>
                </svg>
            </i>
            <span class="unify-word">摘录</span>
        </div>
        <div class="abstract-ht clearfix">
            我的摘录
            <span class="ab-small">（共{{count}}条）</span>
            <div class="top-r" @click="showAllExact">
              <span class="switch " :class="{'toggle':!isAllExact}">
                <span class="switch-w">全部文献摘录</span> 
                <span class="switch-w tl">当前文献摘录</span> 
                <i class="switch-btn"></i>
              </span> 
              <!-- 通过追加样式名“toggle：来切换 -->
        <!--       <span class="switch toggle">
          <span class="switch-w">全部文献摘录</span> 
          <span class="switch-w tl">当前文献摘录</span> 
          <i class="switch-btn"></i>
        </span> -->
              <a class="more-cw" v-bind:href="MyCentoUrl" target="_blank;">更多</a>
            </div>

        </div>
        <div class="abstract-hide " @scroll="scroll" id="js-scrollContainer">
            <img src="@/assets/images/loading-l.gif" alt="" v-show="loading" class="loading-yx" />
            <ul class="list-dashed" id="js-ulRightExtracts">
                <li v-for="(extract,index) in list" :key=index>
                    <div class="bfc-l mr5">
                        <span v-text="index+1"></span>.
                    </div>
                    <div class="ovhide">
                        <p class="cg5 extractBox"  v-html="extract.content">
                        </p>
                         <div class="abstract-m" v-if="extract.noteExts && extract.noteExts.length>0">
                           <i class="bfc-l"><svg aria-hidden="true" class="icon"><use xlink:href="#icon-tag"></use></svg></i>
                           <div class="ovhide">
                             <span class="mark-sm" v-for="(ESignItem,eIndex) in extract.noteExts" :key="eIndex"><span class="mark-sm-con" >{{ESignItem.signName}}</span></span>
                           </div>
                         </div>

                        <!--<img v-if="extract.type === 2" v-bind:src="extract.content" alt=""  style="max-width:90%;"/>-->
                        <p class="cg5">来源文献：<a href="javascript:void(0)" @click="gotoResource(index)" v-text="'《'+extract.title+'》'"></a>
                        </p>
                        <span class="frdi">
                          <a href="#" title="" @click="addESigns(extract,index)">
                            <svg aria-hidden="true" class="icon">
                              <use xlink:href="#icon-xinjianbiaoqian"></use>
                            </svg>
                          </a>
                          <a href="#" title="删除" @click="delExtract(index)">
                              <svg class="icon" aria-hidden="true">
                                  <use xlink:href="#icon-del1"></use>
                              </svg>
                          </a>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style src="@/assets/css/public/extract.css"></style>
<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import extract from '@/store/modules/public/extract.js'
  import topSign from '@/store/modules/public/topSign.js'
  import '@/assets/js/jquery.extend.js'


  export default {
    data() {
      return {
        MyCentoUrl:  window.InitData.MyCentoUrl,
        visible:false,
       

      }
    },
    
    computed: {
        ...mapState(["isRefer"]),
      ...mapState('extract', Object.keys(extract.state)),
      ...mapState('topSign', Object.keys(topSign.state)),
      style() {
        return {
          right: this.visible ? '0px' : '-450px'
        }
      }
    },
    watch:{
       watchESigns(val){
         var _this = this;
          if (val == null) {
            return false;
          }else if(val.type == 1){
            this.list[val.index].noteExts.unshift(val.val)
          }else if (val.type == -1) {
            this.list[val.index].noteExts.map(function(item,index) {
              if (val.delId === item.signId) {               
                 _this.list[val.index].noteExts.splice(index, 1);
              }
            })
           
          }       
           
       }
    },
    mounted(){
     },
    methods: {
      ...mapMutations(['setETopSign']),
      ...mapMutations('topSign', Object.keys(topSign.mutations)),
      ...mapActions('topSign', Object.keys(topSign.actions)),
      ...mapMutations('extract', Object.keys(extract.mutations)),
      ...mapActions('extract', Object.keys(extract.actions)),
     //
     showAllExact(){
       this.setAllExact(!this.isAllExact)
       this.getExtractList();
     }, 
    //添加摘录标签
    addESigns(item,index){
   
      var signObj = {
        objId:item.centoId,
        type:3,
        index:index
      }
      this.setTopSignArr([]);
      this.setETopSign(true);
      this.getSigns(signObj);
    },

       // 设置显隐
    toggle() {
      this.visible = !this.visible;
      if(this.visible){
        this.getExtractList();
      }
       
    },
      scroll() {
        let $container = $(this.$el).find('#js-scrollContainer');
        let $ulHeight = $(this.$el).find('#js-ulRightExtracts')[0].clientHeight;
        if ($container[0].clientHeight + $container.scrollTop() >= $ulHeight - 6 ) {
          this.getExtractList();
        }
      }
    }
  }
</script>
<style>
    .extractBox img{max-width: 100%;margin: 10px 0}
</style>