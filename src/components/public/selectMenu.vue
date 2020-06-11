<template>
      <ul v-show="show">
        <li v-for="(child_item , child_index) in taskData" @click.stop="addCur(child_item,child_index)" :key="child_index"> 
            <span :class="{'cur':curIndex === child_index}">{{child_item.title}}</span>
        </li>
     </ul>
</template>
<script>
export default {
    name:'selectMenu',
    props:['taskData','curIndex','show'],
    data () {
        return {
        };
    },

    methods: {
        addCur(item,index){
           this.$parent.addCur(item,index); 
        }
    }
}

</script>
<style lang='css' scoped>

</style>