window.apiConfig = top.apiConfig;
window.COMMON_FN = top.COMMON_FN;
window.COMMON_GLOBAL = top.COMMON_GLOBAL;
window.TABLETOOL = top.TABLETOOL;
window.BASE_UTIL = top.BASE_UTIL;

var userid = top.userid,
    accesstoken = top.accesstoken;

var $tableList = null,
    $allSelect = null,
    $listtitle = null,
    $tools = null,
    $sensitiveword = null,
    $selectable = null,
    timer = null, //敏感词筛选用的定时器

    _index = null;

var verifyAble = $.inArray('34003',top.access) > -1;        //审核评论权限
var checkAlbe = $.inArray('34001',top.access) > -1;         //查看评论权限
var eidtAlbe = $.inArray('34002',top.access) > -1;         // 编辑评论权限
var checkblacklistAlbe = $.inArray('34501',top.access) > -1;         //查看黑名单权限
var eidtblacklistAlbe = $.inArray('34502',top.access) > -1;         //编辑黑名单权限


var methods = {
    init: function(i) {
        _index = i;
        $tableList = $("div.tableList");
        $listtitle = $("div.listtitle");

        TABLETOOL.initTableHead(tableIndex, $listtitle);

        $allSelect = $("#allSelect");
        $tools = $("div.tools.toppart");
        $sensitiveword = $(".selectBysensitiveword");
        $selectable = $(".selectable");

        $tools.show(0);

        tableUtil.initPageBar();

        //全选与全不选
        $allSelect.off("click").on({
            click: function(e) {
                var self = $(this),
                    checked = self.prop('checked'),
                    $checkboxs = $tableList.find("input:checkbox");

                $checkboxs.each(function(index) {
                    $(this).prop({
                        checked: checked
                    });
                    var $ul = $(this).parents("ul");
                    if (checked == true) {
                        $ul.addClass('ulHover');
                    } else {
                        $ul.removeClass('ulHover');
                    }

                });

                initToolBar();
            }
        });

        //点击单个单选框
        $tableList.on({
            click: function() {
                initToolBar();
                var $ul = $(this).parents("ul");
                if ($ul.hasClass('ulHover')) {
                    $ul.removeClass('ulHover');
                } else {
                    $ul.addClass('ulHover');
                }
            }
        }, "input:checkbox");


        //工具和表格每一行后面的栏通过、驳回、删除和详情
        if (_index == 0) {
            $tools.on({
                click: function() {
                    var $select = $tableList.find("input:checkbox:checked"),
                        selectList = [];

                    $.each($select, function(index, val) {
                        selectList.push($(this).attr("id").replace("id", ""));
                    });

                    if (selectList.length > 0) {
                        tableUtil.passComment(selectList);
                    }
                }
            }, ".passBtn.btnActive");

            $tableList.on({
                click: function() {
                    var commentid = $(this).attr("commentid");
                    tableUtil.passComment([commentid]);
                }
            }, "a.passBtn.btnActive");

        }

        if (_index == 0 || _index == 1) {
            $tools.on({
                click: function() {
                    var commentid = $tableList.find("input:checkbox:checked").attr("id").replace("id", "");
                    $("a.forbidBtn.btnActive[commentid=" + commentid + "]").get(0).click();
                }
            }, ".forbidBtn.btnActive");

            $tableList.on({
                click: function() {
                    var commentid = $(this).attr("commentid");
                    var base = $(this).data("base");
                    // console.log(base);
                    tableUtil.forbidComment(base);
                }
            }, "a.forbidBtn.btnActive");

        }

        if (_index == 2) {
            $tools.on({
                click: function() {
                    var $select = $tableList.find("input:checkbox:checked"),
                        selectList = [];

                    $.each($select, function(index, val) {
                        selectList.push($(this).attr("id").replace("id", ""));
                    });

                    if (selectList.length > 0) {
                        tableUtil.deleteComment(selectList);
                    }
                }
            }, ".delBtn.btnActive");

            $tableList.on({
                click: function() {
                    var commentid = $(this).attr("commentid");
                    tableUtil.deleteComment([commentid]);
                }
            }, "a.delBtn.btnActive");

        }

        if (_index == 0 || _index == 1 || _index == 2) {
            $tools.on({
                click: function() {
                    var commentid = $tableList.find("input:checkbox:checked").attr("id").replace("id", "");
                    $("a.detailBtn.btnActive[commentid=" + commentid + "]").get(0).click();
                }
            }, ".detailBtn.btnActive");

            $tableList.on({
                click: function() {
                    var commentid = $(this).attr("commentid");
                    tableUtil.detialComment(commentid);
                }
            }, "a.detailBtn.btnActive");
        }

        if (_index == 3 || _index == 4) {
            $tools.on({
                click: function() {
                    var userid = $tableList.find("input:checkbox:checked").attr("id").replace("id", "");
                    $("a.detailBtn.btnActive[userid=" + userid + "]").get(0).click();
                }
            }, ".detailBtn.btnActive");

            $tableList.on({
                click: function() {
                    var userid = $(this).attr("userid");
                    var base = $(this).data("base");
                    // console.log(base);
                    tableUtil.detialUser(base);
                }
            }, "a.detailBtn.btnActive");
        }
        if (_index == 3 && eidtblacklistAlbe) {
            $tools.on({                                                 
                click: function (){
                    var $select    = $tableList.find("input:checkbox:checked"),
                        selectList = [];

                    $.each($select, function(index, val) {
                        selectList.push($(this).attr("id").replace("id", ""));
                    });

                    if (selectList.length > 0) {
                        tableUtil.blackuserClose(selectList);
                    }
                }
            },".onOffBtn.btnActive");

            $tableList.on({      
                click: function() {
                     var userid = $(this).attr("userid");
                    tableUtil.blackuserClose([userid]);
                }
            },"a.onOffBtn.btnActive");
        }

        if ((_index == 0 && top.peoplereview == 1) || (_index == 2)) {
            //敏感词筛选
            $selectable.hover(function() {
                $this = $(this);
                var l = $this.offset().left;
                $sensitiveword.show();
                $sensitiveword.css("left", l);
            }, function() {
                timer = setTimeout(function() {
                    $sensitiveword.hide();
                }, 500);
            });

            $sensitiveword.hover(function() {
                clearTimeout(timer);

                $sensitiveword.show();
            }, function() {
                $sensitiveword.hide();
            });

            $sensitiveword.on({
                click: function() {
                    var index_ = parseInt($(this).attr("id"));
                    searchPara.filter = index_;
                    tableUtil.initPageBar();
                }
            }, "input:radio");
        }

    }
};

