<template>
  <section class="study-wrap"> 
    <div class="video-r">
        <div class="study-r">
            <videoRight/>  
        </div>
    </div>  
    <div class="video-warp">         
       <myVideo soucerUrl="http://vjs.zencdn.net/v/oceans.mp4" :sourceType="sourceType" ref="child"></myVideo>
    </div>
  </section>
</template>

<script>
import videoRight from './testRight'
import { mapState, mapMutations } from 'vuex';
export default {
    components:{
       videoRight
    },
    data () {
        return {
            sourceType:window.InitData.sourceType,
            //myPlayer:null
        };
    },
    computed:{

    },
    mounted() { 
       
    
    },
    methods: {
       playFun(time){          
           this.$refs.child.playFun(time)
       },
       pauseFun(){
          this.$refs.child.pauseFun()
       }
    
    }
}
</script>
<style scoped>
.video-warp{position: relative; background:grey;overflow:hidden;height:100%;}
.video-r{float:right;width:410px;height:100%}
.video-r .study-r{height:calc(100%);float:none}
</style>

