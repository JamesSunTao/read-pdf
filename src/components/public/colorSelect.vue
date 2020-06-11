<template>
<div class="w-pop-wrap co-box" v-drag :style="colorData.style"  :class="{'isAllowMove':isAllowMove}" @mouseleave="closeBox"  @mouseover="keepColorBox1"  @mousedown="setMoveFun(true)" @mouseup="setMoveFun(false)">
    <h2 class="co-ht">颜色</h2>
    <div class="ck-box" :class="[{'line-color':colorData.type == 4},{'highLight-color':colorData.type == 5},]">
        <a href="#" class="ck-a" @click.stop="selectColor(colorItem)" :class="['ck-a'+colorItem.index,{'cur':colorIndex == colorItem.index}]" v-for="colorItem in colorArr"  :key="'color'+colorItem.index"></a>
    </div>
    <h2 class="co-ht">不透明度</h2>
    <div class="opacity-box">
        <a href="#" class="opa-a" v-for="opacItem in opacityArr" @click.stop="selectOpacity(opacItem)"  :class="['opa-a'+opacItem.oNum,{'cur':opacityIndex  == opacItem.oNum}]" :key="'opacity'+opacItem.oNum">
            <span>{{opacItem.value}}</span>
            <i :style="[{'background':curColor}]"></i>
        </a>        
    </div>
    <div class="line-m" v-if="colorData.type ==4">
        <div class="line-ml">
            线宽：
        </div>
        <div class="line-mr">
            <a href="#" class="line-width-a" @click="selectLineW(false)"><svg data-v-1be67177="" aria-hidden="true" class="icon"><use data-v-1be67177="" xlink:href="#icon-jian"></use></svg></a>
            <span class="line-width">{{lineWidth}}px</span>
            <a href="#" class="line-width-a" @click.stop="selectLineW(true)"><svg data-v-1be67177="" aria-hidden="true" class="icon"><use data-v-1be67177="" xlink:href="#icon-add"></use></svg></a>
        </div>
    </div>
    <div class="line-m"  v-if="colorData.type ==4">
        <div class="line-ml">
            线型：
        </div>
        <div class="line-mr">
            <div class="line-style-box">
                <div class="line-style" @click="showLineType">
                    <div class="line-li" :class="'mark-line-'+lineType"></div>
                </div>
                <a href="javascript:;" class="line-style-down" @click="showLineType">
                    <svg data-v-1be67177="" aria-hidden="true" class="icon">
                        <use data-v-1be67177="" xlink:href="#icon-toBottm"></use>
                    </svg>
                </a>
                <ul class="line-style-ul" v-show="lineShow">
                    <li v-for="(mlItem,mlIndex) in lineArr" :key="'mlItem'+mlIndex" @click="selectLine(mlItem.lineName,mlIndex)">
                        <div class="line-li" :class="'mark-line-'+mlItem.lineName"></div>
                    </li>                   
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import pdfData from '@/store/modules/pdf/pdfContent.js'

