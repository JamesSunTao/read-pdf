<template>
  <div class="video">  
    <Ueditor/>
    <PubHeader/>
    <Extract/>
    <VMain/>
    <Subject v-if="isXMRDFile == 1"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import VMain from '@/components/video/VMain.vue'
// import VMain from '@/components/video/testVideo.vue'   //  这个组件为plugin，需要单独导报引入

import  PubHeader from  '@/components/public/PubHeader.vue'
import Subject from '@/components/public/subject.vue'
import  Ueditor from  '@/components/public/Ueditor.vue'

export default {
  components: {
    Extract: () => import(/* webpackChunkName: "extract" */ '@/components/public/Extract.vue'),
    VMain,
    PubHeader,
    Subject,
    Ueditor
  },
   computed: {
        ...mapState(['isXMRDFile']),
        
   },
};
</script>
<style src="@/assets/css/public/reset.css"></style>
<style src="@/assets/css/pdf/pdf.css"></style>>