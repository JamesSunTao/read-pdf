<template>
    <div class="study-cen" id="read_mid_srollbar"  :class="[{'hand1':isDrag,'cursor_pointer':isAddPeg}]"   @keydown.left.stop.prevent="goPre()"  @keydown.right.stop.prevent="goNext()"  tabindex = "0" @scroll="pageScroll" @mousedown = "read_MouseDown($event)">
        <div id="read_scollbox"> <!-- @click="setHideTop(true)"-->
            <div class="tc" id="read_midbox" v-resize="onResize" :style="zoomPageStyle">
                <div id="read_over" class="read_over" v-show="fullBoxShow"  @click.stop="addPegFun($event)" :class=" isAddPeg ? 'crosshair' : 'cursor_text' " :style="curOverStyle"  @mousedown.stop="mouseDownFun($event)" @mousemove.stop="mouseMoveFun($event)" @mouseup.stop="mouseUpFun($event)"> </div>
                
               <div class="load-box"  v-for="(pageItem,index) in pageArr" :key="index" :id="'load-box'+pageItem.pageNo" :style="curBoxStyle">
                
                  
                    <img class="pdfImg" :src="pageItem.imgSrc"  @click.stop = "cancelSelect"   @mouseup="mouseUpFun($event)" alt=""/>
                    <div class="initbox"  v-for="(divItem,index) in pageItem.initBoxArr" @click.stop="stopFun"  @mousedown.stop="mouseDownFun($event)"  @mousemove.stop="mouseMoveFun($event)" @mouseup.stop="mouseUpFun($event)" :style="divItem" :key="'initBox'+index"></div>
                    
                    <!-- 下划线 -->
                    <div class="mark-line ck-a3"   v-for="(lineItem,index) in pageItem.curLineArr" @mousedown.stop="mouseDownFun($event)" @mouseover="showBlueBox(lineItem.noteId)" @mousemove="showBlueBox(lineItem.noteId)" @mouseleave="hideBlueBox(lineItem.noteId)" @mousemove.stop="mouseMoveFun($event)" @mouseup="mouseUpFun($event)" :class="[lineItem.noteId,'mark-line-'+lineItem.lineType]" :key="'lineItem'+index" :style="lineItem.style">
                        <i v-if="lineItem.lineType == 'wave'" :style="'background:linear-gradient(135deg,transparent,transparent '+lineItem.waveData1+'%,'+lineItem.style['border-color']+',transparent '+lineItem.waveData2+'%,transparent 100%) 0% 0% / 6px 0.5em repeat-x,linear-gradient(45deg,transparent,transparent '+lineItem.waveData1+'%,'+lineItem.style['border-color']+',transparent '+lineItem.waveData2+'%,transparent 100%) 0% 0% / 6px 0.5em repeat-x;'"></i>
                    </div>
                    <!-- 高亮 -->
                    <div class="high_Light"  v-for="(highLtItem,index) in pageItem.curHighLightArr" @mousedown.stop="mouseDownFun($event)"  @mousemove.stop="mouseMoveFun($event)" @mouseup="mouseUpFun($event)" :class="highLtItem.noteId" :key="'highLtItem'+index" :style="highLtItem.style">
                    </div>
                    <div class="selectbox" v-for="(boxItem,index) in pageItem.curBoxArr"  @click.stop="stopFun" @mousedown.stop="mouseDownFun($event)"  @mousemove.stop="mouseMoveFun($event)" @mouseup="mouseUpFun($event)" :style="boxItem" :key="index" ></div>
                    <!-- 动态修改选择框的长度 -->
                    <!-- <i class="resize-i"><i> -->
                    <!-- 笔记框 -->
                    <div class="note_box"   @click="findNote(noteIndex,noteItem.noteId)" @mousedown.stop="mouseDownFun($event)"  @mousemove.stop="mouseMoveFun($event)" @mouseup="mouseUpFun($event)" :class="noteItem.noteId" v-for="(noteItem,noteIndex) in pageItem.curNoteArr" :key="noteItem.noteId+noteIndex" :style="noteItem.style">                       
                    </div>
                   <!-- 笔记盒子 -->
                    <div class="box_warp"  :class="nBoxItem.noteId" v-for="(nBoxItem,nBoxIndex) in pageItem.curNoteBoxArr"  @mouseover="keepColorBox(nBoxItem.noteId)"  @click.stop="findNote(nBoxIndex,nBoxItem.noteId,nBoxItem.type)" :noteId="nBoxItem.noteId" @mouseenter.stop="mouseCurFun(nBoxItem.noteId,nBoxItem.type)"  @mouseleave="closeCoBox(nBoxItem)" @mousedown.stop="mouseDownFun($event)"  @mousemove.stop="mouseMoveFun($event)" @mouseup="mouseUpFun($event)" :key="nBoxItem.noteId" :style="nBoxItem.style">                
                        <div class="note_ico"  @click="findNote(nBoxIndex,nBoxItem.noteId)" :style="nBoxItem.icoStyle">
                         <!--    <svg class="icon" aria-hidden="true">
                             <use xlink:href="#icon-note-my"></use>
                         </svg> -->
                        </div>
                        <div class="annotator-adder boxBtnGroup" :style="nBoxItem.styleBtnGroup">
                            <button class="annotator-adder-btn" @click.stop="delNote(nBoxItem.noteId,nBoxItem.type,pageItem.pageNo)">删除</button>
                            <button class="annotator-adder-btn" @click.stop="setColor(nBoxItem,pageItem.pageNo)" v-if="nBoxItem.type==4 || nBoxItem.type==5">颜色</button>
                        </div>                       
                    </div>
                    <!-- 批注图标 -->
                    <div class="bz-ico" title="批注"  @click="findNote(piIndex,piItem.noteId)" v-for="(piItem,piIndex) in pageItem.curPiArr" :key="piItem.noteId" :class="[piItem.noteId,{'cur':piCur===piIndex}]"   :style="piItem.style">
                    <!--     <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-biaozhu"></use>
                    </svg> -->
                    </div>
                </div>

                <!--按钮组-->
                <div class="annotator-adder"  id="divMouseRight" v-show="annotatorShow"  :style="annotatorStyle" @click="annotatorShow = false;">
                    <button id="noteUnderLine" class="annotator-adder-btn" @click="underLineFun">划线</button>
                    <button class="annotator-adder-btn annotator-adder-btn-r" id="highLight" @click="highLightFun">高亮</button>
                    <button class="annotator-adder-btn annotator-adder-btn-r" id="addnote" @click="addNoteFun">笔记</button>
                    <button class="annotator-adder-btn annotator-adder-btn-r" id="addcentor" @click="addCentorFun($event)">摘录</button>
                    <button class="annotator-adder-btn annotator-adder-btn-r" id="toolsearch" @click="toolSearchFun" v-if="!isLimited">工具书搜索</button>
                    <button class="annotator-adder-btn annotator-adder-btn-r" id="copytext" @click="copyTextFun(5)">复制</button>
                </div>
                <!--copy触发-->
                <!-- <button id="copy" v-show="false"></button> -->
            </div>
        </div>
        <!--<img src="http://x.cnki.net/read/Content/Images/loading-l.gif" class="loading_Img" alt="">-->
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import pdfApi from '@/api/pdf.js'
    import Clipboard from 'clipboard'
    import resize from 'vue-resize-directive'
    import pdfData from '@/store/modules/pdf/pdfContent.js'
    import ueditorData from '@/store/modules/pdf/UeditorStore.js'
    import extract from '@/store/modules/public/extract.js'
    import "../../assets/js/jquery.fly.min.js"
    export default {
        data(){
          return {
              startX:0,
              startY:0,
              endX:0,
              endY:0,
              upX:0,
              upY:0,
              direction:1, // 0:向左,1向右
              isDown:false,
              clickPage:1, //划词的页码,跟当前页不一定相等
              curLine:1,
              startLine:1, //开始的行号
              endLine:1,
              times:0,
              annotatorStyle:{left:"",top:""},
              annotatorShow:false,
              selectBoxShow:false,
              isMove:false,  // 判断是否划词,
              // 复制的文字
              text: '',
              copyType:5, //判断复制字是记笔记复制还是点击“复制按钮复制的”
              locationArr:"",
              noteType:3,
              piCur:null,
              imgParams:{},    
              waveColor:'#bb3020'      

          }
        },
        
        computed: {
            ...mapState(['colorData','isCopy','isExtract','fullBoxShow',"isAddPeg",'isDrag','pdfTitleObj','isLimited','isRefer','referActive','lookReferArr','sourceReferArr']),
            ...mapState('pdfData', Object.keys(pdfData.state)),
            ...mapState('ueditorData', Object.keys(ueditorData.state)),
        },
        directives: {
            resize,
        },
        created() {
             this.initPageArr();
             this.ImgLazyLoad(1);
        },
        watch: {
           isExtract(newVal, oldVal) {
              if (newVal) {
                  $("#addcentor").trigger("click")
              }
            }
        },
        mounted(){
            this.copyLink();
           
            var _this = this;
            var hisTimer = setTimeout(function () {
                _this.loadHisPage();
            },800)
            _this.$nextTick(function(){
                this.setInitPageW($("#read_midbox").width());
            })
            
        },
        methods:{
            ...mapMutations(['setColorDataShow','setInitPageW','isFullBoxShowFun','setOldColorData','keepColorBox','setColorData','setHideTop','setCopy','addExtract']),
            ...mapActions(['closeColorBox']),
            ...mapMutations('pdfData', Object.keys(pdfData.mutations)),
            ...mapActions('pdfData', Object.keys(pdfData.actions)),
            ...mapMutations('ueditorData', ["getUeContent","clearTopSign"]),
            ...mapMutations('extract', ["addExtractInfo"]),
             loadHisPage(){                           
               var hisPage = JSON.parse(localStorage.getItem("curPageHis")) ? JSON.parse(localStorage.getItem("curPageHis"))[window.InitData.fileName] : 1
               this.LoadPreNext(hisPage);
           },
            goPre(){
                 this.prePage();
                 setTimeout(()=>{
                     $("#read_mid_srollbar").focus();
                 });
            },
            goNext(){
                this.nextPage();
                setTimeout(()=>{
                    $("#read_mid_srollbar").focus();
                });
            },
            onResize(){
              this.isDown = false;
              this.pageArr[this.clickPage-1].curBoxArr = [];  // 清空选择的div
              this.annotatorShow = false;
              var pageW = $("#read_midbox").width();
              this.resetPageArr(pageW);
            },
            GetImgX(e) {
                e = e || window.event;
                var downX = e.clientX - $("#read_midbox").offset().left;
                return downX;
            },
            GetImgY(e) {
                e = e || window.event;
                var _this = this;
                var scrollDis = $("#read_mid_srollbar").scrollTop();
                var boxTop  = $("#read_mid_srollbar").offset().top;
                var gapbetweenPages = (this.clickPage-1)*12;
                _this.clickPage =  Math.ceil((scrollDis+ e.clientY -boxTop-gapbetweenPages)/_this.curHeight);
                var curPageH =  $("#load-box"+_this.clickPage)[0].offsetTop;
                var downY = scrollDis + e.clientY - curPageH-boxTop;
                // console.log("clickPage:"+ +this.clickPage)
                return downY;
            },
            resetImgY(x,y,isStart){  // 从上往下，计算当前点处于的y坐标和行标
                var _this = this;
                var posInfo = _this.pageArr[_this.clickPage-1].curLines;
                for (var posItem in posInfo) {
                    // 判断起点在哪个div中（上下左右全部包含在div内）
                    if( y>= posInfo[posItem].top && y<= posInfo[posItem].bottom && x >= posInfo[posItem].left && x <= posInfo[posItem].right) {
                        y = posInfo[posItem].top; // 若起点在div内，以top值作为起点纵坐标
                        _this.curLine = posInfo[posItem].line;
                        if(isStart){  // 起点在划词范围内有效
                            _this.isDown = true;
                        }
                    }
                }
                return {"resetY":y,"line":_this.curLine};
            },
            resetImgX_L(posItem , pos){  // 补齐左边栏
                for (var j=0;j< posItem.length; j++) {
                    if(pos >= posItem[j] && pos < posItem[j+1]){
                        // console.log("j="+j+"posItem[j]:"+posItem[j], "----pos:"+pos,   "-----posItem[j+1]:"+posItem[j+1]);
                        return  posItem[j];
                    }
                }
            },
            resetImgX_R(posItem , pos){ // 补齐右边栏
                for (var j=0;j< posItem.length; j++) {
                    if(pos > posItem[j] && pos <= posItem[j+1]){
                        return  posItem[j+1];
                    }
                }
            },
            cancelSelect(){
                 this.annotatorShow = false;
                 this.pageArr[this.clickPage-1].curBoxArr=[];  // 清空选择的div
                 $('#read_midbox').find('.box_warp').removeClass('box_warp_cur');
            },
            mouseDownFun(e){
                var _this = this;
                _this.isMove =false;
                _this.annotatorShow = false;
                _this.times = 0;
                _this.pageArr[_this.clickPage-1].curBoxArr.splice(0, _this.pageArr[_this.clickPage-1].curBoxArr.length);  // 清空选择的div

                _this.startX =  _this.GetImgX(e);
                _this.startY =  _this.GetImgY(e);

                var resetData = _this.resetImgY( _this.startX, _this.startY,true);
                _this.startY =  resetData.resetY;
                _this.startLine = resetData.line;

            },
            mouseMoveFun(e){
                e = e || window.event;
                var _this = this;
                _this.selectBoxShow = true;
                if(_this.isDown == false){
                    return false;
                }
               // console.log("move");
                _this.endX =  _this.GetImgX(e);
                _this.endY =  _this.GetImgY(e);

                var resetData2 = _this.resetImgY( _this.endX, _this.endY);
                _this.endY =  resetData2.resetY;
                _this.endLine = resetData2.line;

                var posInfo = _this.pageArr[_this.clickPage-1].curLines;  //当前页的行坐标
                _this.pageArr[_this.clickPage-1].curBoxArr.splice(0, _this.pageArr[_this.clickPage-1].curBoxArr.length);
                var chooseObj = {};
                if( _this.endLine ===_this.startLine){  // 单行处理
                    var lineData = posInfo[_this.startLine-1].linePos.split(",");
                    if(_this.endX>=_this.startX){ //单行向右
                       //console.log("向右滑动");
                        _this.direction = 1;
                        if(_this.endX>=posInfo[_this.endLine-1].right){ // 不超过右边界
                            _this.endX = posInfo[_this.endLine-1].right;
                        }
                        if(_this.startX<=posInfo[_this.endLine-1].left){  // 不超过左边界
                            _this.startX=posInfo[_this.endLine-1].left;
                        }
                        _this.times ++;
                        if( _this.times ===1){
                            _this.startX = _this.resetImgX_L(lineData , _this.startX);
                        }
                        _this.endX = _this.resetImgX_R(lineData , _this.endX);

                        chooseObj.left =  _this.startX+"px";
                        chooseObj.width = _this.endX- _this.startX +"px";
                    }else { // 单行向左
                        // console.log("向左滑动");
                        _this.direction = 0;
                        if(_this.startX>=posInfo[_this.startLine-1].right){ // 不超过右边界
                            _this.startX = posInfo[_this.startLine-1].right;
                        }
                        if(_this.endX<=posInfo[_this.startLine-1].left){
                            _this.endX = posInfo[_this.startLine-1].left;
                        }
                         _this.startX = _this.resetImgX_R(lineData , _this.startX );
                         _this.endX = _this.resetImgX_L(lineData , _this.endX);

                        chooseObj.left =  _this.endX+"px";
                        chooseObj.width = _this.startX- _this.endX +"px";
                    }
                    chooseObj.top =  posInfo[_this.endLine-1].top+"px";
                    chooseObj.bottom =  posInfo[_this.endLine-1].bottom + "px";
                    chooseObj.height =  posInfo[_this.endLine-1].bottom- posInfo[_this.endLine-1].top +"px";
                    _this.pageArr[_this.clickPage-1].curBoxArr.push(chooseObj)

                }else if(_this.endLine > _this.startLine){  // 多行向下
                    _this.direction = 1;
                    for(let i=_this.startLine-1;i< _this.endLine; i++){
                        chooseObj = {};
                          if(i=== _this.startLine-1) {
                              if(_this.startX <= posInfo[i].left){
                                  _this.startX = posInfo[i].left;
                              }
                              chooseObj.left =  _this.startX+"px";
                              chooseObj.width = posInfo[i].right - _this.startX +"px";
                          } else if(i ===  _this.endLine-1){
                              if(_this.endX>= posInfo[i].right){
                                 _this.endX = posInfo[i].right;
                              }
                              var lineData = posInfo[_this.endLine-1].linePos.split(",");
                              _this.endX = _this.resetImgX_R(lineData , _this.endX);
                              chooseObj.left =  posInfo[i].left+"px";
                              chooseObj.width = _this.endX - posInfo[i].left +"px";
                          }else{
                              chooseObj.left =  posInfo[i].left+"px";
                              chooseObj.width = posInfo[i].right - posInfo[i].left +"px";
                          }
                        chooseObj.top =  posInfo[i].top+"px";
                        chooseObj.bottom =  posInfo[i].bottom + "px";
                        chooseObj.height =  posInfo[i].bottom- posInfo[i].top +"px";
                        _this.pageArr[_this.clickPage-1].curBoxArr.push(chooseObj)
                    }

                }else{ //多行向上
                    _this.direction = 0;
                    for(let i= _this.startLine-1;i >= _this.endLine-1; i--){
                        chooseObj = {};
                        if(i=== _this.startLine-1) {
                            if(_this.startX >= posInfo[i].right){
                                _this.startX = posInfo[i].right;
                            }
                            chooseObj.left =  posInfo[i].left+"px";
                            chooseObj.width = _this.startX - posInfo[i].left +"px";
                        } else if(i ===  _this.endLine-1){
                            if(_this.endX<= posInfo[i].left){
                                _this.endX = posInfo[i].left;
                            }
                            var lineData = posInfo[_this.endLine-1].linePos.split(",");
                            _this.endX = _this.resetImgX_L(lineData , _this.endX);

                            chooseObj.left =  _this.endX +"px";
                            if(_this.endX<= posInfo[i].right){
                                chooseObj.width = posInfo[i].right - _this.endX +"px";
                            }
                        }else{
                            chooseObj.left =  posInfo[i].left+"px";
                            chooseObj.width = posInfo[i].right - posInfo[i].left +"px";
                        }
                        chooseObj.top =  posInfo[i].top+"px";
                        chooseObj.bottom =  posInfo[i].bottom +"px";
                        chooseObj.height =  posInfo[i].bottom- posInfo[i].top +"px";
                        _this.pageArr[_this.clickPage-1].curBoxArr.push(chooseObj)
                    }
                }
            },
            mouseUpFun(e){
                var _this = this;
                _this.isDown = false;
                if(_this.pageArr[_this.clickPage-1].curBoxArr.length>0){
                    _this.isMove = true;
                }else{
                    return 0;
                }
                if(_this.isMove === true){
                   // 计算按钮组弹出位置
                    var boxW = $("#divMouseRight").width()/2;
                     if( _this.direction === 1){
                         var parentTop =  $("#load-box"+_this.clickPage)[0].offsetTop,
                             childTop = $("#load-box"+_this.clickPage).find(".selectbox").eq(0).css("top").replace("px",""),
                             childW = $("#load-box"+_this.clickPage).find(".selectbox").eq(0).css("width").replace("px",""),
                             childL = $("#load-box"+_this.clickPage).find(".selectbox").eq(0).css("left").replace("px","")
                     }else{
                         var selectLength =  $("#load-box"+_this.clickPage).find(".selectbox").length-1;
                         var parentTop =  $("#load-box"+_this.clickPage)[0].offsetTop,
                             childTop = $("#load-box"+_this.clickPage).find(".selectbox").eq(selectLength).css("top").replace("px",""),
                             childW = $("#load-box"+_this.clickPage).find(".selectbox").eq(selectLength).css("width").replace("px",""),
                             childL = $("#load-box"+_this.clickPage).find(".selectbox").eq(selectLength).css("left").replace("px","")
                     }
                    _this.annotatorStyle.top = Number(parentTop) + Number(childTop)-45 +"px";
                    var annotatorLeft = Number(childL)+ Number(childW)/2 -boxW;
                    var annotatorLeft2 = Number(childL)+ Number(childW)/2 + boxW;
                    _this.annotatorStyle.left =  annotatorLeft + "px";
                    if(annotatorLeft<=0){
                        _this.annotatorStyle.left = 0 + "px"
                    }
                    if(annotatorLeft2>=_this.curWidth){
                        _this.annotatorStyle.left = _this.curWidth - 400 + "px"
                    }
                    _this.annotatorShow = true;
                    _this.copyTextFun();
                }
            },
            addNoteFun(){ //记笔记
               this.noteType = 3;
            //    this.copyTextFun(2);
                this.addToNote();
            },
            //划线
            underLineFun(){
                 var _this = this;
                //_this.pageArr[_this.clickPage-1].curBoxArr = [];
                _this.noteType = 4;
                // _this.copyTextFun(1)
                 _this.noteReplay();
            },
            //高亮
            highLightFun(){
                var _this = this;
                //_this.pageArr[_this.clickPage-1].curBoxArr = [];
                _this.noteType = 5;
                // _this.copyTextFun(1)
                 _this.noteReplay();
            },
            stopFun(){
                $('#read_midbox').find('.box_warp').removeClass('box_warp_cur');
                console.log('stop')
                },
            //添加批注
            addPegFun(e,pageNo){
    
                if(this.isAddPeg === false){return false;}
                this.isFullBoxShowFun([false,true,false]);
                var pegX = this.GetImgX(e);
                var pegY =  this.GetImgY(e);
                this.locationArr = "load-box" + this.clickPage +"#"+ this.changeDivStyle(pegX,0,pegY,0,0,this.curScale);
                this.noteType = 12;
                this.addToNote();

               // console.log(pegX,pegY+"-----curpage:"+this.clickPage);
            },
            //笔记原文区域换算称基准图片大小后的区域
            changeDivStyle(left, right, top, height, width, scale) {
                        var aa = ''; var bb = "";
                        if (left != "NAN") {
                            aa = "left: " + Number(Number(left) * scale).toFixed(8) + "px;"
                        }
                        if (right != "NAN") {
                            bb = "right: " + Number(Number(right) * scale).toFixed(8) + "px;"
                        }
                        return aa + bb + "top: " + Number(Number(top) * scale).toFixed(8) + "px; height: " + Number(height * scale).toFixed(8) + "px; width: " + Number(width * scale).toFixed(8) + "px;"
            },
            copyTextFun(ev){
                //PdfCopy   22|267,285,120,296$   (top,bottom,left,right)
                var _this = this;
                // _this.copyType = type;
                _this.locationArr = "";
                var curArr = _this.pageArr[_this.clickPage-1].curBoxArr;
                var divPos = "";
                // _this.annotatorShow = false;
                var linePre = "";
                for (var i in curArr)
                {
                    var boxRight = Number(curArr[i].left.replace("px","")) + Number(curArr[i].width.replace("px",""));
                    divPos += _this.clickPage + "|" + parseInt(curArr[i].top.replace("px","")) + "," + parseInt(curArr[i].bottom.replace("px","")) + "," + parseInt(curArr[i].left.replace("px","")) + "," + parseInt(boxRight) + "$";

                    // 计算出原始的相对位置
                    if(i>0){
                        linePre = "_"
                    }
                     _this.locationArr += linePre+"load-box" + _this.clickPage +"#"+ _this.changeDivStyle(curArr[i].left.replace("px",""),boxRight,curArr[i].top.replace("px",""),curArr[i].height.replace("px",""),curArr[i].width.replace("px",""),_this.curScale);
                }
                var divInfo={};
                divInfo.pageNo = _this.clickPage;
                divInfo.pos = divPos;
                _this.copyText(divInfo , ev);
            },
            copyText(divInfo,ev){
                 var _this = this;
                pdfApi.copyTextFun({
                    "hfsFileCode": window.InitData.HfsFileCode,
                    "pageIndex":parseInt(divInfo.pageNo),
                    "dbcode": window.InitData.dbCode,
                    "tablename": window.InitData.tableName,
                    "filename": window.InitData.fileName,
                    "divPos": divInfo.pos,
                    "imgWidth":parseInt(_this.curWidth),
                    "imgHeight": parseInt(_this.curHeight),
                    "ispdf": window.InitData.tasktype

                }).then((res) => {
                    if(res.text){
                        //  _this.copyLink();
                        _this.text = res.text;
                    }
                }).catch((err) => {
                }).finally(() => {
                });
            },
            copyLink(){
                // debugger
                var _this = this;
                var clipboard = new Clipboard("#copytext",{
                        text: () => {
                            var  userSelection;
                              userSelection=this.text;
                            
                              if(!!userSelection&&userSelection.length>100){
                                _this.setCopy(true);
                                _this.copyLinkMore();
                                return false; 
                             // userSelection = userSelection.substr(0, 100) + "[…]\n摘自：" + document.title  + "\n在中国知网查看：" + window.location.href + "\n本作品由中国知网阅读全球范围内电子版制作与发行。© 版权所有，侵权必究。";
                              }
                            return userSelection;
                        }
                    });
                clipboard.on('success',
                    function (e) {
                        if(_this.copyType === 5){
                            layer.msg('已经复制到剪切板',{skin:" layui-layer tip-green"});
                        }
                    });
                clipboard.on('error',
                    function (e) {
                        layer.msg('复制失败',{skin:" layui-layer tip-red "});
                    });
            },
             copyLinkMore(){
                 
                var _this = this;
                var clipboard = new Clipboard("#copyTextMore",{
                        text: () => {
                            
                            var  userSelection;
                            userSelection=this.text; 
                            userSelection = userSelection.substr(0, 100) + "[…]\n摘自：" + document.title  + "\n在中国知网查看：" + window.location.href + "\n本作品由中国知网阅读全球范围内电子版制作与发行。© 版权所有，侵权必究。";
                               _this.setCopy(false);
                            return userSelection;
                        }
                    });
                clipboard.on('success',
                    function (e) {
                        if(_this.copyType === 5){
                            layer.msg('已经复制到剪切板',{skin:" layui-layer tip-green"});
                        }
                    });
                clipboard.on('error',
                    function (e) {
                        layer.msg('复制失败',{skin:" layui-layer tip-red "});
                    });
            },
            // 添加到笔记
            addToNote(){
                // console.log("记笔记："+ this.text)
                var _this = this;
                _this.clearTopSign ();
                layer.open({
                    type: 1,
                    title: '添加笔记',   //标题
                    area:["410px","475px"],
                    offset:"r",
                    content: $('#ueBox'),
                    zIndex:10, //层优先级
                    btn: ['确定', '取消'], //按钮组
                    yes: function(index, layero){
                        //do something
                         _this.getUeContent(index);
                        // console.log("getfromUe:"+content);
                        _this.noteReplay();
                        
                    },
                    cancel: function(index, layero){
                        layer.close(index)
                        return false;
                    }
                });
            },
            // 添加笔记接口
            noteReplay(){    
                if (this.noteType===12 || this.noteType===3) {
                    // debugger
                    if (this.ueText.length <=0) {
                        return false;
                    }
                }
                var _this = this;
                var noteData = {},data={};
                var nid = +(new Date) + String(Math.random() + Math.random()).replace(/\d\.\d{10}/, '-');
                if(this.noteType === 4){
                    noteData.type = 4;
                    noteData.noteColor = "#f80";
                    noteData.lineType = 0;
                    noteData.noteOpacity = "1";
                    noteData.lineWidth = "2px";

                }
                if(this.noteType === 5){
                    noteData.type = 5;
                    noteData.noteColor = "#FFA238";   
                    noteData.noteOpacity = "0.3";
                }
                if(this.noteType === 3){
                    noteData.type = 3;
                     
                    noteData.content = encodeURIComponent(this.ueText);
                    data.signStr = this.topSignsArr.join(",");
                }
                if (this.noteType === 12){
                    noteData.type = 12;
                    noteData.content = encodeURIComponent(this.ueText);
                    data.signStr = this.topSignsArr.join(",");
                }
                noteData.title = encodeURIComponent( _this.pdfTitleObj.title);
                noteData.nid = nid;
                noteData.lid = window.InitData.Lid;
                noteData.location =  this.locationArr;
                noteData.quote = noteData.type == 12?"": encodeURIComponent(this.text);
                noteData.sectionId = "load-box" + this.clickPage;
                noteData.sourceId =  window.InitData.FileSourceType == '1' ? window.InitData.Lid : window.InitData.fileName;
                noteData.did = '';
                noteData.fileSourceType = window.InitData.FileSourceType;
                noteData.signIds = "";
                noteData.appId = window.InitData.AppId;

                data.note = noteData;
                data.noteStatus = 0;
                data.tableName = window.InitData.tableName;
                data.dbCode = window.InitData.dbCode;
                data.fileCode = window.InitData.fileName;
                data.topic = window.InitData.Topic;
                data.fsType = window.InitData.FileSourceType;
                data.from = "";
                pdfApi.SetNote(
                    data
                ).then((res) => {                                         
                    _this.isRefer;
                    if(res.note){                       
                        _this.setNoteItem({pageNo: this.clickPage,note:res.note});
                        _this.$nextTick(function(){
                            $('#read_midbox').find('.box_warp').removeClass('box_warp_cur');
                            $('#read_midbox').find('.box_warp[noteid=' +res.note.id + ']').addClass('box_warp_cur');
                            $("#read_midbox .cur").removeClass('cur');
                            if (res.note.type == 3) {
                                $("#read_midbox").find('.'+res.note.id).addClass('cur');
                            }
                            
                       })
                           var noteTimer = setTimeout(function () {
                                $(".study-r .note-ul").find('img').popImg();
                                clearTimeout(noteTimer);
                            }, 1000);
                        if(_this.isRefer === 'refer'){
                            _this.$set(res.note,'isUpdateNote',true)
                            parent.postMessage(JSON.stringify(res.note), '/'); // (参考文献或引证文献做笔记时调用)
                        }                       
                    }
                }).catch((err) => {
                }).finally(() => {
                    _this.pageArr[this.clickPage-1].curBoxArr = [];
                });
            },
            // 工具书搜索
            toolSearchFun(){
                 this.toolSearch();
                // this.copyTextFun(4);
            },
            toolSearch(){
                if (this.text.length <= 16) {
                    window.open("http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=" + this.text);
                } else {
                    layer.msg('请选择16个以下字符搜索工具书',{skin:" layui-layer tip-orange "});
                }
            },
            //摘录
            addCentorFun(ev){
                 this.addCentor(ev);
                // this.copyTextFun(3,ev);
            },
            addCentor(ev){
                var _this = this;
                if (_this.isCopy) {
                     var start = {
                     left:document.body.clientWidth/2,
                     top:document.body.clientHeight/2
                   }
                }else{
                   var start = {
                     left:ev.pageX,
                     top:ev.pageY
                   }
                }
               
                 _this.setCopy(false);
                var offset = $('.i-unify').offset() || $(window.parent.document.getElementsByClassName("i-unify")).offset();
                var img = 'http://x.cnki.net/read/front_end/src/modules/pdf/images/nav-icon.png';
                var flyer = $('<img style="z-index:99999" src="' + img + '">');
                
                flyer.fly({
                    start:start,
                    end: {
                        left: offset.left + 10,//抛物体终点横坐标
                        top: offset.top + 10, //抛物体终点纵坐标
                    },
                    onEnd: function () {
                        flyer.remove();
                        _this.addCentorApi();
                    }
                });
            },
            addCentorApi(){
                var _this = this;
                var centoInfo = {};
                centoInfo = {
                    centoId: +(new Date) + String(Math.random() + Math.random()).replace(/\d\.\d{10}/, '-'),
                    fileQuoteId: +(new Date) + String(Math.random() + Math.random()).replace(/\d\.\d{10}/, '-'),
                    studyId: window.InitData.Topic,//专题Id
                    chapterId: '',
                    sectionId: '',
                    startPostion: -1,
                    endPostion: -1,
                    content: encodeURIComponent(_this.text),
                    type: 1,
                    fileCode: window.InitData.fileName,
                    dbCode: window.InitData.dbCode,
                    tableName: window.InitData.tableName,
                    fileName: window.InitData.fileName,
                    title: encodeURIComponent( _this.pdfTitleObj.title),
                    source: window.InitData.SourceTitle,
                    author: window.InitData.AuthorNames,
                    fileReadType: 2,
                    fileBusinessSource: window.InitData.FileSourceType || '2',
                }
                pdfApi.addCentoInfo(
                    centoInfo
                ).then((res) => {
                    _this.addExtractInfo(centoInfo);
                    layer.msg('添加成功',{skin:" layui-layer tip-green "});
                }).catch((err) => {
                    layer.msg('添加失败',{skin:" layui-layer tip-red "});

                }).finally(() => {
                });
            },
             //删除笔记
            delNote(id,type,pageNo){
                
                pageNo = pageNo - 1;
                var _this = this;
                layer.confirm('<p style="margin-bottom: 35px;">您是否要删除这条笔记?</p>', { icon: 3, title: '提示' }, function (index) {
                    pdfApi.delNote({
                        noteId: id,
                        appId: window.InitData.AppId
                    }).then((res) => {
                           
                            if (type === 3){
                            _this.pageArr[pageNo].curNoteArr =  _this.pageArr[pageNo].curNoteArr.filter(function (item) {
                                return item.noteId != id;
                            })
                              _this.pageArr[pageNo].initNoteArr =  _this.pageArr[pageNo].initNoteArr.filter(function (item) {
                                return item.noteId != id;
                            })
                        }else if(type === 4){
                            _this.pageArr[pageNo].curLineArr =  _this.pageArr[pageNo].curLineArr.filter(function (item) {
                                return item.noteId !=  id;
                            })
                             _this.pageArr[pageNo].initLineArr =  _this.pageArr[pageNo].initLineArr.filter(function (item) {
                                return item.noteId !=  id;
                            })
                        }else if(type === 5){
                            _this.pageArr[pageNo].curHighLightArr =  _this.pageArr[pageNo].curHighLightArr.filter(function (item) {
                                return item.noteId != id;
                            })
                             _this.pageArr[pageNo].initHighLightArr =  _this.pageArr[pageNo].initHighLightArr.filter(function (item) {
                                return item.noteId != id;
                            })
                        } else if(type === 12){
                            _this.pageArr[pageNo].curPiArr =  _this.pageArr[pageNo].curPiArr.filter(function (item) {
                                return item.noteId != id;
                            })
                             _this.pageArr[pageNo].initPiArr =  _this.pageArr[pageNo].initPiArr.filter(function (item) {
                                return item.noteId != id;
                            })
                        }
                        _this.pageArr[pageNo].curNoteBoxArr =  _this.pageArr[pageNo].curNoteBoxArr.filter(function (item) {
                            return item.noteId !=  id;
                        })
                        _this.pageArr[pageNo].initNoteBoxArr =  _this.pageArr[pageNo].initNoteBoxArr.filter(function (item) {
                            return item.noteId !=  id;
                        })
                        // $('#read_midbox').find('.' + id).remove();
                        _this.noteList.forEach((item,index) => {
                            
                            if (item.id == id) {
                                _this.delNoteFun(index);
                            }
                        });
                        layer.msg("删除成功",{skin:" layui-layer tip-green "})
 
                    }).catch((err) => {
                       // layer.msg('删除失败',{skin:" layui-layer tip-red"})
                        // _this.$message.error('删除失败');
                    }).finally(() => {

                    });
                    layer.close(index);
                });
            }, 
            // 笔记颜色设置
            setColor(item,pageNo){              
                var x = item.style.left.replace('px',''),y=item.style.top.replace('px',''),w = Number(item.style.width.replace('px',''));
                var scrollDis = $("#read_mid_srollbar").scrollTop();
                var boxTop  = $("#read_mid_srollbar").offset().top;
                var curPageH =  $("#load-box"+pageNo)[0].offsetTop;
                var client_y = Number(y) + Number(curPageH) + Number(boxTop)-Number(scrollDis);
                var client_x = Number(x) + Number($("#read_midbox").offset().left);
                var colorX = client_x + (w - 224)/2 +'px',
                    colorY = 0;
                    if (item.type == 4) {
                         colorY = client_y - 272;
                    }else{
                       colorY = client_y - 204; 
                    }
                    colorY = (colorY>0?colorY:0) +'px';

                var colorData = {
                    style:{
                        left:colorX,
                        top:colorY
                    },
                    pageNo:pageNo,
                    noteId:item.noteId,
                    type:item.type,
                    show:true,
                    comments:item.comments
                }    

                this.setColorData(colorData);
            },
            // 鼠标不在当前激活的笔记，颜色选择框消失
            closeCoBox(item){
               var isCur = $('#read_midbox').find('.box_warp[noteid=' + item.noteId + ']').hasClass("box_warp_cur");
               if (!isCur && item.type==3) {
                    $("#read_midbox").find('.'+item.noteId).removeClass('cur'); 
               } 
               if (item.noteId == this.colorData.noteId && this.colorData.show) {
                   item.comments.noteType = item.type;
                   item.comments.noteId = item.noteId;
                   this.closeColorBox(item.comments)
               }else{
                   this.setColorDataShow(false);
               }
            },
            mouseCurFun(id,type){
                if (type == 3) {
                     $("#read_midbox").find('.'+id).addClass('cur');
                }  
            },
            // 
            showBlueBox(id){
                $('#read_midbox').find('.box_warp[noteid=' + id + ']').addClass('box_warp_blue');
            },
            hideBlueBox(id){
                var hideTimer = setTimeout(function () {
                    $('#read_midbox').find('.box_warp[noteid=' + id + ']').removeClass('box_warp_blue');
                    clearTimeout(hideTimer);
                },300)
                
            },
            findNote(index,id,type){
                 this.piCur = index;
                 
                 $('#read_midbox').find('.box_warp').removeClass('box_warp_cur');
                 $('#read_midbox').find('.box_warp[noteid=' + id + ']').addClass('box_warp_cur');
                 $('#read_midbox').find('.box_warp .boxBtnGroup').removeClass('boxBtnGroup-show');
                 $('#read_midbox').find('.box_warp[noteid=' + id + '] .boxBtnGroup').addClass('boxBtnGroup-show');
                 $("#read_midbox .cur").removeClass('cur');
                 if (type == 3) {
                    $("#read_midbox").find('.'+id).addClass('cur');
                 }
                 $('.study-r .note-ul .is-cur').removeClass('is-cur');
                 $('.study-r .note-ul').find("."+id).addClass('is-cur');
                var curLiHeight = $('.note-ul li[noteid=' + id + ']')[0].offsetTop - 10;
                $(".r-hide").scrollTop(curLiHeight);
                return false;
            },
            //拖拽阅读
            read_MouseDown(ev){
               if(!this.isDrag){
                   return false;
               }
                this.imgParams.flag = true;
                this.imgParams.currentX = ev.clientX;
                this.imgParams.currentY = ev.clientY;
                this.imgParams.scrolltop = $("#read_mid_srollbar").scrollTop();
                this.imgParams.scrollleft = $("#read_mid_srollbar").scrollLeft();
                var _this = this;
                document.onmouseup = function () {
                    _this.imgParams.flag = false;
                };
                document.onmousemove = function (event) {
                    var e = event ? event : window.event;
                    if (_this.imgParams.flag) {
                        event.preventDefault();
                        var nowX = e.clientX,
                            nowY = e.clientY;
                        var disX = nowX - _this.imgParams.currentX,
                            disY = nowY - _this.imgParams.currentY;

                        $("#read_mid_srollbar").scrollTop(_this.imgParams.scrolltop - disY);
                        $("#read_mid_srollbar").scrollLeft(_this.imgParams.scrollleft - disX);
                    }
                }
            },
        }
    }