var tableUtil = {

    /**
     * [initPageBar 初始化分页插件]
     * @return {[type]} [description]
     */
    initPageBar: function() {
        // var paraStr = "?accesstoken=" + accesstoken;
        var url = "";
        var isStringify = null;
        if (_index == 3) {
            url = apiConfig.getBlackuserList;
        } else if(_index == 4){
            url = apiConfig.getHistoryBlackuserList;
        }else{
            url = apiConfig.getCommentList;
            isStringify = true;
        }
        /*for (var key in searchPara) {
            if (typeof searchPara[key] != "undefined" && searchPara[key] !== "") {
                paraStr += ("&" + key + "=" + searchPara[key]);
            }
        }*/
        var dataJson = $.extend(true, {}, searchPara);
        dataJson.accesstoken = accesstoken;
        $pages = TABLETOOL.initPageBarTool($("div.pages>div.pageBar"), {
            url: url,
            type: "post",
            data:dataJson,
            isStringify:isStringify,
            success: function(data, pagsIndex) {
                tableUtil.showList(data);
                initToolBar();
            }
        });
    },
    /**
     * [passComment 通过评论]
     * @return {[type]} [description]
     */
    passComment: function(list) {
        commentUtil.passComment(list.slice(0), function() {
            COMMON_FN.showMessage("通过评论成功！");
            tableUtil.initPageBar();
        });
    },
    /**
     * [forbidComent 驳回评论]
     * @return {[type]} [description]
     */
    forbidComment: function(opt) {
        var para = "";
        for (var attr in opt) {
            para += "&" + attr + "=" + opt[attr];
        }
        $.content({
            context: top.document,
            width: "550px",
            height: "600px",
            duration: 0,
            header: {
                text: "是否驳回"
            },
            content: {
                src: "commentManage/commentDetial.html?_index=5" + para
            },
            footer: {
                buttons: [{
                    buttonID: "cancel",
                    buttonText: "取消",
                    callback: function(layerID) {
                        $.tLayer("close", layerID);
                    }
                }, {
                    buttonID: "forbid",
                    buttonText: "确认驳回",
                    callback: function(layerID) {

                        //获得当前iframe的window对象
                        var iframe = $.tLayer("getContent", layerID);
                        //获取iframe内驳回信息                
                        var data = iframe.getInfo();
                        commentUtil.forbidComment(data, function(res) {
                            // if(tableIndex == 1){
                            //     var dataId = {};
                            //     dataId.commentid = data.commentid;
                            //     dataId.programid = data.programid;
                            //     commentUtil.postTwoId(dataId,function(res){
                            //         $.tLayer("close", layerID);

                            //         COMMON_FN.showMessage("撤回评论成功！");
                            //         initToolBar();
                            //         tableUtil.initPageBar();
                            //         tableUtil.userForbidDetial(res);
                            //     });
                            // }else{
                               $.tLayer("close", layerID);

                               COMMON_FN.showMessage("驳回成功！");
                               initToolBar();
                               tableUtil.initPageBar();
                               tableUtil.userForbidDetial(res); 
                            // }
                            
                        });

                    }
                }]
            }
        });
    },
    /**
     * [detialComent 评论详情]
     * @return {[type]} [description]
     */
    detialComment: function(commentid) {
        $.content({
            context: top.document,
            width: "500px",
            height: "350px",
            duration: 0,
            header: {
                text: "评论详情"
            },
            content: {
                src: "commentManage/commentDetial.html?commentid=" + commentid + "&_index=" + _index
            },
            footer: {
                buttons: [{
                    buttonID: "sure",
                    buttonText: _index === 0 ? "通过" : "确认",
                    callback: function(layerID) {
                        if (_index === 1) {
                            $.tLayer("close", layerID);
                        } else {

                            //获得当前iframe的window对象
                            var iframe = $.tLayer("getContent", layerID);
                            commentUtil.passComment([commentid], function() {
                                $.tLayer("close", layerID);
                                COMMON_FN.showMessage("通过评论成功！");
                                tableUtil.initPageBar();
                            });
                        }
                    }
                }, {
                    buttonID: "forbid",
                    buttonText: _index === 0 ? "驳回" : "取消",
                    callback: function(layerID) {
                        if (_index === 1) {
                            $.tLayer("close", layerID);
                        } else {
                            //获得当前iframe的window对象
                            var iframe = $.tLayer("getContent", layerID);
                            //获取iframe内驳回信息                
                            var data = iframe.getInfo();
                            commentUtil.forbidComment(data, function(res) {
                                $.tLayer("close", layerID);

                                COMMON_FN.showMessage("驳回成功！");
                                initToolBar();
                                tableUtil.initPageBar();
                                tableUtil.userForbidDetial(res);
                            });
                        }
                    }
                }]
            }
        });
    },
    /**
     * [userForbidDetial 用户被驳回详情]
     * @return {[type]} [description]
     */
    userForbidDetial: function(res) {
        var d = new Date();
        var t = parseInt(d.getTime()/1000);
        var level1 = 0,
            level2 = 0,
            level3 = 0;
        var forbidList = [];
        var userid_ = res.userid;
        var level_ = res.forbidlevel;
        var expirationtime = null;
        var userInfo = {
            forbidreasonid: res.forbidreason,
            forbidlevel: res.forbidlevel,
            userid: [+res.userid]
        };
        commentUtil.getBlackCommentInfo(userid_, function(res, id) { 
            res.forbid_info  = res.forbid_list ? (res.forbid_list[0] ? res.forbid_list[0].forbid_info : []) : [];
            res.forbid_info = res.forbid_info.length ? res.forbid_info[res.forbid_info.length -1] : {};
             expirationtime = parseInt( res.forbid_info.expirationtime) || 0;
             if(expirationtime > t){
                return;
             }
            commentUtil.getUserCommentInfo(id, function(res, id) {
                forbidList = res.forbid_list || [];
                for (var i = 0, length = forbidList.length; i < length; i++) {
                    item = forbidList[i];
                    var operatorDate = new Date(item.f_operator_time);
                    var operatorTime = parseInt(operatorDate.getTime()/1000);
                   
                    if (operatorTime > expirationtime) {
                        if (item.f_serious_leve == 1) {
                            level1++;
                        } else if (item.f_serious_leve == 2) {
                            level2++;
                        } else if (item.f_serious_leve == 3) {
                            level3++;
                        }
                    }
                }
                if (level3 >= 1) {
                    // userInfo.expirationtime = "";
                } else if ((level2 >= 1 && level1 >= 3) || level1 >= 7) {
                    userInfo.expirationtime = t + 24 * 3600 * 3;
                } else if (level2 >= 3) {
                    userInfo.expirationtime = t +  24 * 3600 * 7;
                } else {
                    return;
                }

                COMMON_FN.alertMsg("该用户已到达被禁上限请求加入黑名单!","330px",function(){
                    commentUtil.blackuserOpen(userInfo, function(res) {
                        // $.tLayer("close", layerID);
                        COMMON_FN.showMessage("加入黑名单成功！");
                    });
                });
            });
         });  
        
    },
    /**
     * [deleteComment 删除评论]
     * @return {[type]} [description]
     */
    deleteComment: function(list) {

        $.confirm({
            context: top.document,
            zIndex: 300,
            content: {
                height: '150px;',
                html: "确定要删除所选评论吗？",
                icon: "img/icon_tips.png"
            },
            footer: {
                buttons: [{
                    callback: function(layerID) {

                        commentUtil.deleteComment(list, function(res) {
                            $.tLayer("close", layerID);
                            COMMON_FN.showMessage("删除评论成功！");
                            tableUtil.initPageBar();
                        });
                    }
                }, {
                    callback: function(layerID) {
                        $.tLayer("close", layerID);
                    }
                }]
            }
        });
    },
    /**
     * [blackuserClose 打开评论]
     * @return {[type]} [description]
     */
    blackuserClose: function(list) {
        commentUtil.blackuserClose(list.slice(0), function() {
            COMMON_FN.showMessage("用户解禁成功！");
            tableUtil.initPageBar();
            initToolBar();
        });
    },
    /**
     * [detialUser 用户详情]
     * @return {[type]} [description]
     */
    detialUser: function(opt) {
        var para = "";
        for (var attr in opt) {
            para += "&" + attr + "=" + opt[attr];
        }
        $.content({
            context: top.document,
            width: "520px",
            height: (_index == 3) ? "430px" : "380px",
            duration: 0,
            header: {
                text: "用户详情"
            },
            content: {
                src: "commentManage/userDetial.html?_index=" + _index + para
            }
            ,
            footer: {
                buttons: [ {
                     buttonID: "cancel",
                     buttonText: "取消",
                     callback: function (layerID) {
                         $.tLayer("close", layerID); 
                     }
                },
                {
                    buttonID: "open",
                    buttonText: eidtblacklistAlbe ? "开启" : "确定",
                    callback: function (layerID) {
                        if(eidtblacklistAlbe){
                            commentUtil.blackuserClose([opt.userid],function(){
                                  $.tLayer("close", layerID);
                                  COMMON_FN.showMessage("用户解禁成功！");
                                  initToolBar();
                                  tableUtil.initPageBar();
                            }); 
                        }else{
                          $.tLayer("close", layerID);
                        }
                    }
                },]
            }
        });
    }

};
