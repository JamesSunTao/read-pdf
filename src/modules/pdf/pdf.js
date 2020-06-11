//星星打分
if (window.InitData.IsLimited !== 1 && window.InitData.IsLimited !== null) {
        $("#starid" + window.InitData.StudyInfo.Grade).prop({ "checked": true });
    }

    //头部手机二维码
    $(".js-phone-erwei").click(function () {
        $(this).children(".erwei-pop").toggle();
        event.stopPropagation();
    });
    $(document.body).on("click", function (ev) {
        $('.erwei-pop').hide();
    })

    var ua = navigator.userAgent;
    // 打印
    $(".printPdf").click(function () {
        $('.watermark').empty();
        addClassToDom();
        var totalHeight = $("#read_midbox").height();
        var num = parseInt(totalHeight / 375)+20;
        var src = $(".CNKILogo").attr("src");
        var html = "<img  src="+src+" />";
        for (i = 0; i < num; i++) {
            $('.watermark').append(html);
        }

        window.print();

        if (/chrome/i.test(ua)) {
            $(".watermark").removeClass("watermark-1");
            $("body").removeClass("print-chrome");
            location.reload();
        } else if (/firefox/i.test(ua)) {
            $(".watermark").removeClass("watermark-1");
            $(".study-r .study-pr").css("height", 0);
            $(".branch-box").css("height", "auto");
            $("body").removeClass("print-wrap");
        } 
    })

    //在打印模式下给兼容Firefox
    function addClassToDom() {
        if (/firefox/i.test(ua)) {
            /*添加水印*/
            $(".watermark").addClass("watermark-1");
            $("body").addClass("print-wrap");
            /*设置水印高度*/
            var referencesHeight = $("#references").height();
            var contentHeight = $("#read_midbox").height();
            var rightWrapHeight = $(".r-hide").height();

            $(".study-r .study-pr").css("height", contentHeight);
            //$(".branch-box").css("height", referencesHeight);
            $(".watermark").css("height", contentHeight + rightWrapHeight);
        } else if (/chrome/i.test(ua)) {
            /*添加水印*/
            $(".watermark").addClass("watermark-1");
            $("body").addClass("print-chrome");
        } else if (/msie/i.test(ua)) {
            
        } else if ("ActiveXObject" in window) {
            console.log("IE11");
        }
    }

    //笔记汇编  
    var  typeIndex = 1,typeFlag = 0,ItemUrl="";
    $(".assembly-pop").click(function(event){
        event.stopPropagation();
    })

    var assType3 = false;
    $("#noteAssembly").click(function () {
        //debugger
        typeIndex = 1;
        $(".ass-t").removeClass("cur").eq(0).addClass("cur");
        $("#addGoSuject").hide();
        $("#topsigns").hide();
        $(".assembly-pop").toggle();
        assType3 = !assType3;
        if (assType3) {
            haveDoc();
        }
    })

    function haveDoc() {
        $("#assembly3 ul li").remove();
        $.ajax({
            url: window.InitData.ApplicationPath + '/LitNotes/GetAssemblyList',
            type: 'POST',
            data: {
                "fileCode": window.InitData.fileName,
                "dbCode": window.InitData.dbCode,
                "pageIndex": 1,
                "pageSize": 100
            },
            dataType: 'json',
            async: true
        }).done(function (res) {
            if (res.Code === 200) {
                var liArr = res.Data.result;
                var liUrl = "";
                if (liArr.length  <= 0) {
                    $(".assembly-box").addClass("assembly-two");
                    $(".hasNoAssembly").show();
                    return false;
                }
                $(".hasNoAssembly").hide();
                for (var j = 1; j <= liArr.length; j++) {
                    liUrl = window.InitData.XmlEditorUrl + '/PersonalBook/Index/';
                    liUrl += liArr[j - 1].Id;
                    var liDom = '<li class="ass-li">' +
                                    '<input name="subtd" type="radio"><u class="ass-radio"></u>' +
                                    '<p class= ' + liUrl + '>' + ' ' + liArr[j - 1].Title + '</p>' +
                                '</li>';
                    $("#assembly3 ul").append(liDom);
                }
            }
            else {                
                layer.msg($.i18n('RequestMiss'),{skin:" layui-layer tip-red "});
            }

        });
    }

    $(".cancelbian").click(function(){  //取消
        $(".assembly-pop").hide();
    })
    $(".savebian").click(function () {  //确定
        if (typeIndex < 2) {
            noteAssemblyFun(typeIndex);
        } else {
            if (ItemUrl != "") {                
                window.open(ItemUrl);
            } else {
                layer.msg($.i18n('PleaseChooseHB'),{skin:" layui-layer tip-orange "});
            }
        }    
    })


    $(".ass-ul").on("click",".ass-li input",function () {
        var liIndex = $(this).parents("li").index();
        ItemUrl = $(this).siblings("p").attr("class");
    })
   

    $(".ass-t").click(function(){
        $(".ass-t").removeClass("cur");
        $(this).addClass("cur");
        typeIndex =  $(this).parents(".assembly").index()+1;    
    })


    function noteAssemblyFun(type) {           
        if (window.rightPanel.mynotes.length === 0) {
            layer.msg($.i18n('SureChooseHB'),{skin:" layui-layer tip-orange "});
            return false;
        }
        var myload = layer.load(2);
        var myWin = window.open(window.InitData.ApplicationPath + "article/Compiling");      
        $.ajax({
            url: window.InitData.ApplicationPath + 'LitNotes/AssemblyCoorperateNew',
            type: 'POST',
            data: {
                "topic": window.InitData.Topic,
                "literatureId": window.InitData.FileSourceType === '1' ? window.InitData.Lid : window.InitData.fileName,
                "type": type,
                "sourceTitle": $("#study-ht").html(), 
                "appId": window.InitData.AppId, 
                "fileName":window.InitData.fileName, 
                "tableName":window.InitData.tableName, 
                "dbCode":window.InitData.dbCode,
                "fsType":window.InitData.FileSourceType,
                "taskId":window.InitData.TaskId || -1, 
                "isXml":0
            },
            dataType: 'json',
            async: true
        }).done(function (json) {
            if (json.Code === 200) {
                myWin.location.href = window.InitData.XmlEditorUrl
                   + '/PersonalBook/Index/' + json.Data.Id;
            }
            else {
                if (json.Data.Type === 2) {
                    layer.msg($.i18n('EmptyHB'),{skin:" layui-layer tip-orange "});
                    layer.close(myload);
                    return;
                }
                else
                    layer.msg($.i18n('FailedHB'),{skin:" layui-layer tip-red "});
                myWin.close();
            }
            layer.close(myload);
        });

    }


