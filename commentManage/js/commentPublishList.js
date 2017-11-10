var $forbidBtn = null,
    $detailBtn = null,

    tableIndex = 1; //在定义表格表头的数组中的位置

var searchPara = { //查询条件
    //0：全部【默认】，1：未受理，2：受理完成
    displayList: "public",
    m: "index",
    a: "getList"
};


$(function() {
    checkAlbe = $.inArray('34001',top.access) > -1;         //查看评论权限

    if(!checkAlbe){
        COMMON_FN.alertMsg("您没有查看评论的权限请联系管理员!","330px",function(){
        });
        return;
    }

    methods.init(tableIndex);

    // $forbidBtn = $tools.find(".forbidBtn");
    $detailBtn = $tools.find(".detailBtn");

    //如果没有权限，则删除操作按钮   
    if(!verifyAble){
        $forbidBtn.remove(0);
    }

});


tableUtil.showList = function(res) {
    var str = "",
        column = TABLETOOL.columns[tableIndex],
        item = null;

    $tableList.html("<div class='nodatatips'>暂无数据</div>");

    //兼容 接口对于空数组返回null的情况
    res.comment_list = res.comment_list || [];

    tempStorage = res.comment_list;

    for (var i = 0, length = tempStorage.length; i < length; i++) {
        item = tempStorage[i];

        //组装格式化后的数据
        var dataFormat = {
            comment_id: item.comment_id,
            program_id: item.program_id,
            user_id: item.user_id,
            editor_name: "&ensp;"+item.f_operator_name,
            time: item.f_operator_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.f_operator_time, "yyyy/MM/dd hh:mm") : "",
            time1: item.comment_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.comment_time, "yyyy/MM/dd hh:mm") : "",
            praise: "&ensp;&ensp;&ensp;&ensp;"+item.praise
        };
        //组装data-base的参数
        var dataBase = {
                commentid: item.comment_id ? item.comment_id : "0",
                commentcontent: item.content ? encodeURI(item.content) : "",
                userid: item.user_id
            }
            //组装html代码
        var liLsit = TABLETOOL.generateHtml(dataFormat, column.slice(1));

        str = str + "<ul class='clearfix'  id='" + item.comment_id + "'>" +
            "<li style='width:" + column[0].width + "' onselectstart='return false;' class='nameEllipsis nopop'>" +
            "<input type='checkbox' index='" + i + "' id='id" + item.comment_id + "'/>" +
            "<label  for='id" + item.comment_id + "'></label>" +
            "</li>" +
            "<li style='width:" + column[1].width + "' class='nameEllipsis' title=" + (i + 1) + ">" + (i + 1) +
            "</li>" +
            liLsit.join('') +
            "<li style='width:" + column[column.length - 1].width + "' class='nameEllipsis nopop marginL'>" +
            "<a " +
            " commentid='" + item.comment_id +
            "' index='" + i +
            "' class='detailBtn btnActive' href='javascript:void(0);" +
            "' title='详情'><span></span>" +
            "</a>" +
            "</li>" +
            "</ul>";

    }

    $tableList.html(str);
    //如果没有权限，则删除操作按钮  
    if(!verifyAble){
        $tableList.find('.forbidBtn.btnActive').remove(0);
    }
    //驳回暂时不做
    //  "<a " +
    // "data-base=" + JSON.stringify(dataBase) +
    // " commentid='" + item.comment_id +
    // "' index='" + i +
    // "' class='forbidBtn btnActive' href='javascript:void(0);" +
    // "' title='驳回'><span></span>" +
    // "</a>" +
}

/**
 * [detialComent 评论详情]
 * @return {[type]} [description]
 */
tableUtil.detialComment = function(commentid) {
    $.content({
        context: top.document,
        width: "450px",
        height: "210px",
        duration: 0,
        header: {
            text: "评论详情"
        },
        content: {
            src: "commentManage/commentDetial.html?commentid=" + commentid + "&_index=" + tableIndex
        },
    });
}


/**
 * [initToolBar 初始化工具栏的按钮状态]
 * @return {[type]} [description]
 */
function initToolBar() {
    var $checkboxs = $tableList.find("input:checkbox:checked"),
        checkedlength = $checkboxs.length;

    if ($tableList.find("input:checkbox").length == checkedlength && checkedlength != 0) {

        $allSelect.prop("checked", true);

    } else {
        $allSelect.prop("checked", false);
    }

    if (checkedlength == 0) {
        $detailBtn.removeClass("btnActive");
        // $forbidBtn.removeClass("btnActive");

    } else if (checkedlength == 1) {
        // $forbidBtn.addClass("btnActive");
        $detailBtn.addClass("btnActive");

    } else if (checkedlength > 1) {
        // $forbidBtn.removeClass("btnActive");
        $detailBtn.removeClass("btnActive");
    }
}