</script>
<style>
    /*<--中间内容部分Bg-->*/
    #read_mid_srollbar{box-sizing: border-box;padding:0 20px;}
    .hand1{cursor:url("../../assets/images/hand1.cur"),auto;}
    .hand2{cursor:url("../../assets/images/hand2.cur"),auto;}
    /*.crosshair{cursor:url("../../assets/images/pdf/bz.ico"),auto;}*/
    #read_midbox{position: relative;margin: auto;}
    #read_midbox .read_over{position: absolute;width: 100%;z-index: 4;}
    .cursor_text{cursor: text;}
    .cursor_pointer{cursor:url("../../assets/images/pdf/bz.ico"),auto;}


    #read_midbox .load-box{margin-bottom: 12px;position: relative;overflow: hidden}
    #read_midbox .load-box, #read_midbox .load-box .pdfImg{width: 100%;}
    #read_midbox .initbox{position: absolute;background: rgba(0,50,211,0);cursor:text;}
    /*<--中间内容部分End-->*/
    #read_midbox .selectbox{position: absolute;background: rgba(0,50,211,0.4);cursor: text;}
    #read_midbox .mark-line {position: absolute;cursor: text;}
    #read_midbox .mark-line.cur{background:rgba(0,128,247,.25);}
    #read_midbox .high_Light{position: absolute;background:rgba(0,247,215,.25);cursor: text;}

    #read_midbox .note_box{position: absolute;cursor: text;}
    #read_midbox .note_box.cur{background:rgba(0,128,247,.25);}
    #read_midbox .note_ico{width:14px;height:14px;position: absolute;left: -13px;top: -18px;z-index: 102;cursor: pointer;background:url("../../assets/images/mynote.png") no-repeat center;background-size: 100%;}
    /* .note_ico {color: #f70;} */
    #read_midbox .note_box .ico-cur {color: #ff2525;}
    .bz-ico{position: absolute; z-index: 10;width:22px!important;height:22px!important;background:url("../../assets/images/biaozhu.png") no-repeat center;background-size: 100%; /* font-size: 18px; color: #ff8125; */cursor:pointer;}
    .bz-ico.cur{background:url("../../assets/images/biaozhuNow.png") no-repeat center;background-size: 100%; }
    .bz-ico .boxBtnGroup{top: -40px;left: 60px;}
    .box_warp{position: absolute;border: 3px dashed rgba(0,0,0,0);cursor: text;}
    /* 删除 颜色按钮组 */
    .boxBtnGroup{display: none;}
    .box_warp:hover{border-color: blue;}
    .box_warp_blue{border-color: blue;z-index: 7;}
    .box_warp_cur:hover .boxBtnGroup{display: block;z-index: 6;}

    .box_warp_cur{border-color: red !important;z-index: 5;}
    /*按钮组*/
    .annotator-adder{position:absolute;text-align:center;white-space: nowrap;font-size: 0;z-index: 103;}
    .annotator-adder:after{content:"";position:absolute;bottom:-14px;left:50%;margin-left:-8px;width:0;height:0;border:8px solid transparent;border-top-color:#545454;}
    .annotator-adder-btn{padding: 0 15px;margin-left: -1px;line-height:36px;text-align:center;font-size: 14px;color:#fff;background-color:#545454;border:none;border-radius:2px 0 0 2px;outline:none;}
    .annotator-adder-btn:hover{ background-color:#464646;}
    .annotator-adder-btn-r{border-radius:0 2px 2px 0;}
    .loading_Img{position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto; z-index: 999;}
</style>
<style scoped>
/* resize-i */
    .resize-i{position: absolute;z-index: 12;}
/* 划线颜色 线型*/
    .mark-line-solid{border-bottom-style: solid;}
    .mark-line-double{border-bottom-style: double;}
    .mark-line-dashed{border-bottom-style: dashed;}
    .mark-line-dotted{border-bottom-style: dotted;}
    .mark-line-wave i{
    position:absolute;
    left:0;right:0;bottom:-5px;
    height:4px;
    background-position:bottom}
    .mark-line.ck-a1{border-color:#2371ef;background:0 0}
    .mark-line.ck-a2{border-color:#f80;background:0 0}
    .mark-line.ck-a3{border-color:#36c416;background:0 0}
    .mark-line.ck-a4{border-color:#c39c00;background:0 0}
    .mark-line.ck-a5{border-color:#8458e6;background:0 0}
    .mark-line.ck-a6{border-color:#ff566e;background:0 0}
    .mark-line.ck-a7{border-color:#db4bdd;background:0 0}
    .mark-line.ck-a8{border-color:#f59277}
    .opa-a{position:relative;display:inline-block;width:28px;height:28px;margin:-3px 20px 12px 0;line-height:28px;text-align:center;border-radius:50%;/* background:url(../Images/co-bj.jpg) */}
    .opa-a span{display:block;font-size:12px;transform:scale(.75);color:#fff;position:relative;z-index:1}
    .opa-a:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;border-radius:50%}
    .opa-a1:after{background:rgba(35,113,239,.25)}
    .opa-a2:after{background:rgba(35,113,239,.5)}
    .opa-a3:after{background:rgba(35,113,239,.75)}
    .opa-a4:after{background:rgba(35,113,239,1)}
</style>
