window.apiConfig = top.apiConfig;
window.COMMON_FN = top.COMMON_FN;
window.COMMON_GLOBAL = top.COMMON_GLOBAL;
window.TABLETOOL = top.TABLETOOL;
window.BASE_UTIL = top.BASE_UTIL;

var userid = BASE_UTIL.BASIC.getArgs(window.location.search, "userid");
var username = decodeURI(BASE_UTIL.BASIC.getArgs(window.location.search, "username"));
var forbidnum = BASE_UTIL.BASIC.getArgs(window.location.search, "forbidnum");
var operatorname = decodeURI(BASE_UTIL.BASIC.getArgs(window.location.search, "operatorname"));
var operatortime = decodeURI(BASE_UTIL.BASIC.getArgs(window.location.search, "operatortime"));
var validtime = decodeURI(BASE_UTIL.BASIC.getArgs(window.location.search, "validtime"));
var _index = BASE_UTIL.BASIC.getArgs(window.location.search, "_index");

var $userId = null;
var $userName = null;
var $commentSt = null;
var $forbidNum = null;
var $eidtor = null;
var $eidtorTime = null;
var $time = null;
var $userInfo = null;
var $editorInfo = null;

var $tableList = null;
var $listtitle = null;
var $contentWrap = null;

var forbidInfo = {}; //储存驳回信息
var tempStorage = [], //存储接口返回过来的原始数据
    tableIndex = 5; //在定义表格表头的数组中的位置

$(function() {
    init();
});

/**
 * [init 初始化变量，以及事件]
 * @return {[type]} [description]
 */
function init() {

    $userId = $("#userId-ifr");
    $userName = $("#userName-ifr");
    $commentSt = $("#status-ifr");
    $forbidNum = $("#forbidNum-ifr");
    $eidtor = $("#eidtor-ifr");
    $eidtorTime = $("#eidtorTime-ifr");
    $time = $('#time-ifr');
    $userInfo = $(".userInfo");
    $editorInfo = $(".editorInfo")


    $contentWrap = $("div.contentWrap");
    $tableList = $("div.tableList");
    $listtitle = $("div.listtitle");

    TABLETOOL.initTableHead(tableIndex, $listtitle);

    getUserInfo(userid);

}


/**
 * [getCommentInfo 获取评论信息,并将信息设置进表格]
 * @return {[type]} [description]
 */
function getUserInfo(userid, callBack) {

    //获取到评论信息则显示评论信息
    var d = new Date();
    var t = parseInt(d.getTime()/1000);
    if (userid && userid != "") {
        var switchstatus = "";
        if (_index == 3) {
            $editorInfo.show();
            switchstatus = "关闭";
            $("#status-ifr").val(switchstatus).prop("disabled", true);
        } else if (_index == 4) {
            $editorInfo.hide();
            commentUtil.getBlackCommentInfo(userid, function(res, id) {
                res.forbid_info = res.forbid_list ? (res.forbid_list[0] ? res.forbid_list[0].forbid_info : []) : [];
                res.forbid_info = res.forbid_info.length ? res.forbid_info[res.forbid_info.length - 1] : {};
                expirationtime = parseInt(res.forbid_info.expirationtime) || 0;
                if (expirationtime < t) {
                    switchstatus = "开启";
                }else{
                    switchstatus = "关闭";
                }
                $("#status-ifr").val(switchstatus).prop("disabled", true);
            },false);          
        }

        $("#userId-ifr").val(userid).prop("disabled", true);
        $("#userName-ifr").val(username).prop("disabled", true);       
        $("#forbidNum-ifr").val(forbidnum).prop("disabled", true);
        $("#eidtor-ifr").val(operatorname).prop("disabled", true);
        $("#eidtorTime-ifr").val(operatortime).prop("disabled", true);
        $("#time-ifr").val(validtime).prop("disabled", true);


        var str = "",
            column = TABLETOOL.columns[tableIndex],
            item = null;

        commentUtil.getUserCommentInfo(userid, function(res) {
            //兼容 接口对于空数组返回null的情况
            res.forbid_list = res.forbid_list || [];

            tempStorage = res.forbid_list;

            for (var i = 0, forbidLen = tempStorage.length; i < forbidLen; i++) {
                item = tempStorage[i];
                 var dataFormat = {
                        reason: COMMON_GLOBAL.FORBID_REASON[item.f_serious_leve + ""][item.f_forbid_reason + ""],
                        degree: item.f_serious_leve + "级",
                        time: item.f_operator_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.f_operator_time, "yyyy/MM/dd hh:mm") : ""
                    };
                //组装html代码
                var liLsit = TABLETOOL.generateHtml(dataFormat, column);

                str = str + "<ul class='clearfix' ' id='" + item.userid + "'>" +
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
    }
}