// 部分功能限制
    if (window.InitData.IsLimited == 1) {
        $("#noteAssembly").hide(); // 笔记汇编
        $(".star-group").hide();  // 打分
        $("#wenSave").hide();   // 收藏
        $("#compare").hide();  //对比阅读
        $("#toolsearch").hide(); //工具书
        $(".js-showCNkiNode").hide(); //知网节
        $("#PaperRead .return").hide();
    }
 
//打卡功能   网页当前状态判断，若不处于当前窗口则不发请求
    var interval_output = null;
    function sendRequst() {
        interval_output = setInterval(function () {
            SetClock();
        }, 180000);
    }
   
    // if (window.InitData.Act != "refer" || window.InitData.Act !=  "compare") {
    //     sendRequst();
    // }


    var hiddenProperty = 'hidden' in document ? 'hidden' :
       'webkitHidden' in document ? 'webkitHidden' :
       'mozHidden' in document ? 'mozHidden' :
       'msHidden ' in document ? 'msHidden ' :
       null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function () {
        if (!document[hiddenProperty]) {        
            if (window.InitData.Act != "refer" || window.InitData.Act != "compare") {
                //只有在原文状态下才会触发打卡
                sendRequst();
            }
        } else {
            //console.log('页面非激活');
            clearInterval(interval_output);
        }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);

    // 打卡 通篇文献阅读十分钟以上打卡成功

    $(".vote-x").click(function () {
        $("#clockIframeDiv").hide();
    })

    function SetClock() {
        var token = getCookie("AID") || getCookie("LID");
        $.ajax({
            url: window.InitData.ClockUrl,
            type: 'get',
            headers: { "token": token },
            data: {
            },
            dataType: "json",
            success: function (data) {
            
            }
        })
    }


// 设置cookie
function setCookie(name, value) {  
    var curDate = new Date();
    //当前时间戳  
    var curTamp = curDate.getTime();
    //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态  
    var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
    //当日已经过去的时间（毫秒）  
    var passedTamp = curTamp - curWeeHours;
    //当日剩余时间  
    var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
    var leftTime = new Date();
    leftTime.setTime(leftTamp + curTamp);
    document.cookie = name + "=" + escape(value) + ";expires=" + leftTime.toGMTString();
}