export default {
    data () {
        return {
            lineShow:false,
            opacityArr:[],
            colorArr:[],
            lineArr:[
                {lineName:'solid'},{lineName:'double'},{lineName:'dashed'},{lineName:'dotted'},{lineName:'wave'}
            ],
            colorIndex:0,
            curColor:null,
            opacityIndex:0,
            lineType:1,
            lineWidth:1,
            noteOpacity:null,
            lineTypeIndex:0,
            isAllowMove:false
        };
    },
    props:['colorData'],
    directives:{
        drag(el, binding){
            var _this = this;
            el.onmousedown = function(e){
                var disx = e.pageX - el.offsetLeft;
                var disy = e.pageY - el.offsetTop;
                document.onmousemove = function (e){
                    el.style.left = e.pageX - disx + 'px';
                    el.style.top = e.pageY - disy + 'px';
                }
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
            }
        }
	},
    created(){    
        
        this.colorIndex = this.colorData.comments.noteColorIndex;
        this.opacityIndex = this.colorData.comments.noteOpacityIndex;
        this.lineTypeIndex = this.colorData.comments.lineTypeIndex >4?4:this.colorData.comments.lineTypeIndex;
        this.noteOpacity = this.colorData.comments.noteOpacity;
        this.lineType = this.colorData.comments.lineType;
        this.curColor = this.colorData.comments.noteColor;
        this.lineWidth = this.colorData.comments.lineWidth.replace('px','');
        
        if (this.colorData.type == 4) {
            this.opacityArr = [{oNum:1,value:'25%','val':'0.25'},{oNum:2,value:'50%','val':'0.5'},{oNum:3,value:'75%','val':'0.75'},{oNum:4,value:'100%','val':'1'}]
            this.colorArr = [{value:'#2371ef',index:1},{value:'#f80',index:2},{value:'#36c416',index:3},{value:'#c39c00',index:4},{value:'#8458e6',index:5},{value:'#ff566e',index:6},{value:'#db4bdd',index:7},{value:'#f59277',index:8}]
        }else {
             this.opacityArr = [{oNum:1,value:'25%','val':'0.1'},{oNum:2,value:'50%','val':'0.3'},{oNum:3,value:'75%','val':'0.5'},{oNum:4,value:'100%','val':'0.7'}];
             this.colorArr = [{value:'#FFFB8F',index:1},{value:'#FFA238',index:2},{value:'#6DD555',index:3},{value:'#E5BA0D',index:4},{value:'#B79BF7',index:5},{value:'#FF8495',index:6},{value:'#F184F0',index:7},{value:'#FF9E83',index:8}]
      }
    },

    methods: {
        ...mapMutations(['keepColorBox']),
        ...mapActions(['closeColorBox']),
        ...mapMutations('pdfData',['changeColor','changeOpacity','changeLineType','changeLineWidth']),
        showLineType(){
            this.lineShow = !this.lineShow;   
        },
        keepColorBox1(){
            this.keepColorBox(this.colorData.noteId);
        },
        setMoveFun(bool){
            this.isAllowMove = bool;
        },
        closeBox(){
            this.isAllowMove = false;
            var comments = {
                noteId:this.colorData.noteId,
                noteType:this.colorData.type,
                noteColorIndex:this.colorIndex,
                noteColor:this.curColor,
                noteOpacityIndex:this.opacityIndex,
                lineType:this.lineType,
                lineTypeIndex:this.lineTypeIndex,
                lineWidth:this.lineWidth+'px',
                noteOpacity:this.noteOpacity
            };
            this.closeColorBox(comments)
        },
        selectColor(item){
            this.colorIndex = item.index;
            this.curColor = item.value;
            var colorData = {
                pageNo:this.colorData.pageNo,
                noteId:this.colorData.noteId,
                noteType:this.colorData.type,
                noteColor:this.curColor,
                colorIndex:this.colorIndex
            }
            this.changeColor(colorData);           
        },
        selectOpacity(item){
            this.opacityIndex = item.oNum;
            this.noteOpacity = item.val;
            var opcityData = {
                pageNo:this.colorData.pageNo,
                noteId:this.colorData.noteId,
                noteType:this.colorData.type,
                noteOpacity:item.val,
                noteOpacityIndex:item.oNum
            }
            this.changeOpacity(opcityData);
        },
        selectLine(name,index){
           
            this.lineType = name; 
            this.lineTypeIndex = index;
             var lineData = {
                pageNo:this.colorData.pageNo,
                noteId:this.colorData.noteId,
                noteType:this.colorData.type,
                lineType:name,
                index:index+1
            }
            this.lineShow = false;
            this.changeLineType(lineData);
        },
        selectLineW(bool){
            if(bool){
               if (this.lineWidth<5) {
                   this.lineWidth == this.lineWidth++
               }   
            }else{
                if (this.lineWidth>1) {
                   this.lineWidth == this.lineWidth--
               }  
            }
            var lineWidthData = {
                pageNo:this.colorData.pageNo,
                noteId:this.colorData.noteId,
                noteType:this.colorData.type,
                lineWidth:this.lineWidth+'px',
                // noteOpacityIndex:index
            }
            this.changeLineWidth(lineWidthData);
        }
    }
}

