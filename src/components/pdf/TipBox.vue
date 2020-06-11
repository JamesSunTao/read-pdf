<template>
       <div>
            <div class="tip-layui-wrap">
                <a href="javascript:;" class="pop-x" @click="setCopy(false)"></a>
                <div class="tip-layui-con">
                    <h2 class="tip-layui-h">您复制的内容已超过100字！建议将复制内容添加到摘录，</h2>
                    <p class="tip-layui-p">在线创作时可随时添加到文中，自动生成引用关系，参考文献自动编号。</p>

                </div>
                <div class="tip-pop-bottom">
                    <a href="javascript:;" class="btn btn-blue" @click="addExtract1()">加入摘录</a> 
                    <a href="javascript:;" id="copyTextMore" class="btn btn-line-blue" >继续复制</a>
                </div>  
            </div>
            <div class="shaw"></div>
        </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
export default {
        data () {
        return {
        };
        },



        methods: {
            ...mapMutations(['setCopy']),
            addExtract1(){
                 $("#addcentor").trigger("click")
            }
        }
}

</script>
<style  scoped>

</style>