//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 取出cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


//加载笔记
function SetNote(notes, ratio) {
    $("#noteShow").empty();
    var html = '';
    var chapterList = JSON.parse(sessionStorage.getItem(window.InitData.HfsFileCode));
    for (var i in notes) {
        var index = Number(notes[i].SectionId.replace("load-box", ""));
        var nowW = $("#Img" + index).width();
        var PdfWidth = 0;
        //for (var c in chapterList) {
        //    if (chapterList[c].PageIndex === index) {
        //        PdfWidth = chapterList[c].PageWidth;
        //    }
        //}
        if (sessionStorage.getItem(window.fileRealName + index)) {
            PdfWidth = Number(sessionStorage.getItem(window.fileRealName + index));
        }
        var r = Number(PdfWidth / nowW).toFixed(8);
        html = '';
        var a = "'" + notes[i].Id + "'";
        var sign = '<div class="mark-box-l">';
        if (notes[i].NoteExts && notes[i].NoteExts.length > 0) {
            sign += '<i id="litMarkBtn" class="i i4 bfc-l mt4 cg9"></i><div class="ovhide">';
            for (var q in notes[i].NoteExts) {
                sign += '<span class="mark-sm">' + notes[i].NoteExts[q].SignName + '</span>';
            }
            sign += '</div>';
        }
        sign += '</div>';
        if (ratio) {
            //html = '<div class="notes-p" onclick="SetPdfNoteShow(' + a + ')" data-id="' + notes[i].Id + '" data-page="' + notes[i].SectionId + '"> <div class="notes-t clearfix"><div class="notes-name"><img src="' + notes[i].HeadImg + '" alt="" class="head-pic">' + notes[i].RealName + '</div><div class="notes-time">' + notes[i].CreateTime +
            //    '</div></div>' + notes[i].Content + '<div class="clearfix mt5"><div class="mark-box-l">' + sign + '</div><div class="tr"><a href="javascript:void(0)" class="ml10 i-edit" title="编辑" data-id="' + notes[i].Id +
            //    '"  data-content="' + notes[i].Content + '" ><i class="i i6"></i></a><a href="javascript:void(0)" class="ml10 i-del" title="删除" data-id="' + notes[i].Id +
            //    '" ><i class="i i7"></i></a></div></div></div>';
            html += '<div class="notes-p"  onclick="SetPdfNoteShow(' + a + ')" data-id="' + notes[i].Id + '" data-page="' + notes[i].SectionId + '"><div class="bfc-l"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-note_note"></use></svg></div>' +
    '<div class="ovhide"><div class="cg5">' + notes[i].Content + '</div><span class="a-n-word">原文:<span>' + notes[i].Quote + '</span></span><div class="clearfix posr">' +
sign + '<span class="f2c9 fr">' + notes[i].CreateTime + '</span><div class="ico-box-r"><a href="javascript:void(0)" title="编辑" class="i-edit" data-id="' + notes[i].Id +
                '"  data-content=""><svg class="icon" aria-hidden="true"><use xlink:href="#icon-edtor"></use></svg></a><a href="javascript:void(0)" title="删除" class="i-del"  data-id="' + notes[i].Id + '" ><svg class="icon" aria-hidden="true"><use xlink:href="#icon-del1"></use></svg></a></div></div></div></div>'
        }
        else {
            if (window.curUserId === notes[i].AuthorId) {
                //html = '<div class="notes-p" onclick="SetPdfNoteShow(' + a + ')" data-id="' + notes[i].Id + '" data-page="' + notes[i].SectionId + '"> <div class="notes-t clearfix"><div class="notes-name"><img src="' + notes[i].HeadImg + '" alt="" class="head-pic">' + notes[i].RealName + '</div><div class="notes-time">' + notes[i].CreateTime +
                //'</div></div>' + notes[i].Content + '<div class="clearfix mt5"><div class="mark-box-l">' + sign + '</div><div class="tr"><a href="javascript:void(0)" class="ml10 i-edit" title="编辑" data-id="' + notes[i].Id +
                //'"  data-content="' + notes[i].Content + '" ><i class="i i6"></i></a><a href="javascript:void(0)" class="ml10 i-del" title="删除" data-id="' + notes[i].Id +
                //'" ><i class="i i7"></i></a></div></div></div>';
                html += '<div class="notes-p"  onclick="SetPdfNoteShow(' + a + ')" data-id="' + notes[i].Id + '" data-page="' + notes[i].SectionId + '"><div class="bfc-l"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-note_note"></use></svg></div>' +
                '<div class="ovhide"><div class="cg5">' + notes[i].Content + '</div><span class="a-n-word">原文:<span>' + notes[i].Quote + '</span></span><div class="clearfix posr">' +
                sign + '<span class="f2c9 fr">' + notes[i].CreateTime + '</span><div class="ico-box-r"><a href="javascript:void(0)" title="编辑" class="i-edit" data-id="' + notes[i].Id +
                '"  data-content=""><svg class="icon" aria-hidden="true"><use xlink:href="#icon-edtor"></use></svg></a><a href="javascript:void(0)" title="删除" class="i-del"  data-id="' + notes[i].Id + '" ><svg class="icon" aria-hidden="true"><use xlink:href="#icon-del1"></use></svg></a></div></div></div></div>'
            }
            else {
                html = '<div class="notes-p"  onclick="SetPdfNoteShow(' + a + ')"  data-id="' + notes[i].Id + '" data-page="' + notes[i].SectionId + '"> <div class="notes-t clearfix"><div class="notes-name"><img src="' + notes[i].HeadImg + '" alt="" class="head-pic">' + notes[i].RealName + '</div><div class="notes-time">' + notes[i].CreateTime +
                              '</div></div>' + notes[i].Content + '<div class="clearfix mt5"><div class="mark-box-l">' + sign + '</div></div>';
            }
        }
        SetDivShow(notes[i].Location, ratio, notes[i].Id, r);
        $(html).appendTo($("#noteShow"));
    }
    //if (!$(".notes-hide").hasClass("mCustomScrollbar _mCS_2")) {
    //    //滚动条
    //    $(".notes-hide,.r-hide").mCustomScrollbar({
    //        autoDraggerLength: true,
    //        scrollInertia: 150,
    //        //advanced: {
    //        //    //自动根据动态变换的内容调整滚动条的大小
    //        //    updateOnContentResize: true
    //        //}
    //    });
    //}
    //else {
    //    $(".notes-hide").mCustomScrollbar("update");
    //}
}


