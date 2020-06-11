import pdfApi from '@/api/pdf.js'
import store from '../../index.js'

const UNLOAD = 0;
const LOADING = 1;
const LOADED = 2;


const pdfModule = {
    namespaced: true,
    state: {
        t1:0,
        t2:0,
        t3:0,
        timer:null,
        zoomPageStyle:{width:''},
        oldImgW:"",
        oldImgH:"",
        pageArr:[], //渲染页面
        pageSize:5,
        totalNum:1,
        initPageNo:1,
        curPageNo:1,
        initPageW:0,
        curWidth:"",
        curHeight:"",  // 当前图片高度
        curBoxStyle:{ height: ''},
        curOverStyle: {height: ''},  //蒙版高度
        curScale:1,
        copyZi:"",
        noteList:[],
        originalWidth:0,
        beforeFullOriginalWidth:0,
        zoom:100, // 当前页面的缩放比例
        isRefreshRes1:false,
    },
    getters: {
        bbb(state) {
            return '';
        }
    },
    mutations: {
        setInitPageW(state,res){state.initPageW = res},
        changeColor(state,res){
            if (res.noteType == 4) {
                var curArr = state.pageArr[res.pageNo-1].initLineArr;
                for (var i = 0; i < curArr.length; i++) {
                    if (curArr[i].noteId == res.noteId) {
                        state.pageArr[res.pageNo-1].initLineArr[i].style['border-color'] = res.noteColor;
                        state.pageArr[res.pageNo-1].curLineArr[i].style['border-color'] = res.noteColor;
                    }    
                }
            }else if (res.noteType == 5) {
                debugger
                var curArr = state.pageArr[res.pageNo-1].initHighLightArr;
                for (var i = 0; i < curArr.length; i++) {
                    if (curArr[i].noteId == res.noteId) {
                        state.pageArr[res.pageNo-1].initHighLightArr[i].style.background= res.noteColor;
                        state.pageArr[res.pageNo-1].curHighLightArr[i].style.background = res.noteColor;
                    }    
                }
            }
            var boxArr = state.pageArr[res.pageNo-1].initNoteBoxArr;
                for (var m = 0; m < boxArr.length; m++) {
                    if (boxArr[m].noteId == res.noteId) {
                        state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.noteColor = res.noteColor;
                        state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.noteColor = res.noteColor;
                        state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.noteColorIndex = res.colorIndex;
                        state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.noteColorIndex = res.colorIndex;
                    }    
                }
           
        },
        changeOpacity(state,res){
           if (res.noteType == 4) {
            var curArr = state.pageArr[res.pageNo-1].initLineArr;
            for (let i = 0; i < curArr.length; i++) {
                if (curArr[i].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initLineArr[i].style.opacity = res.noteOpacity;
                    state.pageArr[res.pageNo-1].curLineArr[i].style.opacity = res.noteOpacity;
                }    
            }
            }else if (res.noteType == 5) {
                var curArr = state.pageArr[res.pageNo-1].initHighLightArr;
                for (let i = 0; i < curArr.length; i++) {
                    if (curArr[i].noteId == res.noteId) {
                        state.pageArr[res.pageNo-1].initHighLightArr[i].style.opacity= res.noteOpacity;
                        state.pageArr[res.pageNo-1].curHighLightArr[i].style.opacity = res.noteOpacity;
                    }    
                }
            }
            var boxArr = state.pageArr[res.pageNo-1].initNoteBoxArr;
            for (let m = 0; m < boxArr.length; m++) {
                if (boxArr[m].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.noteOpacity = res.noteOpacity;
                    state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.noteOpacity = res.noteOpacity;
                    state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.noteOpacityIndex = res.noteOpacityIndex;
                    state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.noteOpacityIndex = res.noteOpacityIndex;
                }    
            }
        },
        changeLineType(state,res){
            var curArr = state.pageArr[res.pageNo-1].initLineArr;
            for (let i = 0; i < curArr.length; i++) {
                if (curArr[i].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initLineArr[i].lineType = res.lineType;
                    state.pageArr[res.pageNo-1].curLineArr[i].lineType = res.lineType;
                }    
            }
            var boxArr = state.pageArr[res.pageNo-1].initNoteBoxArr;
            for (let m = 0; m < boxArr.length; m++) {
                if (boxArr[m].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.lineType = res.lineType;
                    state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.lineType = res.lineType;
                    state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.lineTypeIndex = res.index;
                    state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.lineTypeIndex = res.index;
                }    
            }
        },
        changeLineWidth(state,res){
            var curArr = state.pageArr[res.pageNo-1].initLineArr;
            for (let i = 0; i < curArr.length; i++) {
                if (curArr[i].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initLineArr[i].style['border-bottom-width'] = res.lineWidth;
                    state.pageArr[res.pageNo-1].curLineArr[i].style['border-bottom-width'] = res.lineWidth;
                    var comments = {};
                    switch (res.lineWidth) {
                        case '1px':
                            comments.waveData1 = 40;
                            comments.waveData2 = 60;
                            break;
                        case '2px':
                            comments.waveData1 = 40;
                            comments.waveData2 = 60;
                            break;
                        case '3px':
                            comments.waveData1 = 35;
                            comments.waveData2 = 65;
                            break;
                        case '4px':
                            comments.waveData1 = 30;
                            comments.waveData2 = 70;
                            break;
                        case '5px':
                            comments.waveData1 = 25;
                            comments.waveData2 = 75;
                            break;   
                        default:
                            comments.waveData1 = 40;
                            comments.waveData2 = 60;       
                    }
                    state.pageArr[res.pageNo-1].initLineArr[i].waveData1 = comments.waveData1;
                    state.pageArr[res.pageNo-1].initLineArr[i].waveData2 = comments.waveData2;
                    state.pageArr[res.pageNo-1].curLineArr[i].waveData1 = comments.waveData1;
                    state.pageArr[res.pageNo-1].curLineArr[i].waveData2 = comments.waveData2;
                }    
            }
            var boxArr = state.pageArr[res.pageNo-1].initNoteBoxArr;
            for (let m = 0; m < boxArr.length; m++) {
                if (boxArr[m].noteId == res.noteId) {
                    state.pageArr[res.pageNo-1].initNoteBoxArr[m].comments.lineWidth = res.lineWidth;
                    state.pageArr[res.pageNo-1].curNoteBoxArr[m].comments.lineWidth = res.lineWidth;
                }    
            }
        },
        // 初始化渲染到页面上的全部笔记
        setNoteList(state,result){
            state.noteList =  result;
            // pdfModule.mutations.showAlert(state);
            if(state.isRefreshRes1){
                return ;
            }
            for (var i in state.noteList){

                if (state.noteList[i].location == null) {
                    continue;
                }
                var comments = {};
                if (state.noteList[i].type == 4 || state.noteList[i].type == 5) {                   
                    // 线色
                    let note = state.noteList[i];
                    if (!note.noteColor || note.noteColor == null) {
                        comments.noteColor = note.type == 4?'#f80':'#FFA238';
                    }else{
                        comments.noteColor = note.noteColor;
                    }
                    
                    switch (comments.noteColor) {               
                        case "#2371ef" : case "#FFFB8F":
                            comments.noteColorIndex = 1;
                            break;
                        case "#f80" : case '#FFA238':
                            comments.noteColorIndex = 2;
                            break;
                        case "#36c416" : case '#6DD555':
                            comments.noteColorIndex = 3;
                            break;
                        case "#c39c00" : case '#E5BA0D':
                            comments.noteColorIndex = 4;
                            break;   
                        case "#8458e6" : case '#B79BF7':
                            comments.noteColorIndex = 5;
                            break;
                        case "#ff566e" : case '#FF8495':
                            comments.noteColorIndex = 6;
                            break;
                        case "#db4bdd" : case '#F184F0':
                            comments.noteColorIndex = 7;
                            break;
                        case "#f59277" : case '#FF9E83':
                            comments.noteColorIndex = 8;
                            break;      
                        default:
                            comments.noteColorIndex = 1;       
                    }
                    //线宽
                    if (!note.lineWidth || note.lineWidth == null) {
                        comments.lineWidth = '2px';
                    }else{
                        comments.lineWidth = note.lineWidth;
                    }
                    //透明度
                    if (!note.noteOpacity || note.noteOpacity == null) {
                        comments.noteOpacity = note.type ==4?'1':'0.3';
                    }else{
                        comments.noteOpacity = note.noteOpacity;
                    }
                    if (state.noteList[i].type == 4) {
                        switch (comments.noteOpacity) {
                            case '0.25':
                                comments.noteOpacityIndex = 0;
                                break;
                            case '0.5':
                                comments.noteOpacityIndex = 1;
                                break;
                            case '0.75':
                                comments.noteOpacityIndex = 2;
                                break;
                            case '1':
                                comments.noteOpacityIndex = 3;
                                break; 
                            default:
                                comments.noteOpacityIndex = 3;        
                        }
                    }
                    if (state.noteList[i].type == 5) {
                        switch (comments.noteOpacity) {
                            case '0.1':
                                comments.noteOpacityIndex = 1;
                                break;
                            case '0.3':
                                comments.noteOpacityIndex = 2;
                                break;
                            case '0.5':
                                comments.noteOpacityIndex = 3;
                                break;
                            case '0.7':
                                comments.noteOpacityIndex = 4;
                                break; 
                            default:
                                comments.noteOpacityIndex = 1;        
                        }
                    }
                   
                    // 线型
                    
                    if (!note.lineType || note.lineType == null) {
                        comments.lineType = 'solid';
                        comments.lineTypeIndex = 0;
                    }else{
                        comments.lineTypeIndex = note.lineType;
                        var type = note.lineType;
                        switch (type) {
                            case 0:
                                comments.lineType = "solid";
                                break;
                            case 1:
                                comments.lineType = "double";
                                break;
                            case 2:
                                comments.lineType = "dashed";
                                break;
                            case 3:
                                comments.lineType = "dotted";
                                break;
                            case 4:
                                comments.lineType = "wave";
                                break;   
                            default:
                                comments.lineType = "solid";        
                        }
                    }
                    
                    if (state.noteList[i].type == 4) {
                        switch (comments.lineWidth) {
                            case '1px':
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;
                                break;
                            case '2px':
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;
                                break;
                            case '3px':
                                comments.waveData1 = 35;
                                comments.waveData2 = 65;
                                break;
                            case '4px':
                                comments.waveData1 = 30;
                                comments.waveData2 = 70;
                                break;
                            case '5px':
                                comments.waveData1 = 25;
                                comments.waveData2 = 75;
                                break;   
                            default:
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;          
                        }
                    }
                } 
               let pageNo = Number(state.noteList[i].location.split("#")[0].replace("load-box", ""))-1;
               // type:3（笔记），4（划线），5高亮，12（批注）
                if(state.noteList[i].type === 3){
                    pdfModule.mutations.setNotePage(state,{type:state.noteList[i].type,pageNo:pageNo,noteId:state.noteList[i].id, location:state.noteList[i].location});
                }
               if(state.noteList[i].type === 4){
                   pdfModule.mutations.setLinePage(state,{comments:comments,type:state.noteList[i].type,pageNo:pageNo,noteId:state.noteList[i].id,location:state.noteList[i].location});
               }
               if(state.noteList[i].type === 5){
                pdfModule.mutations.setHighLight(state,{comments:comments,type:state.noteList[i].type, pageNo:pageNo,noteId:state.noteList[i].id,location:state.noteList[i].location});
            }
               if(state.noteList[i].type === 12){
                  pdfModule.mutations.setPiPage(state,{type:state.noteList[i].type,pageNo:pageNo,noteId:state.noteList[i].id,location:state.noteList[i].location});
               }
               if (state.noteList[i].type !== 12) {
                pdfModule.mutations.setNoteBox(state,{comments:comments,type:state.noteList[i].type,pageNo:pageNo,noteId:state.noteList[i].id,location:state.noteList[i].location})

               }
             

            }
            state.isRefreshRes1 = true;
        },
        // 删除笔记
        delNoteFun(state,item){    
            state.noteList.splice(item, 1);
        },
        setPiPage(state,piInfo){
            // debugger
            var pageNo =  piInfo.pageNo;
            var location = piInfo.location.split("#")[1].split(";");
            var initPiObj = {},curPiObj = {};
            initPiObj.left =  location[0].split(":")[1].replace("px","");
            initPiObj.top =  location[2].split(":")[1].replace("px","");
            initPiObj.height =  0;
            initPiObj.width =  0;

            curPiObj.left = (initPiObj.left / state.curScale) + "px";
            curPiObj.height = 0+ "px";
            curPiObj.top = (initPiObj.top  / state.curScale)-5 + "px";
            curPiObj.width = 0 + "px";

            var initPiSty = {
                style:initPiObj,
                noteId:piInfo.noteId,
                type:piInfo.type
            }
            var curPiSty = {
                style:curPiObj,
                noteId:piInfo.noteId,
                type:piInfo.type
            }
            state.pageArr[pageNo].initPiArr.push(initPiSty);
            state.pageArr[pageNo].curPiArr.push(curPiSty);
        },
        setLinePage(state,note){
            
            var pageNo = Number(note.pageNo);
            
            var locationStr = note.location,locationArr = [];
            if(locationStr.indexOf("_")>0){
                locationArr = locationStr.split("_");
            }else{
                locationArr[0] = locationStr;
            }
           
            for(let i in locationArr){
                var location = locationArr[i].split("#")[1].split(";");
                var initNoteObj = {},curNoteObj = {};
                initNoteObj.left =  location[0].split(":")[1].replace("px","");
                initNoteObj.top =  location[2].split(":")[1].replace("px","");
                initNoteObj.height =  location[3].split(":")[1].replace("px","");
                initNoteObj.width =  location[4].split(":")[1].replace("px","");
                initNoteObj['border-color'] = note.comments.noteColor;
                initNoteObj['border-bottom-width'] = note.comments.lineWidth;
                initNoteObj.opacity =  note.comments.noteOpacity;

                curNoteObj.left = initNoteObj.left / state.curScale + "px";
                curNoteObj.height = initNoteObj.height / state.curScale + "px";
                curNoteObj.top = (Number( initNoteObj.top ))  / state.curScale + "px";
                curNoteObj.width = initNoteObj.width / state.curScale + "px";
                curNoteObj['border-color'] = note.comments.noteColor;
                curNoteObj['border-bottom-width'] = note.comments.lineWidth;
                curNoteObj.opacity =  note.comments.noteOpacity;

                var initNoteSty = {
                    style:initNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i,
                    lineType:note.comments.lineType,
                    waveData1:note.comments.waveData1,
                    waveData2:note.comments.waveData2,
                }
                var curNoteSty = {
                    style:curNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i,
                    lineType:note.comments.lineType,
                    waveData1:note.comments.waveData1,
                    waveData2:note.comments.waveData2,
                }
                // debugger
                state.pageArr[pageNo].initLineArr.push(initNoteSty);
                state.pageArr[pageNo].curLineArr.push(curNoteSty); 
               
              
            }
        },
        setHighLight(state,note){
            //debugger
            var pageNo = Number(note.pageNo);
            var comments = {};
            var locationStr = note.location,locationArr = [];
            if(locationStr.indexOf("_")>0){
                locationArr = locationStr.split("_");
            }else{
                locationArr[0] = locationStr;
            }          
            
            for(let i in locationArr){
                var location = locationArr[i].split("#")[1].split(";");
                var initNoteObj = {},curNoteObj = {};
                initNoteObj.left =  location[0].split(":")[1].replace("px","");
                initNoteObj.top =  location[2].split(":")[1].replace("px","");
                initNoteObj.height =  location[3].split(":")[1].replace("px","");
                initNoteObj.width =  location[4].split(":")[1].replace("px","");
                initNoteObj.background = note.comments.noteColor;
                initNoteObj.opacity =  note.comments.noteOpacity;

                curNoteObj.left = initNoteObj.left / state.curScale + "px";
                curNoteObj.height = initNoteObj.height / state.curScale + "px";
                curNoteObj.top = (Number( initNoteObj.top ))  / state.curScale + "px";
                curNoteObj.width = initNoteObj.width / state.curScale + "px";
                curNoteObj.background = note.comments.noteColor;
                curNoteObj.opacity =  note.comments.noteOpacity;

                var initNoteSty = {
                    style:initNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i,
                    comments:comments
                }
                var curNoteSty = {
                    style:curNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i,
                    comments:comments
                }
                
                state.pageArr[pageNo].initHighLightArr.push(initNoteSty);
                state.pageArr[pageNo].curHighLightArr.push(curNoteSty);
              
            }
        },
        setNoteBox(state,note){
            // 这里需要判断location的行数，大于一需要遍历
            var pageNo = Number(note.pageNo);
            var locationStr = note.location,locationArr = [];
            if(locationStr.indexOf("_")>0){
                locationArr = locationStr.split("_");
            }else{
                locationArr[0] = locationStr;
            }
            // debugger
            var minLeft= 9000000,maxRight=0,maxBottom=0,minTop=9000000,maxHeight=0,icoLeft=0;
            for(let i in locationArr){               
                var location = locationArr[i].split("#")[1].split(";");
                var curLeft =  Number(location[0].split(":")[1].replace("px",""));
                var curRight =  Number(location[1].split(":")[1].replace("px",""));
                var curTop =  Number(location[2].split(":")[1].replace("px",""));
                var curHeight =  Number(location[3].split(":")[1].replace("px",""));
                
                if(i==0){
                    icoLeft = curLeft;
                }
                if(curLeft<minLeft){
                    minLeft = curLeft;
                }
                if(curRight>maxRight){
                    maxRight = curRight;
                }
                if(curTop<minTop){
                    minTop = curTop;
                }
                if (curTop>maxBottom) {
                    maxBottom = curTop;                
                }
                if(curHeight>maxHeight){
                    maxHeight = curHeight;
                }
                
            } 
            var initNoteObj = {
                left:minLeft,
                top:minTop,
                width:maxRight - minLeft,
                height:maxBottom - minTop + maxHeight
            } 
            var curNoteObj = {
                left:minLeft / state.curScale -6 + "px",
                top:minTop / state.curScale -6 + "px",
                width:(maxRight - minLeft) / state.curScale + 6 + "px",
                height:(maxBottom - minTop+maxHeight)/ state.curScale + 4 + "px"
            }
                   
            var initNoteSty = {
                style:initNoteObj,
                noteId:note.noteId,
                type:note.type,
                comments:note.comments,
                icoStyle:{                  
                    left:icoLeft-minLeft
                }
                
            }
            var notePos = note.type==3?58:114;
            var curNoteSty = {
                style:curNoteObj,
                noteId:note.noteId,
                type:note.type,
                styleBtnGroup:{
                    left:(((maxRight - minLeft) / state.curScale)-notePos)/2 +'px',
                    top:-38+'px'
                },
                comments:note.comments,
                icoStyle:{
                    top:-14 + 'px',
                    left:(icoLeft-minLeft)/state.curScale -13 +'px'
                }
            }
            
            state.pageArr[pageNo].initNoteBoxArr.push(initNoteSty);
            state.pageArr[pageNo].curNoteBoxArr.push(curNoteSty);
                    
                      
        },
        setNotePage(state,note){
            // 这里需要判断location的行数，大于一需要遍历
            var pageNo = Number(note.pageNo);
            var locationStr = note.location,locationArr = [];
            if(locationStr.indexOf("_")>0){
                locationArr = locationStr.split("_");
            }else{
                locationArr[0] = locationStr;
            }
            // debugger

            for(let i in locationArr){
                var location = locationArr[i].split("#")[1].split(";");
                var initNoteObj = {},curNoteObj = {};
                initNoteObj.left =  location[0].split(":")[1].replace("px","");
                initNoteObj.top =  location[2].split(":")[1].replace("px","");
                initNoteObj.height =  location[3].split(":")[1].replace("px","");
                initNoteObj.width =  location[4].split(":")[1].replace("px","");

                curNoteObj.left = initNoteObj.left / state.curScale + "px";
                curNoteObj.height = initNoteObj.height / state.curScale + "px";
                curNoteObj.top = (Number( initNoteObj.top ))  / state.curScale + "px";
                curNoteObj.width = initNoteObj.width / state.curScale + "px";

                var initNoteSty = {
                    style:initNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i
                }
                var curNoteSty = {
                    style:curNoteObj,
                    noteId:note.noteId,
                    type:note.type,
                    index:i
                }
                state.pageArr[pageNo].initNoteArr.push(initNoteSty);
                state.pageArr[pageNo].curNoteArr.push(curNoteSty);
            }
        },
        addToCurBoxArr(state,page){
            state.pageArr[page].curBoxArr = [];
        },
        setNoteItem(state,result){
            var comments = {};
            if (result.note.type == 4 || result.note.type == 5) {                   
                // 线色
                comments.noteColor = result.note.type == 4?'#f80':'#FFA238';
                switch (comments.noteColor) {               
                    case "#2371ef" : case "#FFFB8F":
                        comments.noteColorIndex = 1;
                        break;
                    case "#f80" : case '#FFA238':
                        comments.noteColorIndex = 2;
                        break;
                    case "#36c416" : case '#6DD555':
                        comments.noteColorIndex = 3;
                        break;
                    case "#c39c00" : case '#E5BA0D':
                        comments.noteColorIndex = 4;
                        break;   
                    case "#8458e6" : case '#B79BF7':
                        comments.noteColorIndex = 5;
                        break;
                    case "#ff566e" : case '#FF8495':
                        comments.noteColorIndex = 6;
                        break;
                    case "#db4bdd" : case '#F184F0':
                        comments.noteColorIndex = 7;
                        break;
                    case "#f59277" : case '#FF9E83':
                        comments.noteColorIndex = 8;
                        break;      
                    default:
                        comments.noteColorIndex = 1;       
                }
                //线宽
                comments.lineWidth = '2px';
                
                //透明度
                comments.noteOpacity = result.note.type ==4?'1':'0.3';
                if (result.note.type == 4) {
                    switch (comments.noteOpacity) {
                        case '0.25':
                            comments.noteOpacityIndex = 0;
                            break;
                        case '0.5':
                            comments.noteOpacityIndex = 1;
                            break;
                        case '0.75':
                            comments.noteOpacityIndex = 2;
                            break;
                        case '1':
                            comments.noteOpacityIndex = 3;
                            break; 
                        default:
                            comments.noteOpacityIndex = 3;        
                    }
                        switch (comments.lineWidth) {
                            case '1px':
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;
                                break;
                            case '2px':
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;
                                break;
                            case '3px':
                                comments.waveData1 = 35;
                                comments.waveData2 = 65;
                                break;
                            case '4px':
                                comments.waveData1 = 30;
                                comments.waveData2 = 70;
                                break;
                            case '5px':
                                comments.waveData1 = 25;
                                comments.waveData2 = 75;
                                break;   
                            default:
                                comments.waveData1 = 40;
                                comments.waveData2 = 60;        
                        }
                }
                if (result.note.type == 5) {
                    switch (comments.noteOpacity) {
                        case '0.1':
                            comments.noteOpacityIndex = 1;
                            break;
                        case '0.3':
                            comments.noteOpacityIndex = 2;
                            break;
                        case '0.5':
                            comments.noteOpacityIndex = 3;
                            break;
                        case '0.7':
                            comments.noteOpacityIndex = 4;
                            break; 
                        default:
                            comments.noteOpacityIndex = 1;        
                    }
                }
               
                // 线型
                    comments.lineType = 'solid';
                    comments.lineTypeIndex = 0;
            }
            if(result.note.type === 3){
                pdfModule.mutations.setNotePage(state,{type:result.note.type,pageNo:Number(result.pageNo)-1,noteId:result.note.id, location:result.note.location})
            }
            if(result.note.type === 4){
                pdfModule.mutations.setLinePage(state,{comments:comments,type:result.note.type, pageNo:Number(result.pageNo)-1,noteId:result.note.id, location:result.note.location})
            }
            if (result.note.type === 5) {
                pdfModule.mutations.setHighLight(state,{comments:comments,type:result.note.type, pageNo:Number(result.pageNo)-1,noteId:result.note.id, location:result.note.location})
            }
            if(result.note.type === 12){
                pdfModule.mutations.setPiPage(state,{type:result.note.type,pageNo:Number(result.pageNo)-1,noteId:result.note.id, location:result.note.location})
            }
             if(result.note.type !== 12){
            pdfModule.mutations.setNoteBox(state,{comments:comments, type:result.note.type,pageNo:Number(result.pageNo)-1,noteId:result.note.id,location:result.note.location})
            }
            state.noteList.unshift(result.note);
            layer.msg("添加成功",{skin:" layui-layer tip-green "});
        },
        zoomPageW(state,bool){
            // zoom: -1(缩小) 0(适应宽度) 1(放大) 2（适应高度）,3 进入全屏时将中间内容宽度记住防止变化，4推出全屏时用初始宽度计算
            if(bool.status===1 && state.zoom<=145){
                state.zoom += 5;
            }else if(bool.status===-1 && state.zoom >= 55){
                state.zoom -= 5;
            }else if(bool.status===0){
                state.zoom = 100;
            }else if(bool.status===2){
                state.zoom = 50;
            }else if(bool.status===3){
                state.beforeFullOriginalWidth = state.originalWidth;
            }else if(bool.status===4){
                state.originalWidth = state.beforeFullOriginalWidth;
                state.zoom = 100;
            }
            var totalW = document.body.clientWidth-60;
            state.curBoxStyle.width = (state.originalWidth * state.zoom)/100 +"px";
            state.curOverStyle.width = (state.originalWidth * state.zoom)/100 +"px";
            state.zoomPageStyle.width = (state.originalWidth * state.zoom)/100 +"px";
            if (bool.isFull) {
             var  curW = ((state.originalWidth * state.zoom)/100 - state.originalWidth)/2+10,
             maxW = totalW - (state.originalWidth * state.zoom)/100;
              if (curW<0 || maxW<100) {
                  return false;
              }
              
               store.state.centerStyle = {
                   right:(410-curW)+'px',
                   left:(280-curW)+'px'
               }
            }
        },
        resetPageArr(state,pageW){
            if(state.pageArr[0].flag === UNLOAD){  // 若已加载，则请求终止
                return false;
            }
            state.originalWidth = $("#read_scollbox").width();
            state.curWidth = pageW ;
            state.curScale =  state.oldImgW / state.curWidth;
            state.curHeight = state.oldImgH / state.curScale;
            state.curBoxStyle.height = state.curHeight + 'px';
            state.curOverStyle.height = (state.curHeight+12) * window.InitData.pageCount + "px";
            
            var scrollTop_cur = $("#read_mid_srollbar").scrollTop()*(pageW/state.initPageW);
            state.initPageW = pageW;
            $("#read_mid_srollbar").scrollTop(scrollTop_cur); 
            var linesArr = [],curArr = [];
            for(var k = 0;k<state.pageArr.length;k++) {
                // if( state.pageArr[k].flag === UNLOAD ){
                //     continue;
                // }
                state.pageArr[k].initBoxArr = [];
                for (var j = 0; j < state.pageArr[k].initLines.length; j++) {  //改变lines
                    linesArr = state.pageArr[k].initLines[j];
                    curArr =   state.pageArr[k].curLines[j];

                    let divObj = {};
                    curArr.left = linesArr.left / state.curScale;
                    curArr.right = linesArr.right / state.curScale;
                    curArr.top = linesArr.top / state.curScale;
                    curArr.bottom = linesArr.bottom / state.curScale;

                    divObj.left = linesArr.left / state.curScale  + "px";
                    divObj.top = linesArr.top / state.curScale + "px";
                    divObj.width = (linesArr.right - linesArr.left ) / state.curScale + "px";
                    divObj.height = (linesArr.bottom - linesArr.top) / state.curScale + "px";
                    state.pageArr[k].initBoxArr.push(divObj);

                    var textArr = linesArr.linePos.split(","),newTextArr = [];
                    for (var n in textArr) {
                        newTextArr.push(Number(textArr[n]) / Number(state.curScale));
                    }
                    curArr.linePos = newTextArr.join(",")
                }
                //改变笔记坐标
                state.pageArr[k].curNoteArr = [];
                for(var n = 0;n< state.pageArr[k].initNoteArr.length; n++){
                    var initNoteArr = state.pageArr[k].initNoteArr[n].style;
                    var initNoteObj = {};
                    initNoteObj.left = initNoteArr.left / state.curScale  + "px";
                    initNoteObj.top = initNoteArr.top / state.curScale + "px";
                    initNoteObj.height = initNoteArr.height / state.curScale + "px";
                    initNoteObj.width = initNoteArr.width / state.curScale + "px";
                    var changeObj = {style:initNoteObj,noteId:state.pageArr[k].initNoteArr[n].noteId,index:state.pageArr[k].initNoteArr[n].index,type:state.pageArr[k].initNoteArr[n].type}
                    state.pageArr[k].curNoteArr.push(changeObj);
                }

              

                // 改变笔记盒子坐标
                //debugger
                state.pageArr[k].curNoteBoxArr = [];
                for(var n = 0;n< state.pageArr[k].initNoteBoxArr.length; n++){
                    var initNoteBoxArr = state.pageArr[k].initNoteBoxArr[n].style;
                    var initBoxObj = {};
                    initBoxObj.left = initNoteBoxArr.left / state.curScale -6 + "px";
                    initBoxObj.top = initNoteBoxArr.top / state.curScale -6 + "px";
                    initBoxObj.height = initNoteBoxArr.height / state.curScale + 6 + "px";
                    initBoxObj.width = initNoteBoxArr.width / state.curScale + 4 + "px";
                    // debugger
                    var notePos = state.pageArr[k].initNoteBoxArr[n].type==3?58:114;
                    var curBoxSty = {
                        style:initBoxObj,
                        noteId:state.pageArr[k].initNoteBoxArr[n].noteId,
                        styleBtnGroup:{
                            left:((initNoteBoxArr.width / state.curScale)-notePos)/2 +'px',
                            top:-38+'px'
                        },
                        type:state.pageArr[k].initNoteBoxArr[n].type,
                        comments:state.pageArr[k].initNoteBoxArr[n].comments,
                        icoStyle:{
                            top:-14 + 'px',
                            left:((state.pageArr[k].initNoteBoxArr[n].icoStyle.left / state.curScale)-13) +'px'
                        }
                    }
                    state.pageArr[k].curNoteBoxArr.push(curBoxSty);
                }

                // 改变下划线坐标
                state.pageArr[k].curLineArr = [];
                for(var n = 0;n< state.pageArr[k].initLineArr.length; n++){
                    var initLineArr = state.pageArr[k].initLineArr[n].style;
                    var initLineObj = {};
                    initLineObj.left = initLineArr.left / state.curScale  + "px";
                    initLineObj.top = initLineArr.top / state.curScale + "px";
                    initLineObj.height = initLineArr.height / state.curScale + "px";
                    initLineObj.width = initLineArr.width / state.curScale + "px";
                    initLineObj['border-color'] = state.pageArr[k].initLineArr[n].style['border-color'];
                    initLineObj['border-bottom-width'] = state.pageArr[k].initLineArr[n].style['border-bottom-width'];
                    initLineObj.opacity = state.pageArr[k].initLineArr[n].style.opacity;
                    var curLineSty = {
                        style:initLineObj,
                        noteId:state.pageArr[k].initLineArr[n].noteId,
                        index:state.pageArr[k].initLineArr[n].index,
                        type:state.pageArr[k].initLineArr[n].type,
                        lineType:state.pageArr[k].initLineArr[n].lineType,
                        waveData1:state.pageArr[k].initLineArr[n].waveData1,
                        waveData2:state.pageArr[k].initLineArr[n].waveData2
                    }
                    // debugger
                    state.pageArr[k].curLineArr.push(curLineSty);
                }

                
                // 改变高亮坐标
                state.pageArr[k].curHighLightArr = [];
                for(var n = 0;n< state.pageArr[k].initHighLightArr.length; n++){
                    var initHighLightArr = state.pageArr[k].initHighLightArr[n].style;
                    var initLineObj = {};
                    initLineObj.left = initHighLightArr.left / state.curScale  + "px";
                    initLineObj.top = initHighLightArr.top / state.curScale + "px";
                    initLineObj.height = initHighLightArr.height / state.curScale + "px";
                    initLineObj.width = initHighLightArr.width / state.curScale + "px";
                    initLineObj.background = initHighLightArr.background;
                    initLineObj.opacity =  initHighLightArr.opacity;
                    
                    var curLineSty = {
                        style:initLineObj,
                        noteId:state.pageArr[k].initHighLightArr[n].noteId,
                        index:state.pageArr[k].initHighLightArr[n].index,
                        type:state.pageArr[k].initHighLightArr[n].type,
                    }
                    state.pageArr[k].curHighLightArr.push(curLineSty);
                }

                // 改变批注坐标
                state.pageArr[k].curPiArr = [];
                for(var n = 0;n< state.pageArr[k].initPiArr.length; n++){
                    var initPiArr = state.pageArr[k].initPiArr[n].style;
                    var initPiObj = {};
                    initPiObj.left = (initPiArr.left / state.curScale)  + "px";
                    initPiObj.top = (initPiArr.top / state.curScale) -5 + "px";
                    initPiObj.height = 0 + "px";
                    initPiObj.width = 0 + "px";
                    var curPiSty = {
                        style:initPiObj,
                        noteId:state.pageArr[k].initPiArr[n].noteId,
                        type:state.pageArr[k].initPiArr[n].type
                    }
                    state.pageArr[k].curPiArr.push(curPiSty);
                }
              // debugger;
            }
        },

        setPageArr(state, result) { // 设置当前页的参数
            var localDbCode = window.InitData.dbCode ||'local';
            state.pageArr[result.pageNo-1].imgSrc = window.InitData.ImageBasePath + localDbCode  + '/' + window.InitData.fileName + '/images/' + result.imgSrc;
            state.pageArr[result.pageNo-1].curLines = result.curLines;
            // state.pageArr[result.pageNo-1].initLines = result.curLines;
            //console.log("scaleSet:"+state.curScale);
        },
        setPageNo(state,pageNo){
            if( state.initPageNo>=1 && state.initPageNo<= window.InitData.pageCount){
                state.initPageNo  = pageNo;
            }else{
                alert("请输入合法页码");
            }
        },
        pageMinus(state){
            if( state.initPageNo>1){
                state.initPageNo --;
            }
        },
        pageAdd(state){
            if(state.initPageNo< window.InitData.pageCount){
                state.initPageNo ++;
            }
        },
        setLines(state,res){ // 计算每一行的坐标
            var oldArr = state.pageArr[res.pageNo-1].curLines;
            var newArr = [];
            var line= 0;

            for(var i = 0;i<oldArr.length;i++){  // 去掉字段为空的内容
                if(oldArr[i].lineText.length >0){
                    line++;
                    oldArr[i].line = line;
                    newArr.push(oldArr[i]);
                }
            }
            //debugger;
            state.pageArr[res.pageNo-1].initLines =  $.extend(true, [], newArr);  // 每行数据去空后的原始数据

            for(var j = 0;j<newArr.length;j++){
                let divObj={};
                newArr[j].left /= state.curScale;
                newArr[j].right /= state.curScale;
                newArr[j].top /= state.curScale;
                newArr[j].bottom /= state.curScale;

                divObj.left =  newArr[j].left+"px";
                divObj.top =  newArr[j].top+"px";
                divObj.width = newArr[j].right- newArr[j].left +"px";
                divObj.height =  newArr[j].bottom- newArr[j].top +"px";
                state.pageArr[res.pageNo-1].initBoxArr.push(divObj);

                var linesArr = newArr[j].linePos.split(","),newlinesArr = [];
                for (var n in linesArr) {
                    newlinesArr.push(Number(linesArr[n]) / Number(state.curScale));
                }
                newArr[j].linePos = newlinesArr.join(",")
            }
             //debugger;
            state.pageArr[res.pageNo-1].curLines = newArr;
        },
        initPageArr(state) {  //根据总页数初始化渲染页面
            for (var i = 1; i <= window.InitData.pageCount; i++) {
                var itemObj = {};
                itemObj.imgSrc = '';
                itemObj.pageNo = i;
                itemObj.initLines = "";
                itemObj.curLines = "";
                itemObj.flag = UNLOAD;
                itemObj.initBoxArr = [];  // 初始化渲染的div
                itemObj.curBoxArr = [];  //当前选择的div
                itemObj.initLineArr = []; // 原始划线信息
                itemObj.curLineArr = [];  // 当前scale下的划线信息
                itemObj.initNoteArr = []; // 原始笔记信息
                itemObj.curNoteArr = [];
                itemObj.initPiArr = []; // 原始批注信息
                itemObj.curPiArr = [];
                itemObj.initHighLightArr = []; // 原始高亮信息
                itemObj.curHighLightArr = [];
                itemObj.initNoteBoxArr = [];  // 文章笔记的包裹框
                itemObj.curNoteBoxArr = [];

                state.pageArr.push(itemObj);
            }
        },
    },
    actions: {
        setPageNoF(store,pageNo){
            store.commit('setPageNo',pageNo);
            store.dispatch("LoadPreNext",store.state.initPageNo);
        },
        prePage(store){
            store.commit('pageMinus');
            store.dispatch("LoadPreNext",store.state.initPageNo);
        },
        nextPage(store){
            store.commit('pageAdd');
            store.dispatch("LoadPreNext",store.state.initPageNo);
        },
        PageToZTreeNode(state,pageNo) {  // 当前页目录高亮
            var treeObj = $.fn.zTree.getZTreeObj('treeBox');
            var node = treeObj.getNodes();
            var nodes = treeObj.transformToArray(node);
            for (var i = 0, len = nodes.length; i < len; i++) {

                if ( parseInt(nodes[i].page) == pageNo ) {
                    var currentNode = nodes[i];
                    break
                }
                if ( parseInt(nodes[i].page)>pageNo) {
                    var currentNode = nodes[i - 1];
                    break
                }
            }
            treeObj.selectNode(currentNode, false);
        },
        // 请求当页图片及相关参数
        ImgLazyLoad({ state, commit },pageNo) {  // 请求当前页面
            if(state.pageArr[pageNo-1].flag !== UNLOAD){  // 若已加载，则请求终止
                 return false;
            }
            state.pageArr[pageNo-1].flag = LOADING;
            pdfApi.ImgLazyLoad({
                "hfsFileCode": window.InitData.HfsFileCode,
                "pageIndex": pageNo,
                "dbcode": window.InitData.dbCode,
                "dbname": window.InitData.dbName,
                "filename": window.InitData.fileName,
                "tasktype": window.InitData.tasktype
            }).then((data) => {
                state.pageArr[pageNo-1].flag = LOADED;
                var data = eval(data).chapter;

                if(pageNo==1){
                   state.oldImgW = data.pageWidth;
                   state.oldImgH = data.pageHeight;
                   state.curWidth = $("#read_scollbox").width();
                   state.originalWidth = state.curWidth * 0.9;

                   state.curScale = data.pageWidth/state.curWidth;
                   state.curHeight = data.pageHeight / state.curScale;
                   state.curBoxStyle.height = state.curHeight + 'px';
                   //console.log("scale:"+state.curScale);
                   state.curOverStyle.height = (state.curHeight+12) * window.InitData.pageCount + "px";

                   var paramTimer = setTimeout(function () {
                       commit('resetPageArr',state.curWidth);
                       clearTimeout(paramTimer);
                   },1000)

                }
                var resInfo = {};
                resInfo.imgSrc = data.imageName;
                resInfo.zuoBiao = data.zuoBiao;
                resInfo.curLines = data.lines;
                resInfo.pageNo =data.pageIndex;
                commit('setPageArr', resInfo);
                commit('setLines', resInfo);
            }).catch((err) => {
                state.pageArr[pageNo-1].flag = UNLOAD; // 若请求失败，将该页状态置为未请求状态
                // 提示信息
            }).finally(() => {
                state.loading = false;
            });
        },
        loadScrollPage(store,pageInfo){ // 滚动时加载上下页
            var pageNo = pageInfo.pageNo,t3 = pageInfo.time;
            //console.log(t3)
            if (t3<2) {
                return ;
            }
            for (var i = Number(pageNo) - 1; i <= Number(pageNo) + 1; i++) {
                if (i > 0 && i <= window.InitData.pageCount) {
                    store.dispatch("ImgLazyLoad",i);
                }
            }
        },
        LoadPreNext(store,pageNo) {  //加载指定页的上下页（若已加载则忽略）
            if (pageNo == undefined) {
                return false;
            }
            var scrollDis = $("#load-box"+pageNo)[0].offsetTop;
            store.state.initPageNo = pageNo;
            store.dispatch("loadScrollPage",{pageNo:store.state.initPageNo,time:6});
            $("#read_mid_srollbar").scrollTop(scrollDis);
        },
        pageScroll(store){ // 滚动加载
            clearTimeout(store.state.timer);
            // var t1 = new Date().getTime();
            var scrollDis = $("#read_mid_srollbar").scrollTop();
            var windowHeight = $("#read_mid_srollbar").height();  //窗口高度
            var curPage = Math.ceil((scrollDis + windowHeight) / (store.state.curHeight+12));
            if((curPage-1) === store.state.initPageNo){
               
                store.state.t2 = new Date().getTime()
                store.state.t3 = (store.state.t2 - store.state.t1)/1000;
                // console.log(store.state.t3)
            }
            if(curPage<=window.InitData.pageCount){
                store.state.initPageNo = curPage;
                store.state.t1 =  store.state.t2; 
            }
            store.dispatch("loadScrollPage",{pageNo:store.state.initPageNo,time:store.state.t3});
            store.dispatch("PageToZTreeNode",store.state.initPageNo); //目录高亮
            setTimeout(()=>{
                $("#read_mid_srollbar").focus();
            });
            store.state.timer = setTimeout(function () {
                // 无滚动事件触发，认为停止滚动了
                // ... 做你想做的事情，如回调处理
                //console.log('stoping：'+ store.state.initPageNo)
                store.dispatch("loadScrollPage",{pageNo:store.state.initPageNo,time:3});
            }, 100);
        },

    },
}

export default pdfModule
if(store.state.pdfData) store.unregisterModule('pdfData');
store.registerModule('pdfData', pdfModule);
