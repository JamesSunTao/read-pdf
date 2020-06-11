<template>
    <!--左右拖拽-->
   <div class="dragWarp"  @mousemove = "dragMove($event)" @mouseup = "dragUp($event)"></div>
</template>
<script>
    import { mapState, mapMutations} from 'vuex'
    export default {
        name: "Drag",
        computed: {
            ...mapState(["dragObj"]),
        },
        methods:{
            ...mapMutations(["isDragShow","setLeftStyle","setCenterStyle","setRightStyle"]),
            dragMove(e){
                var _this = this;
                var e = e || event;
                var x = e.pageX;
                var leftStyle,centerStyle,rightStyle;
                if(_this.dragObj.direction === 1){
                    var centerR = $(".study-c").position().right;
                    leftStyle = {
                        "left": 0 + "px",
                        "width":x + "px"
                    };
                    centerStyle = {
                        "left":x + "px",
                        "right":centerR + "px"
                    }
                    _this.setLeftStyle(leftStyle);
                }
                if(_this.dragObj.direction === 2){
                    var pageWidth = window.innerWidth;
                    var centerL = $(".study-c").position().left;
                    x= pageWidth-x;
                    rightStyle = {
                        "right": 0 + "px",
                        "width":x + "px"
                    };
                    centerStyle = {
                        "left":centerL + "px",
                        "right":x + "px"
                    }
                    _this.setRightStyle(rightStyle);
                }
                _this.setCenterStyle(centerStyle);
            },
            dragUp(){
                this.isDragShow(false)
            }
        }
    }
</script>
<style scoped>
    .dragWarp{position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: 1000;cursor: w-resize;}
</style>