function addDivStyle(notes) {
    var index = Number(notes.SectionId.replace("load-box", ""));
    var nowW = $("#Img" + index).width();
    var PdfWidth = 0;
    var chapterList = JSON.parse(sessionStorage.getItem(window.HfsFileCode + "note"));
    if (sessionStorage.getItem(window.fileRealName + index)) {
        PdfWidth = Number(sessionStorage.getItem(window.fileRealName + index));
    }
    var r = Number(PdfWidth / nowW).toFixed(8);
    
    SetDivShow(notes.Location, false, notes.Id, r);
    
}
//设置笔记div的显示
function SetDivShow(style, ratio, id, scale) {
    var array = [];
    if (style.indexOf("_") > 0) {
        array = style.split("_");
    }
    else {
        array[0] = style;
    }

    var arrstyle = [];
    for (var a in array) {
        arrstyle = [];
        arrstyle = array[a].split("#");
        var div = document.createElement("div");
        if (ratio) {
            div.className = "notebox " + id;
        } else {
            div.className = "noteall " + id;
        }
        div.style = arrstyle[1];
        if (div.style.left != "") {
            div.style.left = Number(div.style.left.replace("px", "")) / scale + "px";
        }
        if (div.style.right != "") {
            div.style.right = Number(div.style.right.replace("px", "")) / scale + "px";
        }
        div.style.top = Number(div.style.top.replace("px", "")) / scale + "px";
        div.style.height = Number(div.style.height.replace("px", "")) / scale + "px";
        div.style.width = Number(div.style.width.replace("px", "")) / scale + "px";
        //var html = '<div style="' + arrstyle[1] + '" class="notebox '+id+'"></div>';
        $("#" + arrstyle[0]).append(div);
        //var styleObj = arrstyle[1].split(";");
        ////if (div.style.left != "") {
        //div.style.left = Number(styleObj[0].replace("left:", "").replace("px", "")) / scale + "px";
        ////}
        ////if (div.style.right != "") {
        ////    div.style.right = Number(styleObj[1].replace("right:", "").replace("px", "")) / scale + "px";
        ////}
        //div.style.top = Number(styleObj[2].replace("top:", "").replace("px", "")) / scale + "px";
        //div.style.height = Number(styleObj[3].replace("height:", "").replace("px", "")) / scale + "px";
        //div.style.width = Number(styleObj[4].replace("width:", "").replace("px", "")) / scale + "px";
        ////var html = '<div style="' + arrstyle[1] + '" class="notebox '+id+'"></div>';
        //$("#" + arrstyle[0]).append(div);
    }
    //InitNoteBox(ratio);
}


