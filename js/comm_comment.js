/*系统公用的函数，表格头信息等*/
//用户id
var userid = top.userid = top.USERID,
    //身份令牌
    accesstoken = top.accesstoken = top.TOKEN,
    system_id = top.system_id = 34;
/*-----------------------------全局变量----------------------begin*/

var COMMON_GLOBAL = { //整个系统的全局变量，为了方式作用域冲突，故设立COMMON_GLOBAL
    SYSTEM_ID: system_id,
    SYSTEM_NAME: "评论管理系统",
    defaultAppPoster: "",
    PAGE_SIZE: 50, //每一页显示的数据条数，                                   
    DISPLAYTIME: 100, //提示框显示的时间

    MESSAGE: { //提示消息定义
        SERVER_ERROR: "服务器异常",
        ADD_SUCCESS: "新增成功",
        DELETE_SUCCESS: "删除成功",
        WAIT_A_MOMENT: "请稍等...",
        SEND_SUCCESS: "发送成功",
        SAVE_SUCCESS: "保存成功"
    },

    ERROR_CODE: { //错误码
        "404": "Invalid request",
        "61100": "内容包含敏感词",
        "10086": "功能未实现",
        "5001": "req_itmreq_c::sendToiusaFailed",
        "61006": "请求信息失败",
        "9021": "源用户令牌错误,请重新登陆",
        "10750": "用户已在当前黑名单中",
        "10751": "用户不在当前黑名单中",
        "10752": "黑名单不存在",
        "10753": "黑名单当前存在用户",
        "10754": "黑名单没有该权限",
        "9201": "源用户令牌错误"
    },

    CLICK_DURATION: 200, //点查询保存，关闭时，两次点击的时间间隔
    FORBID_REASON: {
        "1": {"11200":"蓄意辱骂他人", "11201":"发表无关产品广告", "11202":"发表不当言论"},
        "2": {"11203":"发表虚假信息（兼职等）","11204": "发表非法网页链接", "11205":"传播谣言"},
        "3": {"11206":"侮辱国家或国家领导","11207":"含有反社会性词语","11208": "宣传邪教"}
    },
    FORBID_Max: {
        "1": { maxNum: 7, forbidTime: 3 },
        "2": { maxNum: 3, forbidTime: 7 },
        "3": { maxNum: 1, forbidTime: 1000000 },
        "4": {}
    },
    COMMENT_SOURCE: ["测试网络","机顶盒", "pc网站", "Android客户端", "iPhone客户端"]
};

/*-----------------------------全局变量----------------------end*/

