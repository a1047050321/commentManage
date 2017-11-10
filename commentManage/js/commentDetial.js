window.apiConfig = top.apiConfig;
window.COMMON_FN = top.COMMON_FN;
window.COMMON_GLOBAL = top.COMMON_GLOBAL;
window.TABLETOOL = top.TABLETOOL;
window.BASE_UTIL = top.BASE_UTIL;

var commentid = BASE_UTIL.BASIC.getArgs(window.location.search, "commentid");
var commentcontent = decodeURI(BASE_UTIL.BASIC.getArgs(window.location.search, "commentcontent"));
var _index = BASE_UTIL.BASIC.getArgs(window.location.search, "_index");
var _userid = BASE_UTIL.BASIC.getArgs(window.location.search, "userid");

var $commentId = null;
var $commentContent = null;
var $detial = null;
var $detialInfo = null;
var $forbidInfo = null;
var $forbidReason = null;
var $severityLevel = null;
var $tableList = null;
var $listtitle = null;
var $contentWrap = null;

var forbidInfo = {}; //储存驳回信息
var tempStorage = [], //存储接口返回过来的原始数据
    tableIndex = 5; //在定义表格表头的数组中的位置

var commentStatus = ["未审核", "已发布", "已驳回"];

$(function() {
    init();
});

/**
 * [init 初始化变量，以及事件]
 * @return {[type]} [description]
 */
function init() {

    $commentId = $("#commentId-ifr");
    $commentContent = $("#commentContent");
    $detial = $("#detial");
    $detialInfo = $(".detialInfo"); //评论详情里面的详情
    $forbidInfo = $(".forbidInfo");
    $forbidReason = $(".forbidReason");
    $severityLevel = $('.severityLevel');

    $contentWrap = $("div.contentWrap"); //是否驳回中的用户信息
    $tableList = $("div.tableList");
    $listtitle = $("div.listtitle");

    $detialInfo.hide(); //详情默认是关闭的

    if (_index == 5) { //是否驳回弹窗

        TABLETOOL.initTableHead(tableIndex, $listtitle);
        $detial.find("span").html("该用户曾被驳回一览表");
        $contentWrap.show();

    } else {

        $contentWrap.hide();
        $detial.find("span").addClass("close").html("详情");
        var ifrheight = $(".layer-box-inner", parent.document).height();
        var heightTy = $(".layer-box-content-inner", parent.document).height();
        $detial.on({
            click: function() {
                var $this = $(this);
                if ($this.hasClass('open')) {
                    $detialInfo.hide();
                    $this.removeClass('open');
                    $this.addClass('close');
                    $(".layer-box-inner", parent.document).css("height", ifrheight);
                    $(".layer-box-content-inner", parent.document).css("height", heightTy);
                } else {
                    $detialInfo.show();
                    $this.removeClass('close');
                    $this.addClass('open');
                    $(".layer-box-inner", parent.document).css("height", ifrheight + 150);
                    $(".layer-box-content-inner", parent.document).css("height", heightTy + 150);
                    $(".layer-box-wraper",parent.document).css("overflow","hidden");
                }
            }
        }, "span");
    }

    //点击单个单选框
    $severityLevel.on({
        click: function() {
            var index_ = parseInt($(this).attr("id"));
            var str = "<dt>驳回原因选择:</dt>";

            for (var i in COMMON_GLOBAL.FORBID_REASON[index_ + ""]) {
                str += "<dd><input type='radio' name='reason' id='" + i + "re'><label for='" + i + "re'>" + COMMON_GLOBAL.FORBID_REASON[index_ + ""][i] + "</label></dd>";
            }
            $forbidReason.html(str);
            $forbidReason.find("input:radio").eq(0).prop("checked", true);
        }
    }, "input:radio");


    getCommentInfo(commentid);
}


/**
 * [getCommentInfo 获取评论信息,并将信息设置进表格]
 * @return {[type]} [description]
 */