//根据字段location解析出各个参数 （pageNo 当前页）
function getPosInfo(localtion) {
    var pos_index = localtion.split("#")[0].replace("load-box", ""),
    pos = localtion.split("#")[1].split(";"),
    pos_left = pos[0].split(":")[1],
    pos_right = pos[1].split(":")[1],
    pos_top = pos[2].split(":")[1],
    pos_height = pos[3].split(":")[1],
    pos_width = pos[4].split(":")[1];
    var posObj = { "pageNo": pos_index, "left": pos_left, "right": pos_right, "top": pos_top, "height": pos_height, "width": pos_width };
    
    return posObj;
}

//根据方法缩小的比例对文字位置进行放大缩小操作
function ChangeCoord(scale, index) {
    //debugger;
    //$(".coord").each(function () {
    var value = $("#hidPos" + index).val();
    var array1 = value.split("$");
    var arrayNew = [];
    for (var i in array1) {
        var array2 = array1[i].split("|");
        var array3 = [];
        for (var a in array2) {
            var array4 = array2[a].split(",");
            var array5 = [];
            for (var n in array4) {
                var a = Number(array4[n]) * Number(scale);
                array5.push(a.toFixed(2));
            }
            array3.push(array5.join(","));
        }
        arrayNew.push(array3.join("|"));
    }
    $("#hidPos" + index).val(arrayNew.join("$"));
    $("#loading-icon").css({ "left": $("#read_mid_srollbar").offset().left + ($("#read_mid_srollbar").width() / 2) - 16 + "px", "top": $("#read_mid_srollbar").offset().top + ($("#read_mid_srollbar").height() / 2) - 16 + "px", right: "", bottom: "" });
    $("#loading-icon").hide();

    //});
}

//根据图片放大缩小比例对笔记div进行放大缩小
function ChangeNoteBox(scale) {
    $(".notebox").each(function () {
        if ($(this).css("left") != "NAN" && $(this).css("left") != "") {
            $(this).css("left", Number($(this).css("left").replace("px", "")) * scale);
        }
        if ($(this).css("right") != "NAN" && $(this).css("right") != "") {
            $(this).css("right", Number($(this).css("right").replace("px", "")) * scale);
        }
        if ($(this).css("top") != "NAN" && $(this).css("top") != "") {
            $(this).css("top", Number($(this).css("top").replace("px", "")) * scale);
        }
        if ($(this).css("height") != "NAN" && $(this).css("height") != "") {
            $(this).css("height", Number($(this).css("height").replace("px", "")) * scale);
        }
        if ($(this).css("width") != "NAN" && $(this).css("width") != "") {
            $(this).css("width", Number($(this).css("width").replace("px", "")) * scale);
        }
    });

    $(".under_Line").each(function () {  // 划线位置的变化
        if ($(this).css("left") != "NAN" && $(this).css("left") != "") {
            $(this).css("left", Number($(this).css("left").replace("px", "")) * scale);
        }
        if ($(this).css("right") != "NAN" && $(this).css("right") != "") {
            $(this).css("right", Number($(this).css("right").replace("px", "")) * scale);
        }
        if ($(this).css("top") != "NAN" && $(this).css("top") != "") {
            $(this).css("top", Number($(this).css("top").replace("px", "")) * scale);
        }
        if ($(this).css("height") != "NAN" && $(this).css("height") != "") {
            $(this).css("height", Number($(this).css("height").replace("px", "")) * scale);
        }
        if ($(this).css("width") != "NAN" && $(this).css("width") != "") {
            $(this).css("width", Number($(this).css("width").replace("px", "")) * scale);
        }
    });

    if ($("#divMouseRight")) {
        var divTop = $("#divMouseRight").css('top').replace("px", "") * scale+"px",
            divLeft = $("#divMouseRight").css('left').replace("px", "") * scale+"px";
        $("#divMouseRight").css({ "top": divTop, "left": divLeft });
    }

    if ($(".bdsharebuttonbox ")) {
        var divTop = $(".bdsharebuttonbox ").css('top').replace("px", "") * scale + "px",
            divLeft = $(".bdsharebuttonbox").css('left').replace("px", "") * scale + "px";
        $(".bdsharebuttonbox").css({ "top": divTop, "left": divLeft });
    }


    $(".noteall").each(function () {
        if ($(this).css("left") != "NAN" && $(this).css("left") != "") {
            $(this).css("left", Number($(this).css("left").replace("px", "")) * scale);
        }
        if ($(this).css("right") != "NAN" && $(this).css("right") != "") {
            $(this).css("right", Number($(this).css("right").replace("px", "")) * scale);
        }
        if ($(this).css("top") != "NAN" && $(this).css("top") != "") {
            $(this).css("top", Number($(this).css("top").replace("px", "")) * scale);
        }
        if ($(this).css("height") != "NAN" && $(this).css("height") != "") {
            $(this).css("height", Number($(this).css("height").replace("px", "")) * scale);
        }
        if ($(this).css("width") != "NAN" && $(this).css("width") != "") {
            $(this).css("width", Number($(this).css("width").replace("px", "")) * scale);
        }
    });

   
}



