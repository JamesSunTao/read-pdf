<template>
    <Loading/>  
</template>

<script>
import Loading from '@/components/loading/loading.vue'

export default {
    data () {
        return {
        };
    },
    components:{Loading},
}

</script>
<style>
    /*加载提示页面*/
html,body,.branch-box{height:100%;}
body, p, dl, dd, h1, h2, h3, h4, h5, h6{margin: 0px;padding: 0;font-weight:normal;list-style: none;}
img{border:none;}
@media (max-width:768px) {
	.loading,.loading-2{min-width: 1px;left:10px;right:10px;transform: translate(0,-50%);top: 40vh;text-align: center;}
	.loading-left {margin:0 auto 10px;display: block;}
	.loading-left+p {max-width: 100%;}
}
</style>