function getCommentInfo(commentid, callBack) {

    //获取到评论信息则显示评论信息
    if (commentid && commentid != "") {


        $commentId.val(commentid).prop("disabled", true).attr("title",commentid);

        if (_index == 5) {

            $commentContent.val(commentcontent).prop("disabled", true);
            var str = "",
                column = TABLETOOL.columns[tableIndex],
                item = null;

            commentUtil.getUserCommentInfo(_userid, function(res, id) {
                //兼容 接口对于空数组返回null的情况

                res.forbid_list = res.forbid_list || [];

                tempStorage = res.forbid_list;

                for (var i = 0, length = tempStorage.length; i < length; i++) {
                    item = tempStorage[i];
                    var dataFormat = {
                        reason: COMMON_GLOBAL.FORBID_REASON[item.f_serious_leve + ""][item.f_forbid_reason + ""],
                        degree: item.f_serious_leve + "级",
                        time: item.f_operator_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.f_operator_time, "yyyy/MM/dd hh:mm") : ""
                    };
                    //组装html代码
                    var liLsit = TABLETOOL.generateHtml(dataFormat, column);

                    str = str + "<ul class='clearfix' >" +
                        '<li style="width:' + column[0].width + '" class="nameEllipsis" title=' + (i + 1) + '>' +'&ensp;&ensp;'+ (i + 1) +
                        '</li>' +
                        liLsit.join('') +
                        "</ul>";
                }
                if (str) {
                    $tableList.html(str);
                } else {
                    $tableList.html("<div class='nodatatips'>暂无数据</div>");
                }

            });

        } else {
            var html = "";
            if (_index == 0) { //终端提交的评论详情
                html = "<colgroup>" +
                    "<col width='15%' />" +
                    "<col width='35%' />" +
                    "<col width='15%' />" +
                    "<col width='35%' />" +
                    "<colgroup>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td>用&ensp;户&ensp;id:</td>" +
                    "<td>" +
                    "<input id='userId-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>用&ensp;户&ensp;名:</td>" +
                    "<td>" +
                    "<input id='userName-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>节&ensp;目&ensp;id:</td>" +
                    "<td>" +
                    "<input id='programeId-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>节目名称:</td>" +
                    "<td>" +
                    "<input id='programeName-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>评论状态</td>" +
                    "<td>" +
                    "<input id='commentStatu-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>评论时间:</td>" +
                    "<td>" +
                    "<input id='commentTime-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>评论来源:</td>" +
                    "<td>" +
                    "<input id='commentFrom-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tbody>";
            } else if (_index == 1 || _index == 2) { //已提交和已驳回的评论详情
                html = "<colgroup>" +
                    "<col width='13%' />" +
                    "<col width='19%' />" +
                    "<col width='13%' />" +
                    "<col width='21%' />" +
                    "<col width='13%' />" +
                    "<col width='21%' />" +
                    "<colgroup>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td>用&ensp;户&ensp;id:</td>" +
                    "<td>" +
                    "<input id='userId-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>用&ensp;户&ensp;名:</td>" +
                    "<td>" +
                    "<input id='userName-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>被赞次数:</td>" +
                    "<td>" +
                    "<input id='good-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>节&ensp;目&ensp;id:</td>" +
                    "<td>" +
                    "<input id='programeId-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>节目名称:</td>" +
                    "<td>" +
                    "<input id='programeName-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>回复次数:</td>" +
                    "<td>" +
                    "<input id='replay-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<td>评论状态</td>" +
                    "<td>" +
                    "<input id='commentStatu-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>评论时间:</td>" +
                    "<td>" +
                    "<input id='commentTime-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>评论来源:</td>" +
                    "<td>" +
                    "<input id='commentFrom-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>操作人id:</td>" +
                    "<td>" +
                    "<input id='editorId-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>操作人名:</td>" +
                    "<td>" +
                    "<input id='editorName-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "<td>操作时间:</td>" +
                    "<td>" +
                    "<input id='editorTime-ifr' type='text' class='nameEllipsis'>" +
                    "</td>" +
                    "</tr>" +
                    "<tbody>";

                if (_index == 2 || _index == 1) {
                    $forbidInfo.hide();
                }
            }
            $detialInfo.html(html);
            commentUtil.getcommentInfo(commentid, function(res) {
                var data = res.commentinfo || {};
                var contentInfo = {};
                contentInfo.content = data.content || data.f_content;
                contentInfo.userid = data.user_id || data.f_user_id;
                contentInfo.username = data.user_name;
                contentInfo.programeId = data.program_id || data.f_program_id;
                contentInfo.programeName = data.f_program_name;
                contentInfo.commentTime = data.comment_time || data.f_comment_time;
                contentInfo.commentSource = data.comment_source || data.f_comment_source;
                contentInfo.praise = data.praise || data.f_praise_num;
                contentInfo.replay = data.f_repeat_num || data.f_reply_num || 0;
                contentInfo.editorId = data.f_operator_id || 0;
                contentInfo.editorName = data.f_operator_name || "敏感词词库";
                contentInfo.editorTime = data.f_operator_time || data.comment_time;
                $commentContent.val(contentInfo.content).prop("disabled", true);
                $("#userId-ifr").val(contentInfo.userid).prop("disabled", true).attr("title", contentInfo.userid);
                $("#userName-ifr").val(contentInfo.username).prop("disabled", true).attr("title", contentInfo.username);
                $("#programeId-ifr").val(contentInfo.programeId).prop("disabled", true).attr("title", contentInfo.programeId);
                $("#programeName-ifr").val(contentInfo.programeName).prop("disabled", true).attr("title", contentInfo.programeName);
                $("#commentStatu-ifr").val(commentStatus[_index]).prop("disabled", true);
                $("#commentTime-ifr").val(BASE_UTIL.BASIC.getDateStrFrmt(contentInfo.commentTime, "yyyy/MM/dd hh:mm")).prop("disabled", true).attr("title", BASE_UTIL.BASIC.getDateStrFrmt(contentInfo.commentTime, "yyyy/MM/dd hh:mm"));
                $("#commentFrom-ifr").val(COMMON_GLOBAL.COMMENT_SOURCE[contentInfo.commentSource + ""]).prop("disabled", true).attr("title",COMMON_GLOBAL.COMMENT_SOURCE[contentInfo.commentSource + ""]);
                if (_index == 1 || _index == 2) {
                    $("#good-ifr").val(contentInfo.praise).prop("disabled", true);
                    $("#replay-ifr").val(contentInfo.replay).prop("disabled", true);
                    $("#editorId-ifr").val(contentInfo.editorId).prop("disabled", true).attr("title", contentInfo.editorId);
                    $("#editorName-ifr").val(contentInfo.editorName).prop("disabled", true).attr("title", contentInfo.editorName);
                    $("#editorTime-ifr").val(BASE_UTIL.BASIC.getDateStrFrmt(contentInfo.editorTime, "yyyy/MM/dd hh:mm")).prop("disabled", true).attr("title", BASE_UTIL.BASIC.getDateStrFrmt(contentInfo.editorTime, "yyyy/MM/dd hh:mm"));
                }
            });
        }


    }
}


/**
 * [getInfo 点击确定获取驳回信息]
 * @return {json} [驳回信息]
 */
function getInfo() {
    var d = new Date();
    var t = d.getTime();
    var data = {};
    data.accesstoken = top.accesstoken;
    data.commentid = commentid;
    data.forbidreason = parseInt($forbidReason.find('input:radio:checked').attr("id"));
    data.seriouslevel = parseInt($severityLevel.find('input:radio:checked').attr("id"));
    data.reson = COMMON_GLOBAL.FORBID_REASON[data.seriouslevel + ""][data.forbidreason + ""];

    return data;
}