function ChangeDateFormat(cellval) {
    var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

//复制选中文字
function CopyTextaaa(pos, na, index, ispdf) {

    var iWidth = parseInt($("#Img" + index).width());
    var iHeight = parseInt($("#Img" + index).height());
    var sbText = '';

    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: window.InitData.ApplicationPath + "File/PdfCopy",
        data: { "hfsFileCode": window.HfsFileCode, "pageIndex": index, "dbcode": window.InitData.dbCode, "tablename": window.InitData.tableName, "filename": window.InitData.fileName, "divPos": pos, "imgWidth": iWidth, "imgHeight": iHeight, "ispdf": ispdf },
        success: function (res) {
            sbText = JSON.parse(res).Data ? $.trim(JSON.parse(res).Data.text) : '';
        },
        error: function (data) {
            if (data.responseText.indexOf("login") > 0) {
                window.location.href = data.responseText;
            }
            else {
                
                layer.msg($.i18n('getDataFail'),{skin:" layui-layer tip-red"});
            }
        }
    });
  
    return sbText;
}

//根据笔记存储时的比例对笔记div进行放大缩小
//function InitNoteBox(scale) {
//    $(".notebox").each(function () {
//        if ($(this).css("left") != "NAN" && $(this).css("left") != "") {
//            $(this).css("left", Number($(this).css("left").replace("px", "")) / scale);
//        }
//        if ($(this).css("right") != "NAN" && $(this).css("right") != "") {
//            $(this).css("right", Number($(this).css("right").replace("px", "")) / scale);
//        }
//        if ($(this).css("top") != "NAN" && $(this).css("top") != "") {
//            $(this).css("top", Number($(this).css("top").replace("px", "")) / scale);
//        }
//        if ($(this).css("height") != "NAN" && $(this).css("height") != "") {
//            $(this).css("height", Number($(this).css("height").replace("px", "")) / scale);
//        }
//        if ($(this).css("width") != "NAN" && $(this).css("width") != "") {
//            $(this).css("width", Number($(this).css("width").replace("px", "")) / scale);
//        }
//    });
//}

function getCurDate(joinStr) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();

    if (month > 0 && month < 10) {
        month = '0' + month;
    }
    return year + joinStr + month + joinStr + day;
}
var sourceSys = (window.InitData.GroupId === undefined || window.InitData.GroupId.length === 0) ? "psmc" : "sns";  //本地上传文件来源系统
var param = {
    fileCode: window.InitData.fileName,
    lid: window.InitData.Lid,
    tableName: window.InitData.tableName,
    dbCode: window.InitData.dbCode, 
    fileName: window.InitData.fileName,
    taskId: window.InitData.TaskId,
    from: window.InitData.From, 
    fsType: window.InitData.FileSourceType,
    type: sourceSys
};

// $.ajax({
//     url: window.InitData.ApplicationPath + "File/GetPdfTiluInfo",
//     type: "post",
//     dataType:'json',
//     data: {       
//         tableName: window.InitData.tableName,
//         dbCode: window.InitData.dbCode, 
//         fileName: window.InitData.fileName,               
//         fsType: window.InitData.FileSourceType    
//     },
//     success: function (json) {
        
//         json = json.Data.tilu;
       