</script>
<style  scoped>
.co-box{box-sizing:border-box; position:absolute;top:0px;width:284px;padding:18px;text-align:left;background:#fff;border-radius:5px;box-shadow:0 0 6px 1px rgba(165,165,165,.54);z-index:99;width:224px;padding:10px 0 10px 18px;width:224px;/* height:270px; */box-shadow:0 0 6px 0 rgba(102,102,102,.75);border-radius:3px}
.co-ht{font-size:14px;margin-bottom:12px}
.ck-a{display:inline-block;width:26px;height:26px;margin:0 22px 12px 0;vertical-align:middle}
.line-color .ck-a1{background:#2371ef}
.line-color .ck-a2{background:#f80}
.line-color  .ck-a3{background:#36c416}
.line-color  .ck-a4{background:#c39c00}
.line-color  .ck-a5{background:#8458e6}
.line-color  .ck-a6{background:#ff566e}
.line-color  .ck-a7{background:#db4bdd}
.line-color  .ck-a8{background:#f59277}

.highLight-color .ck-a1{background:#FFFB8F}
.highLight-color .ck-a2{background:#FFA238}
.highLight-color  .ck-a3{background:#6DD555}
.highLight-color  .ck-a4{background:#E5BA0D}
.highLight-color  .ck-a5{background:#B79BF7}
.highLight-color  .ck-a6{background:#FF8495}
.highLight-color  .ck-a7{background:#F184F0}
.highLight-color  .ck-a8{background:#FF9E83}
.mark-line.ck-a1{border-color:#2371ef;background:0 0}
.mark-line.ck-a2{border-color:#f80;background:0 0}
.mark-line.ck-a3{border-color:#36c416;background:0 0}
.mark-line.ck-a4{border-color:#c39c00;background:0 0}
.mark-line.ck-a5{border-color:#8458e6;background:0 0}
.mark-line.ck-a6{border-color:#ff566e;background:0 0}
.mark-line.ck-a7{border-color:#db4bdd;background:0 0}
.mark-line.ck-a8{border-color:#f59277}
.background.ck-a1{background:rgba(35,113,239,.25)}
.background.ck-a2{background:rgba(255,136,0,.25)}
.background.ck-a3{background:rgba(54,196,22,.25)}
.background.ck-a4{background:rgba(195,156,0,.25)}
.background.ck-a5{background:rgba(132,88,230,.25)}
.background.ck-a6{background:rgba(255,86,110,.25)}
.background.ck-a7{background:rgba(219,75,221,.25)}
.background.ck-a8{background:rgba(245,146,119,.25)}
.ck-a:hover,.cur.ck-a,.cur.opa-a,.opa-a:hover{box-shadow:0 0 0 2px #fff,0 0 0 3px #f44c4c}
.opa-a{position:relative;display:inline-block;width:28px;height:28px;margin:-3px 20px 12px 0;line-height:28px;text-align:center;border-radius:50%;/* background:url(../Images/co-bj.jpg) */}
.opa-a span{display:block;font-size:12px;transform:scale(.75);color:#fff;position:relative;z-index:1}
.opa-a i{position:absolute;top:0;bottom:0;left:0;right:0;border-radius:50%}
.opa-a1 i{opacity: .25;}
.opa-a2 i{opacity: .50;}
.opa-a3 i{opacity: .75;}
.opa-a4 i{opacity: 1;}
.mark-line.opa-a1{opacity: .25}
.mark-line.opa-a2{opacity: .5}
.mark-line.opa-a3{opacity: .75}
.mark-line.opa-a4{opacity: 1}
.mark-line{position:absolute}
.mark-line-solid{border-bottom:1px solid #333}
.mark-line-double{border-bottom:4px double #333}
.mark-line-dashed{border-bottom:1px dashed #333}
.mark-line-dotted{border-bottom:1px dotted #333}
.mark-line-wave:after{content:"";position:absolute;left:0;right:0;bottom:-5px;height:4px;background:linear-gradient(135deg,transparent,transparent 45%,#333,transparent 55%,transparent 100%),linear-gradient(45deg,transparent,transparent 45%,#333,transparent 55%,transparent 100%);background-size:6px .5em;background-repeat:repeat-x,repeat-x;background-position:bottom}
.cwidth-2{border-width:2px;}
.cwidth-3{border-width:3px;}
.cwidth-4{border-width:4px;}
.background{position:absolute;z-index:5}
.background:hover{outline:2px dashed #00f}
.background.cur{outline:2px dashed red}
.background:before{content:"";position:absolute;top:0;left:0;bottom:0;right:0}
.line-li.mark-line-wave{position: relative;}
.line-mr{display:inline-block;vertical-align:top;width:150px;height:24px;background:rgba(255,255,255,1);border:1px solid rgba(221,221,221,1);border-radius:2px}
.line-ml{display:inline-block;vertical-align:top}
.line-m{margin-bottom:8px}
.line-width-a{display:inline-block;width:24px;height:24px;text-align:center;line-height:24px;color:#666;font-size:12px;background:rgba(242,242,242,1);border-radius:2px 0 0 2px;vertical-align:top}
.line-width{display:inline-block;width:94px;text-align:center;font-size:12px;line-height:24px;vertical-align:top}
.line-style-box{position:relative}
.line-style-down{position:absolute;right:0;top:0;width:24px;height:24px;font-size:12px;text-align:center;color:#999}
.line-style{width:110px;height:24px;margin:0 8px}
.line-style-ul{position:absolute;top:26px;box-sizing:border-box;width:150px;height:96px;background:#fff;border:1px solid rgba(230,230,230,1);box-shadow:0 0 6px 0 rgba(102,102,102,.32);border-radius:2px;padding:5px}
.line-style-ul li{height:16px}
.line-style-ul li:hover{background:#d1e6ff}
.line-li{padding-top:8px;margin:0 15px}
.line-style .line-li{margin:0;padding-top:11px}
.isAllowMove{cursor: move;}
</style>