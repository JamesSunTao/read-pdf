function positionPop() {
    $("body", parent.document).find('#okms_top').children(".okms-top").toggleClass("z-10"); //解决top被遮挡问题
}
; (function (window, UE) {
    window.commonJS = function (options) {
        options = options || {};
    };
    //数据中心
    window.SIGNNOTES = [];
    window.LITSIGNS = [];
    window.LitSIGNNAEMS = [];



    //把编辑器img标签的src属性改为绝对路径
    UE.plugin.register("processImage", function () {
        var e = this;

        function inputRule(root) {
            UE.utils.each(root.getNodesByTagName('img'), function (node) {
                node.attrs.src = (node.attrs.src || '').replace(location.origin, '');
            });
        }

        function outputRule(root) {
            UE.utils.each(root.getNodesByTagName('img'), function (node) {
                var src = node.attrs.src.replace(location.origin, '');
                if(!/http:/.test(src)) {
                    node.attrs.src = location.origin + src;
                    node.attrs._src = location.origin + src;
                }
            });
        }

        e.addInputRule(inputRule);
        e.addOutputRule(outputRule);

    });




    debugger;
    var ue = UE.getEditor('editor', {
    	toolbars: [['bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'link', 'attachment', 'simpleupload']],
        wordCount: false,
        autoHeightEnabled: false,
        enableContextMenu: false,
        enableAutoSave: false,
        elementPathEnabled: false,
        initialFrameHeight: 260
    });
    var uePara = UE.getEditor('paraEditor', {
    	toolbars: [['bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'link', 'attachment', 'simpleupload']],
        wordCount: false,
        autoHeightEnabled: false,
        enableContextMenu: false,
        enableAutoSave: false,
        elementPathEnabled: false,
        initialFrameHeight: 420
    });
    discussEvent.listen('setParaContent', function (data) {
        uePara.execCommand('inserthtml', data.content);
        //uePara.setContent(data.content, true);
    });
    commonJS.ApplicationPath = ((window.ApplicationPath || "") + '/').replace(/\/\/$/, '/');
    commonJS.GetAsyncData = function (param, path) {
        param = param || {};
        return $.ajax({
            url: commonJS.ApplicationPath + path,
            type: 'POST',
            data: param,
            async: true
        });
    }
    commonJS.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    commonJS.addSignNote = function (signNote) {
        if (signNote) {
            signNote = signNote.replace(/</g, "&lt;");
            signNote = signNote.replace(/>/g, "&gt;");
            console.log(signNote)
            if (SIGNNOTES.indexOf(signNote) === -1) {
                SIGNNOTES.push(signNote);
                var tempHtml = '<span class="tag js-delete" jsdata="' + signNote + '"><i class="i i4"></i>' + signNote.toString() + '<i class="iconfont icon-close1" title="删除" style="cursor: pointer;"></i></span>';
                $("#txtSignNote")[0].insertAdjacentHTML('beforebegin', tempHtml);
                return;
            }
            layer.msg($.i18n("DonotRepeatLabel"),{skin:" layui-layer tip-orange ",shade:"layui-layer-msg layui-layer-content,layui-layer-msg"});
            return;
        }
    }
    commonJS.registerSignNote = function () {
        $('#aaa').on('click', '.js-addSignNote', function (e) {
            $('#txtSignNote').val('');

            $('#aaa .js-addSignNote').hide();
            $('#txtSignNote').show();
            //获取焦点，触发blur事件 togg
            $('#txtSignNote').focus();
        });

        $('#aaa').on('focus', '#txtSignNote', function (e) {
            $('.js-label').show();
        });

        $('#aaa').on('keydown', '#txtSignNote', function (e) {
            if (e.keyCode == 13) {
                var tempLable = $('#txtSignNote').val().trim();
                if (/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g.test(tempLable) || tempLable.length > 10 || tempLable.length === 1) {
                    layer.msg('标签只能输入中文、字母、数字,2-10个字',{skin:" layui-layer tip-orange ",shade:"layui-layer-msg layui-layer-content,layui-layer-msg"});

                    $('#txtSignNote').val(tempLable.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ''));
                    if ($('#txtSignNote').val().length > 10) {
                        $('#txtSignNote').val($('#txtSignNote').val().substr(0, 10));
                    }
                    return;
                }
                commonJS.addSignNote($('#txtSignNote').val().trim());
                $('#txtSignNote').val('');
            }
        });

        $('#aaa').on('blur', '#txtSignNote', function (e) {
            var tempLable = $('#txtSignNote').val().trim();
            if (/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g.test(tempLable) || tempLable.length > 10 || tempLable.length === 1) {
                layer.msg('标签只能输入中文、字母、数字,2-10个字',{skin:" layui-layer tip-orange ",shade:"layui-layer-msg layui-layer-content,layui-layer-msg"});

                $('#txtSignNote').val(tempLable.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ''));
                if ($('#txtSignNote').val().length > 10) {
                    $('#txtSignNote').val($('#txtSignNote').val().substr(0, 10));
                }
                return;
            }
            commonJS.addSignNote($('#txtSignNote').val().trim());
            $('#txtSignNote').val('');
            $('#txtSignNote').hide();
            $('#aaa .js-addSignNote').show();
        });

        ue.addListener("focus", function (type, event) {
            $('.js-label').hide();
            $('#txtSignNote').hide();
            $('#aaa .js-addSignNote').show();
        });

        $(document).mouseup(function (e) {
            var con = $('.js-label');
            if (!con.is(e.target) && con.has(e.target).length === 0 && e.target.id != 'txtSignNote') {
                $('.js-label').hide();
                $('#txtSignNote').hide();
                $('#aaa .js-addSignNote').show();
            }
        });

        $('#aaa').on('click', ' .js-delete', function () {
            var value = $(this).attr('jsdata');
            if (value) {
                //移除样式
                var index = SIGNNOTES.indexOf(value);
                SIGNNOTES.splice(index, 1);
                for (var i = 0; i < $('.js-addExistNoteSign').length; i++) {
                    if ($($('.js-addExistNoteSign')[i]).attr('jsdata') === value) {
                        $($('.js-addExistNoteSign')[i]).removeClass('cga1');
                    }
                }
            }
            $(this).remove();
        });

        $('#aaa').on('click', '.js-addExistNoteSign', function () {
            var signNote = $(this).attr('jsdata').trim();
            if (!signNote) return;
            $(this).addClass('cga1');
            commonJS.addSignNote(signNote);
        });
    }
    //status为当前弹窗状态:1、不传该参默认为新添加笔记 2、edit：编辑笔记弹窗
    commonJS.showUE = function (process, content, status, title, newPZ) {
        $(document).on("click", ".layui-layer-btn1", function () {
            if (newPZ) {
                newPZ.remove();
            }
        })
        if (status === 'reply' || status === 'comment' || status === 'discuss') {
            $("#aaa .tag-top").css('display', 'none')
        }
        else {
            $("#aaa .tag-top").css('display', 'block')
        }

        //加载后台配置
        ue.loadServerConfig();

        SIGNNOTES = [];
        if (status && status.type === 'edit' && status.note.NoteExts) {
            for (var i = 0; i < status.note.NoteExts.length; i++) {
                SIGNNOTES.push(status.note.NoteExts[i].SignName);
            }
        }
        $('.js-delete').remove();
        $('#txtSignNote').hide();
        $('#aaa .js-addSignNote').show();
        $('#txtSignNote').val('');
        var readyCount = 0;//ueditor的ready事件会触发两次，确保只执行一次ready回调函数。
        ue.addListener("ready", function () {
            if (readyCount === 0) {
                if (content) {
                    ue.setContent(content);
                } else {
                    ue.setContent('');
                }
                readyCount++;
            }
        });
        $('.js-label').hide();
       // $('.js-tag-group').html('');
        //discussRepositoty.asyncGetData({ topic: window.topic }, 'Study/GetStudyNoteSignNames').done(function (data) {
        //    var html = '';
        //    for (var i = 0; i < data.Data.length; i++) {
        //        html += '<span class="js-addExistNoteSign" jsdata="' + data.Data[i] + '">' + data.Data[i] + '</span>';
        //    }
        //    if ($(".js-tag-group") && $(".js-tag-group")[0]) {
        //        $(".js-tag-group")[0].insertAdjacentHTML('afterbegin', html);
        //    }
        //});

        positionPop()//解决top被遮挡问题
        var area = [],
			offset;
        area.length = 0;
        if (!status) {//笔记
            area.push('410px');
            //area.push('495px');
            var left = $(window).width() - 410;
            var top = 150;
            offset = [top, left];
        } else {//非笔记
            area.push('750px');
            //area.push('490px');
        }

        //XPL 去掉template-tag标签，统一改为xmltemp，解决同一位置多次划词问题     取消划词  
        function unwrap() {            
            var wrapReplace = $("xpltemp").closest("p");
            var str = wrapReplace.html();
            if (str === null || str === undefined) {
                str = "";
            }
            else {
                str = str.replace(/[\t\r\n\f]/g, ' ')//格式化包含标签的内容，因为节点间有边界
					.replace(/<xpltemp>(.*?)<\/xpltemp>/, '$1');//

            }
            wrapReplace.html(str);
        }

        layer.open({
            type: 1,
            title: title ||'添加笔记',
            area: area,
            zIndex: 800,
            shade: 0.3,
            offset: offset,
            resize: false,
            //shadeClose: true, //点击遮罩关闭
            content: $('#aaa'),
            btn: [window.InitData.Confirm, window.InitData.Cancel],
            success: function () {
          
                if (status && status.type === 'edit') {
                    MyEvent.fireEvent("editlayerShowSuccess");
                }
                var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if (is_chrome) {
                    jQuery("#ueditor_0").css({ height: 0 });
                    jQuery("#ueditor_0").css({ height: '100%' });
                }
            },
            yes: function (index, layero) {            
                if (ue.hasContents()) {
                    process(ue.getContent(''));                   
                    layer.close(index);
                    unwrap()
                    return true;
                } else {              
                    layer.msg("您还没有输入内容",{skin:" layui-layer tip-orange ",shade:"layui-layer-msg layui-layer-content,layui-layer-msg"});
                    unwrap()
                    return false;
                }             
            },
            end: function () {
                positionPop()//解决top被遮挡问题
                unwrap()
            },
            cancel: function (index, layero) {
                if (newPZ) {
                    newPZ.remove();
                }
                unwrap()
                process = null;
                ue.reset();
                layer.close(index);
                return false;
            }
        });
    }

    commonJS.AddPara = function (process, content, status) {
        //加载后台配置
        uePara.loadServerConfig();

        var readyCount = 0;//ueditor的ready事件会触发两次，确保只执行一次ready回调函数。
        uePara.addListener("ready", function () {
            if (readyCount === 0) {
                if (content) {
                    uePara.setContent(content);
                } else {
                    uePara.setContent('');
                }
                readyCount++;
            }
        });
        $("#searchstr1").val("");
        positionPop();
        layer.open({
            type: 1,
            title: $.i18n("AddContent"),
            area: ['1000px', 'auto'],
            zIndex: 800,
            shade: 0,
            shadeClose: true, //点击遮罩关闭
            content: $('#newPara'),
            btn: [window.Confirm, window.Cancel],
            success: function () {
                if (status && status.type === 'edit') {
                    MyEvent.fireEvent("editlayerShowSuccess");
                }
                var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if (is_chrome) {
                    jQuery("#ueditor_1").css({ height: 0 });
                    jQuery("#ueditor_1").css({ height: '100%' });
                }
            },
            yes: function (index, layero) {
                if (uePara.hasContents()) {
                    process(uePara.getContent(''));
                    layer.close(index);
                    return true;
                } else {
                    layer.msg(window.Discuss_Read_AlertFillContent,{skin:" layui-layer tip-orange ",shade:"layui-layer-msg layui-layer-content,layui-layer-msg"});
                    return false;
                }
            },
            end: function () {
                discussEvent.trigger('closeNewParaLayer');
                positionPop(); //解决top被遮挡问题
            },
            cancel: function (index) {
                process = null;
                uePara.reset();
                layer.close(index);
                return false;
            }
        });
    }

    //commonJS.AddLitMark = function (mark, newSign) {
    //    if (mark) {
    //        if (LitSIGNNAEMS.indexOf(mark) === -1) {
    //            discussRepositoty.asyncGetData({
    //                filecode: window.fileName,
    //                signLabel: mark,
    //                fileSourceType: window.fileSourceType,
    //                tableName: window.tableName,
    //                dbCode: window.dbCode,
    //                topic: window.topic
    //            }, 'Study/AddStudyFileSign').done(function (json) {
    //                if (json && json.Data && json.Data.msg) {
    //                    window.topic = json.Data.studyId;
    //                    LITSIGNS.push(json.Data.outSignId);
    //                    LitSIGNNAEMS.push(mark);
    //                    $("#txtLitSignNote").val('');
    //                    var tempHtml = '';
    //                    tempHtml += '<span class="tag js-lit-delete" signId="' + json.Data.outSignId + '" signName="' + mark + '"><i class="i i4"></i>';
    //                    tempHtml += mark + '<i class="icon-close1 iconfont " title="删除" style="cursor: pointer;"></i></span>';
    //                    $("#txtLitSignNote").closest(".tag-text")[0].insertAdjacentHTML('beforebegin', tempHtml);

    //                    //已有标签中  存在则变灰  并且newSign改为false  不再添加 
    //                    var $addExistNoteSign = $(".js-lit-addExistNoteSign");
    //                    var length = $addExistNoteSign.length;
    //                    for (var i = 0; i < $addExistNoteSign.length; i++) {
    //                        if ($addExistNoteSign.eq(i).text() == mark) {
    //                            $addExistNoteSign.eq(i).addClass("cga1");
    //                            newSign = false;
    //                        }
    //                    }
    //                    if (newSign) {
    //                        var html = '';
    //                        html += '<span class="js-lit-addExistNoteSign" style="" isOwn="1" signId="' + json.Data.outSignId;
    //                        html += '" signName="' + mark + '">' + mark + '</span>';
    //                        if ($(".js-lit-addExistNoteSign[isOwn='1']:last")[0]) {
    //                            $(".js-lit-addExistNoteSign[isOwn='1']:last")[0].insertAdjacentHTML('afterEnd', html);
    //                        } else {
    //                            $(".js-lit-tag-group")[0].insertAdjacentHTML('beforeEnd', html);
    //                        }
    //                    }
    //                    layer.msg($.i18n("AddLabelSuccess"));

                        
    //                    return;
    //                } else {
    //                    layer.msg($.i18n("AddLabelFail"));
    //                }

    //            });

    //        } else {
    //            layer.msg($.i18n("DonotRepeatLabel"));
    //            return;
    //        }
    //    } else {
    //        layer.msg($.i18n("LabelNotEmpty"));
    //    }
    //};

    //commonJS.GetExistedMarks = function () {
    //    discussRepositoty.asyncGetData({ topic: window.topic, dbCode: window.dbCode, filecode: window.fileName, fsType: window.fileSourceType }, 'Study/GetFileStudyInfoAtStudy').done(function (json) {
    //        if (json.Code === 200) {
    //            var html = '';
    //            var ownHtml = '';
    //            var learnLabels = json.Data.Data.LearnLabels;
    //            if (learnLabels != null && learnLabels.length > 0) {
    //                learnLabels.forEach(function (item) {
    //                    LitSIGNNAEMS.push(item.LabelName);
    //                    ownHtml += '<span class="tag js-lit-delete" signid="' + item.LabelId + '" signname="' + item.LabelName +
    //                                                '"><i class="i i4"></i>' + item.LabelName + '<i class="icon-close1 iconfont " title="删除" style="cursor: pointer;"></i></span>';
    //                });
    //            }

    //            if (json.Data.AllSigns != null && json.Data.AllSigns.length > 0) {
    //                json.Data.AllSigns.forEach(function (item) {
    //                    //已添加便签是否已经存在于当前添加标签
    //                    var isHave=learnLabels.some(function (it) {
    //                        return item.FileSignName == it.LabelName;
    //                    })
    //                    if (isHave) {

    //                    }
    //                    html += '<span class="js-lit-addExistNoteSign ' + (isHave?'cga1':'') + '" style="" isOwn="1" signId="' + item.FileSignId +
    //                                           '" signName="' + item.FileSignName + '">' + item.FileSignName + '</span>';
    //                });
    //            }
    //            $(".js-lit-tag-group")[0].insertAdjacentHTML('afterbegin', html);
    //            $("#txtLitSignNote").closest(".tag-text")[0].insertAdjacentHTML('beforebegin', ownHtml);



    //            //var signIds = json.Data.SignId;
    //            ////console.log(json.Data)
    //            //if (signIds === null) {
    //            //	return;
    //            //}

    //            //LITSIGNS = signIds.split(';');
    //            //discussRepositoty.asyncGetData({ topic: window.topic }, 'Study/GetStudyFileSignInfo').done(function (data) {
    //            //    var studyMarkSet = data.Data;
    //            //    var html = '';
    //            //    for (var i = 0; i < studyMarkSet.length; i++) {
    //            //        if (LITSIGNS.join(';').indexOf(studyMarkSet[i].FileSignId) !== -1) {
    //            //            LitSIGNNAEMS.push(studyMarkSet[i].FileSignName);
    //            //            html += '<span class="js-lit-addExistNoteSign" style="" isOwn="1" signId="' + studyMarkSet[i].FileSignId +
    //            //                '" signName="' + studyMarkSet[i].FileSignName + '">' + studyMarkSet[i].FileSignName + '</span>';
    //            //        } else {
    //            //            html += '<span class="js-lit-addExistNoteSign" isOwn="0" signId="' + studyMarkSet[i].FileSignId
    //            //                + '" signName="' + studyMarkSet[i].FileSignName + '">' + studyMarkSet[i].FileSignName + '</span>';
    //            //        }
    //            //    }
    //            //    $(".js-lit-tag-group")[0].insertAdjacentHTML('afterbegin', html);
    //            //});
    //        }
    //    });
    //};

    //commonJS.RegisterLitMark = function () {
    //    //$('#LitSelectMark').on('click', '.js-addLitSignNote', function (e) {
    //    // $('#txtLitSignNote').show();
    //    //$('.js-lit-label').show();
    //    //$('.js-addLitSignNote').hide();
    //    commonJS.GetExistedMarks();
    //    //})
    //    $('#LitSelectMark').on('focus', '#txtLitSignNote', function (e) {
    //        $('.js-lit-label').show();
    //    }).on('keydown', '#txtLitSignNote', function (e) {
    //            if (e.keyCode === 13) {
    //                var tempLable = $('#txtLitSignNote').val().trim();
    //                if (/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g.test(tempLable) || tempLable.length > 10 || tempLable.length === 1) {
    //                    layer.msg('标签只能输入中文、字母、数字,2-10个字');

    //                    $('#txtLitSignNote').val(tempLable.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ''));
    //                    if ($('#txtLitSignNote').val().length > 10) {
    //                        $('#txtLitSignNote').val($('#txtLitSignNote').val().substr(0, 10));
    //                    }
    //                    return;
    //                }
    //                commonJS.AddLitMark($('#txtLitSignNote').val().trim(), true);
    //            }
    //    }).on("blur", '#txtLitSignNote', function (e) {
           
    //            var tempLable = $('#txtLitSignNote').val().trim();
    //            if (/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g.test(tempLable) || tempLable.length > 10 || tempLable.length === 1) {
    //                layer.msg('标签只能输入中文、字母、数字,2-10个字');

    //                $('#txtLitSignNote').val(tempLable.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ''));
    //                if ($('#txtLitSignNote').val().length > 10) {
    //                    $('#txtLitSignNote').val($('#txtLitSignNote').val().substr(0, 10));
    //                }
    //                return;
    //            }
    //            commonJS.AddLitMark($('#txtLitSignNote').val().trim(), true);
          
    //    });
      
    //    $('#LitSelectMark').on('click', function (e) {
    //        e.stopPropagation();
    //    });
    //    $('#LitSelectMark').on('click', '.btn-primary', function (e) {
    //        $('#LitSelectMark').hide();

    //    });
    //    $('#LitSelectMark').on('click', '.js-lit-delete i.icon-close1', function () {
    //        var value = $(this).closest(".js-lit-delete").attr('signId');
    //        var $this = $(this).closest(".js-lit-delete");
    //        var name = $(this).closest(".js-lit-delete").attr('signName');
    //        //console.log(value, $this, name)
    //        if (value) {
    //            discussRepositoty.asyncGetData({
    //                topic: window.topic,
    //                dbCode: window.dbCode,
    //                fileCode: window.fileName,
    //                signId: value,
    //                fsType: window.fileSourceType
    //            }, 'Study/DeleteFileSign').done(function (json) {
    //                if (json.Data) {
    //                    $this.remove();
    //                    LITSIGNS.splice(LITSIGNS.indexOf(value), 1);
    //                    LitSIGNNAEMS.splice(LitSIGNNAEMS.indexOf(name), 1);

    //                    for (var i = 0; i < $('.js-lit-addExistNoteSign').length; i++) {//此处为吧下面的标签也一起删掉 
    //                        if ($($('.js-lit-addExistNoteSign')[i]).attr('signId') === value) {
    //                            $($('.js-lit-addExistNoteSign')[i]).remove();
    //                        }
    //                    }

    //                } else {
    //                    layer.msg($.i18n("DelLabelFail"));
    //                }
    //            });
    //        }
    //    });

    //    $('#LitSelectMark').on('click', '.js-lit-addExistNoteSign', function () {
    //        var exist = false;
    //        LitSIGNNAEMS.forEach(function (item) {
    //            if (item == $(this).attr('signname')) {
    //                exist = true;
    //            }
    //        })
    //        if (exist) {
    //            layer.msg($.i18n("DonotRepeatLiteraLabel"));
    //            return;
    //        } else {
    //            var mark = $(this).attr('signName').trim();
    //            if (!mark) return;
    //            commonJS.AddLitMark(mark, false);
    //        }
    //    });
    //};


    //需要调用的方法
    //commonJS.run = function () {
    //    commonJS.registerSignNote();
    //    commonJS.RegisterLitMark();
    //}
    //commonJS.run();

    window.onload = function () {
        //加载后台配置
        ue.loadServerConfig();
        uePara.loadServerConfig();
    };
})(window, UE);