//         if (!!json) {
//             $('#study-ht').html(json.Title);
//             $('#study-ht').attr('title', json.Title);
//             document.title = json.Title;
//             if (window.InitData.FileSourceType === '2') {  //上传
//                 if (json.Type == 4 || json.Type == 6) {
//                     $("#read_mid_srollbar").addClass("ppt-box");
//                 }
//                 $(".js-originalText>div.js-prefix").hide();
//                 $(".js-refer").hide();
//                 paperReadModel.Content = json.Content;
//                 window.paperTitle = json.Title;
//                 document.title = json.Title;
//                 paperReadModel.paperTitle = json.Title;
//                 $('.study-ht')[0].innerText = json.Title;
//                 paperReadModel.initCommon(json.catalogInfos);
//             }
//             else   //kns
//             {
              
//                 var tilu = ''; var myType = "";
//                 switch (window.InitData.DcType) {
//                     case "1":   //期刊                                      
//                         var hrefTilu = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=' + window.InitData.dbCode + '&pykm=' + (json.PinyinName ? json.PinyinName:'');
//                         myType = '期刊';
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.Year ? (',' + json.Year) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                 tilu += json.Issue ? (',' + json.Issue) : '';
//                                // tilu += json.Page ? (',' + json.Page) : '';
//                                // tilu += json.Doi ? (',' + json.Doi) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Creator;
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                     case "2":    //会议
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 var hrefTilu = 'http://navi.cnki.net/KNavi/DPaperDetail?pcode='+ window.InitData.dbCode  +'&lwjcode=ASSC201801001'+ '&hycode=' + json.Code;
//                                 myType = '会议';
                                
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.PubDate ? (',' + json.PubDate):'';
//                                 //tilu += json.YEAR ? (',' + json.YEAR) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                 //tilu += json.Issue ? (',' + json.Issue) : '';
//                                 //tilu += json.Page ? (',' + json.Page) : '';
//                                 //tilu += json.Doi ? (',' + json.Doi) : '';
//                                 // var page = '';
//                                 // if (json.JournalPage) {
//                                 //     if (json.JournalPage.indexOf("-") > -1) {
//                                 //         var array = json.JournalPage.split('-');
//                                 //         if (array.length > 2) {
//                                 //             page = array[0] + '-' + array[array.length - 1];
//                                 //         }
//                                 //         else if (array.length == 2) {
//                                 //             page = array[0] + '-' + array[1];
//                                 //         }
//                                 //         else {
//                                 //             page = json.JournalPage;
//                                 //         }
//                                 //     }
//                                 //     else {
//                                 //         page = json.JournalPage;
//                                 //     }
//                                 // }
//                                 //tilu += page ? (',' + page) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Author;
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                     case "5":  //kns图书 
//                         var hrefTilu = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=' + window.InitData.dbCode + '&pykm=' + window.InitData.fileName.substring(0, 4);
//                         myType = '图书';
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.Year ? (',' + json.Year) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                 tilu += json.Issue ? (',' + json.Issue) : '';
//                                 tilu += json.Page ? (',' + json.Page) : '';
//                                 tilu += json.Doi ? (',' + json.Doi) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Author;
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                     case "4":   //博硕
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 var hrefTilu = 'http://navi.cnki.net/KNavi/PPaperDetail?pcode='+ window.InitData.dbCode+'&logo=' + json.InstitutionPYCode;
//                                 myType = json.ResourceType + '论文';
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.Year ? (',' + json.Year) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                 //tilu += json.Issue ? (',' + json.Issue) : '';
//                                 //tilu += json.Page ? (',' + json.Page) : '';
//                                 //tilu += json.Doi ? (',' + json.Doi) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Creator;