//生成表格内容的工具类
var TABLETOOL = {
    columns: [
        [ //index = 0，终端提交 95%
            { 'title': "checkbox_label", 'width': '5%', "classname": "clearfix" },
            { 'title': "序号", 'width': '5%', "classname": "" },
            { 'title': "评论id", "width": "18%", "classname": "" },
            { 'title': "评论时间", "width": "15%", "classname": "" },
            { 'title': "敏感词审核", "width": "10%", "classname": "selectable" },
            { 'title': "评论内容", "width": "25%", "classname": "", "sonClass": "comment_content" },
            { 'title': "操作", "width": "20%", "classname": "" }
        ],
        [ //index = 1，已发布 95%
            { 'title': "checkbox_label", 'width': '5%', "classname": "clearfix" },
            { 'title': "序号", 'width': '5%', "classname": "" },
            { 'title': "评论id", "width": "18%", "classname": "" },
            { 'title': "评论节目id", "width": "10%", "classname": "" },
            { 'title': "用户id", "width": "10%", "classname": "" },
            { 'title': "审核操作人", "width": "8%", "classname": "" },
            { 'title': "审核时间", "width": "12%", "classname": "" },
            { 'title': "评论时间", "width": "12%", "classname": "" },
            { 'title': "被赞次数", "width": "8%", "classname": "" },
            { 'title': "操作", "width": "10%", "classname": "" }
        ],
        [ //index = 2，被驳回 95%
            { 'title': "checkbox_label", 'width': '5%', "classname": "clearfix" },
            { 'title': "序号", 'width': '5%', "classname": "" },
            { 'title': "评论id", "width": "18%", "classname": "" },
            { 'title': "评论节目id", "width": "10%", "classname": "" },
            { 'title': "用户id", "width": "8%", "classname": "" },
            { 'title': "驳回状态", "width": "8%", "classname": "selectable" },
            { 'title': "驳回理由", "width": "10%", "classname": "" },
            { 'title': "审核操作人", "width": "8%", "classname": "" },
            { 'title': "操作时间", "width": "12%", "classname": "" },
            { 'title': "操作", "width": "8%", "classname": "" }
        ],
        [ //index = 3，黑名单 95%
            { 'title': "checkbox_label", 'width': '5%', "classname": "clearfix" },
            { 'title': "序号", 'width': '5%', "classname": "" },
            { 'title': "用户编号", "width": "8%", "classname": "" },
            { 'title': "用户昵称", "width": "10%", "classname": "" },
            { 'title': "最近一次被禁原因", "width": "15%", "classname": "" },
            { 'title': "严重级别", "width": "8%", "classname": "" },
            { 'title': "审核操作人", "width": "7%", "classname": "" },
            { 'title': "驳回时间", "width": "15%", "classname": "" },
            { 'title': "黑名单失效时间", "width": "15%", "classname": "" },
            { 'title': "操作", "width": "8%", "classname": "" }
        ],
        [ //index = 4，历史黑名单 95%
            { 'title': "checkbox_label", 'width': '5%', "classname": "clearfix" },
            { 'title': "序号", 'width': '10%', "classname": "" },
            { 'title': "用户编号", "width": "20%", "classname": "" },
            { 'title': "用户昵称", "width": "20%", "classname": "" },
            { 'title': "被禁次数", "width": "20%", "classname": "" },
            { 'title': "操作", "width": "25%", "classname": "" }
        ],
        [ //index = 5，是否驳回 100%
            // { 'title': "", 'width': '', "classname": "" },
            { 'title': "&ensp;序号", 'width': '15%', "classname": "" },
            { 'title': "驳回原因", 'width': '35%', "classname": "" },
            { 'title': "严重等级", 'width': '22%', "classname": "" },
            { 'title': "操作时间", "width": "28%", "classname": "" }
        ]
    ],
    /**
     * [generateHtml 组装表格中一行记录的html代码，不包括操作图标和多选框]
     * @param  {[type]} data   [description]
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    generateHtml: function(data, column) {
        var index_ = 1,
            str_ = [];
        for (var key in data) {
            var value = data[key];
            var className = "nameEllipsis ";
            if (column[index_].sonClass) {
                className += column[index_].sonClass;
            }
            str_.push("<li style='width:" + column[index_].width + "' class='" + className + "' title='" + value + "'>" + value + "</li>");
            index_++;
        }
        return str_;
    },

    /**
     * [initTableHead 初始化表头]
     * @param  {number} index  [表头在columns中的索引]
     * @param  {$DOM} $dom     [jQuery对象，可选]
     * @return {[type]}        [description]
     */
    initTableHead: function(index, $head) {
        //获得在columns中索引为index的表格的表头定义
        var item = this.columns[index],
            length = item.length;

        //表头部分
        var $head = $head || $("div.listtitle");
        $head.html("");

        //一行的容器
        var $tr = $("<ul></ul>", {
            "class": "clearfix",
            css: {
                "margin-right": "16px"
            },
            selectstart: function() {
                return false;
            }
        });

        //全选的checkbox
        var checkbox = "<input type='checkbox' id='allSelect'/><label for='allSelect'></label>",
            str = "";
        for (var i = 0; i < length; i++) {

            //datas为每单个表头需要设置进去的属性和值
            var data = item[i].datas || {},
                dataStr = "";
            for (var key in data) {
                dataStr += (key + "=" + data[key]);
            }

            //当前这个表头的class名称
            var classname = item[i].classname;

            //生成title,如果是checkbox则内容为类checkbox，而不是真正的字符串数据
            var title = item[i].title == "checkbox_label" ? checkbox : item[i].title;

            //如果该表头包含sortable，则会根据该列进行排序
            if (classname.indexOf("sortable") > -1) {

                str += "<li " + dataStr + " style='width:" + item[i].width + "' class='sortableTh " + classname.replace("sortable", "") + "' >" +
                    "<a class='sortable' href='javascript:void(0)'>" + title + "</a>" +
                    "</li>";

                //如果该表头包含selectable类
                //会根据该列进行下拉选择框，则表头本身会加入样式selectableTh，里面的a会加入selectable样式
            } else if (classname.indexOf("selectable") > -1) {

                str += "<li " + dataStr + " style='width:" + item[i].width + "' class='selectableTh " + classname.replace("selectable", "") + "' >" +
                    "<a class='selectable' href='javascript:void(0)'>" + title + "</a>" +
                    "</li>";

                //普通表头
            } else {

                //如果class为空，则不设置样式属性
                if ($.trim(classname) == "") {
                    str += "<li " + dataStr + " style='width:" + item[i].width + "'>" + title + "</li>";
                } else {
                    str += "<li " + dataStr + " style='width:" + item[i].width + "' class='" + classname + "'>" + title + "</li>";
                }
            }
        }

        $tr.html(str).appendTo($head);
    },
    /**
     * [initPageBarTool 初始化分页条事件，使用此方法的页面必选加入page.js和page.css]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    initPageBarTool: function($tatget, option) {

        var $tablecontent = $tatget.parents("body").find("div.mainContent div.tableList");
        $(document).ajaxStart(function() {
                $tablecontent.html("").addClass("loadData");
            })
            .ajaxStop(function() {
                $tablecontent.removeClass("loadData");
            });

        option.data.pagenum = COMMON_GLOBAL.PAGE_SIZE;
        option.data.pageidx = 1;
        return $tatget.tPager("init",{
            scope:5,
            request:{
                        url: option.url,
                        data: option.data,
                        type: option.type,
                        stringify:option.isStringify ? false : undefined         
                    },
            // 正在分页中
            onPaging: function () {

            },
            onSuccess: function(res) {
                if (res.ret == 0) {
                    if (typeof option.success == "function") {

                        option.success(res,1);
                    }
                } else {
                    COMMON_FN.alertMsg(COMMON_FN.returnMsg(res));
                     // console.log(typeof res);
                }

            },
            error: function(xmlhttp, error, pagsIndex) {
                if (xmlhttp.statusText == "timeout") {
                    COMMON_FN.alertMsg(COMMON_GLOBAL.MESSAGE.SERVER_ERROR);
                    console.log("服务器异常！");
                } else {
                    console.log("请求被取消");
                }
            }
        });
       
    }
};

// 普通公共方法 
var COMMON_FN = {
    /**
     * [returnMsg 处理ajax返回信息]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    returnMsg: function(res) {
        if (typeof res == "string") {
            //如果token失效
            if (res == "9021") {

                setTimeout(function() {
                    top.$.cookie("accesstoken", null);
                    top.$.cookie("userid", null);
                    top.$.cookie("username", null);
                    top.window.location.href = (window == top ? loginUrl : "../" + loginUrl);
                }, COMMON_GLOBAL.DISPLAYTIME);

            }
            return COMMON_GLOBAL.ERROR_CODE[res] || "未定义的错误，请更新错误码";
        } else if (typeof res == "object") {
            if (res.ret + "" == "9021") {
                setTimeout(function() {
                    top.$.cookie("accesstoken", null);
                    top.$.cookie("userid", null);
                    top.$.cookie("username", null);
                    top.window.location.href = (window == top ? loginUrl : "../" + loginUrl);
                }, COMMON_GLOBAL.DISPLAYTIME);

            }
            return COMMON_GLOBAL.ERROR_CODE[res.ret] || "未定义的错误，请更新错误码";
        }
    },
    /**
     * [submitValidility 判断按钮能否再次点击，2次点击之间必须间隔COMMON_GLOBAL.CLICK_DURATION]
     * @param  {js object} that [description]
     * @return {[type]}      [description]
     */
    submitValidility: function(that) {

        //默认当前对象可点击，able表示可顶级，disable表示不可点击
        that.clickable = that.clickable || "able";
        var flag = null;

        //当前不可点击
        if (that.clickable != "able") {
            flag = false;

            //当前可点击，则设置clickable为disble，使COMMON_GLOBAL.CLICK_DURATION时间以内不可点击
        } else {
            that.clickable = "disable";
            flag = true;
        }
        clearTimeout(this.validtimeout);

        //一段时间之后使按钮可点击
        this.validtimeout = setTimeout(function() {
            that.clickable = "able";
        }, COMMON_GLOBAL.CLICK_DURATION);

        return flag;
    },

    /**
     * [alertMsg 弹出消息框 插件位于/plugins/tlayer]
     * @param  {string} msg    [消息]
     * @param  {number} width_ [弹出框的长度，可选]
     * @return {[type]}        [description]
     */
    alertMsg: function(msg, width_, fn) {

        $("div.layer-alert-box", top.document).remove();
        top.$.alert({
            context: top.document,
            zIndex: 999999999,
            onInit: function(layerID) {
                $(this).find(".layer-box-html").html(msg);
            },
            header: {
                buttons: [{
                    callback: function(layerID) {}
                }]
            },
            content: {
                height: "150px",
                html: msg,
                icon: "img/icon_tips.png"
            },
            width: width_ || "320px",
            footer: {
                buttons: [{
                    callback: function(layerID) {
                        if (typeof fn == "function") {
                            fn(layerID);
                        }
                    }
                }]
            }
        });
    },
    /**
     * [showMessage 弹出消息框，一段时间后消失，插件位于/plugins/tlayer]
     * @param  {string}   message  [消息]
     * @param  {number}   width_   [弹出框的长度，可选]
     * @param  {Function} callback [回调函数，可选]
     * @return {[type]}            [description]
     */
    showMessage: function(message, width_, callback) {
        $("div.layer-msg-box", top.document).remove();
        top.$.msg({
            context: top.document,
            zIndex: 99999999,
            content: {
                html: message,
                icon: "img/icon_tips.png",
                height: "100px"
            },
            width: width_ || "320px",
            delay: COMMON_GLOBAL.DISPLAYTIME,
            onClose: function() {
                if (callback) callback();
            }
        });
    },

    /**
     * [miniAjax 简易ajax，统一使用此ajax方法进行请求可以方便的管理返回值以及对数据进行处理]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    miniAjax: function(option) {
        var option_ = {
            url: option.url,
            type: option.type,
            cache: false,
            global: false,
            timeout: 30000,
            dataType: option.dataType || "json",
            success: function(res) {
                if (res.ret == 0 || res.ret == 10500) {
                    if (typeof option.fn == "function") {
                        option.fn(res);
                    }
                } else {
                    //如果执行不成功，则判断是否存在错误时的回调函数
                    if (typeof option.failcallback == "function") {
                        option.failcallback(res);
                    } else {
                        console.log(res);
                        COMMON_FN.alertMsg(COMMON_FN.returnMsg(res));
                    }
                }
            },
            error: function(xmlhttp, textStatus, errorThrown) {
                if (xmlhttp.statusText == "timeout") {
                    console.log("服务器异常！");
                } else {
                    console.log("请求被取消");
                }
            }
        };

        //如果是post请求，则需要加上accesstoken
        if (option.type.toLowerCase() == "post") {
            var data = option.data || {};
            data.accesstoken = accesstoken;
            option_.data = JSON.stringify(data);

        } else {
            //如果是get请求，则需要统一进行编码
            //同时去掉特殊字符单引号'，避免数据库因为单引号导致的读写不成功的问题

            var data = option.data || {};
            option_.data = data;

            option_.url = option_.url.replace(/\'/gi, "");
            option_.url = encodeURI(option_.url);
        }

        if (typeof option.contentType != "undefined") {
            option_.contentType = option.contentType;
        }

        $.ajax(option_);
    }
};

$(function() {
    //防止退格键导致的回退
    $("body").bind("keydown", function(e) {

        var which = BASE_UTIL.EVENT.getCharCode(e || window.event);
        var target = BASE_UTIL.EVENT.getEventTarget(e);
        var targetName = target.tagName.toLowerCase();

        if (which == 8 && !(targetName == "input" || targetName == "textarea")) {
            BASE_UTIL.EVENT.preventDefaultAction(eee);
        }
    });
});