//                                 var div = '<div class="Education-box"><dl class="idl-sm"><dt class="idt">单位代码</dt><dd class="idd" id="DegreeGrantedInstitutionCode">'
//                                 + json.DegreeGrantedInstitutionCode + '</dd></dl><dl class="idl-sm"><dt class="idt">分类号</dt><dd class="idd" id="ClcCode">'
//                                 + json.ClcCode + '</dd></dl></div><div class="Education-company"><h2>'
//                                 + json.Source + '</h2><h2><span class="cr" id="PaperLevel">'
//                                 + json.PaperLevel + '</span>学位论文</h2></div><div class="Education-title"><dl class="idl-bg"><dt class="idt">论文题目</dt><dd class="idd" id="Dis_Title">'
//                                 + json.Title + '</dd></dl></div><dl class="idl"><dt class="idt">学科专业</dt><dd class="idd" id="ProfessionalName">'
//                                 + json.ProfessionalName + '</dd></dl><dl class="idl"><dt class="idt">申请人</dt><dd class="idd" id="Creator">'
//                                 + json.Creator + '</dd></dl><dl class="idl"><dt class="idt">指导教师</dt><dd class="idd" id="Tutor">'
//                                 + json.Tutor + '</dd></dl><dl class="idl"><dt class="idt">论文提交时间</dt><dd class="idd" id="PaperSubmitDate">'
//                                 + json.PaperSubmitDate + '</dd></dl>';
//                                 $("#bookCover").html(div);
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                     case "3":    //报纸
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 var hrefTilu = 'http://navi.cnki.net/KNavi/NPaperDetail?pcode='+ window.InitData.dbCode+'&bzpym=' + json.NewspaperTitle_PY;
//                                 myType = '报纸';
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.Date ? (',' + json.Date) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                // tilu += json.VersionNo ? (',(' + json.VersionNo + ')') : '';
//                                // tilu += json.Column ? (',' + json.Column) : '';
//                                 //tilu += json.Doi ? (',' + json.Doi) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Author;
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                         case "6": //年鉴
//                            if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                                if (json) {
//                                     var hrefTilu = 'http://navi.cnki.net/KNavi/YearbookDetail?pcode='+ window.InitData.dbCode+'&pykm=' + (json.PinyinName ? json.PinyinName:'')+'&bh=';
//                                     myType = '年鉴';
//                                    //tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                    tilu += json.Year ? (',' + json.Year) : '';
//                                    tilu += json.AlmanacName ? (','+ json.AlmanacName) : '';
//                                    //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                    //tilu += json.Issue ? (',' + json.Issue) : '';
//                                   // tilu += json.Page ? (',' + json.Page) : '';
//                                   // tilu += json.Doi ? (',' + json.Doi) : '';
//                                    tilu += '</span></span>';
//                                }
//                            }
//                            if ($('.study-ht').length > 0) {
//                                //$('.study-ht')[0].innerHTML = json.Title;
//                                //$('.study-ht').attr('title', json.Title);
//                                $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                            }
//                            //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                            //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                            //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                            //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                            //}
//                            break;
//                         case "11"://视频
//                             if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1){
//                                 if(json){
//                                     myType ='视频';
//                                     tilu += '</span></span>';
//                                 }
//                             }
//                             break;
//                         case "10"://音频
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1){
//                             if(json){
//                                 myType = '音频';
//                                 tilu += '</span></span>';  
//                             }
//                         }
//                     default:
//                         var hrefTilu = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=' + window.InitData.dbCode + '&pykm=' + window.InitData.fileName.substring(0, 4);
//                         myType = '期刊';
//                         if (window.location.href.toLowerCase().indexOf('pdfreadonline2') === -1) {
//                             if (json) {
//                                 tilu = '<span class="study-ht-sm"><b>（' + myType + '）</b><a href="' + hrefTilu + '" target="_blank" title="' + json.Source + '">' + json.Source + '</a>' + '<span class="vm">';
//                                 tilu += json.Year ? (',' + json.Year) : '';
//                                 //tilu += json.TiluInfo.Juan ? (',' + json.TiluInfo.Juan) : '';  //卷不用展示，不同类型文献格式不同
//                                 tilu += json.Issue ? (',' + json.Issue) : '';
//                                 tilu += json.Page ? (',' + json.Page) : '';
//                                 tilu += json.Doi ? (',' + json.Doi) : '';
//                                 tilu += '</span></span>';
//                                 window.InitData.SourceTitle = json.Source;
//                                 window.InitData.AuthorNames = json.Creator;
//                             }
//                         }
//                         if ($('.study-ht').length > 0) {
//                             //$('.study-ht')[0].innerHTML = json.Title;
//                             //$('.study-ht').attr('title', json.Title);
//                             $('.study-ht')[0].insertAdjacentHTML('afterend', tilu);
//                         }
//                         //else if ($('.js-poptitle').length > 0 && pageType === 'pop') {
//                         //    //$('.js-poptitle .references-ht .a-hide')[0].innerHTML = json.Title;
//                         //    //$('.js-poptitle .references-ht .a-hide').attr('title', json.Title);
//                         //    $('.js-poptitle .references-ht .a-hide')[0].insertAdjacentHTML('afterend', tilu);
//                         //}
//                         break;
//                 }

//             }
//         }

//     }

// })


