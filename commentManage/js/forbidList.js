var $delBtn = null,
    $detailBtn = null,

    tableIndex = 2; //在定义表格表头的数组中的位置

var searchPara = { //查询条件
    //filter用来过滤 0：全部【默认】，1：人工驳回，2：敏感词驳回
    displayList: "forbid",
    peoplereview: top.peoplereview,
    m: "index",
    a: "getList"
};

$(function() {
    checkAlbe = $.inArray('34001',top.access) > -1;         //查看评论权限
    eidtAlbe = $.inArray('34002',top.access) > -1;         // 编辑评论权限
    
    if(!checkAlbe){
        COMMON_FN.alertMsg("您没有查看评论的权限请联系管理员!","330px",function(){
        });
        return;
    }
    
    methods.init(tableIndex);

    $delBtn = $tools.find(".delBtn");
    $detailBtn = $tools.find(".detailBtn");

    //如果没有权限，则删除操作按钮   
    if(!eidtAlbe){
        $delBtn.remove(0);
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
            comment_id: item.comment_id || item.f_comment_id,
            program_id: item.program_id || item.f_program_id,
            user_id: item.user_id || item.f_user_id,
            reject: item.f_operator_id != 0 ? "人工驳回" : "敏感词驳回",
            reason: item.f_reject_desc || "含有敏感词",
            editor_name: "&ensp;&ensp;"+item.f_operator_name || "",
            time: item.f_operator_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.f_operator_time, "yyyy/MM/dd hh:mm") : "",
        };

        //组装html代码
        var liLsit = TABLETOOL.generateHtml(dataFormat, column.slice(1));

        str = str + "<ul class='clearfix'  id='" + dataFormat.comment_id + "'>" +
            "<li style='width:" + column[0].width + "' onselectstart='return false;' class='nameEllipsis nopop'>" +
            "<input type='checkbox' index='" + i + "' id='id" + dataFormat.comment_id + "'/>" +
            "<label  for='id" + dataFormat.comment_id + "'></label>" +
            "</li>" +
            "<li style='width:" + column[1].width + "' class='nameEllipsis' title=" + (i + 1) + ">" + (i + 1) +
            "</li>" +
            liLsit.join('') +
            "<li style='width:" + column[column.length - 1].width + "' class='nameEllipsis nopop marginL'>" +
            "<a " +
            " commentid='" + dataFormat.comment_id +
            "' index='" + i +
            "' class='detailBtn btnActive' href='javascript:void(0);" +
            "' title='详情'><span></span>" +
            "</a>" +
            "<a " +
            " commentid='" + dataFormat.comment_id +
            "' index='" + i +
            "' class='delBtn btnActive' href='javascript:void(0);" +
            "' title='删除'><span></span>" +
            "</a>" +
            "</li>" +
            "</ul>";

    }

    $tableList.html(str);
    //如果没有权限，则删除操作按钮
    if(!eidtAlbe){
        $tableList.find('.delBtn.btnActive').remove(0);
    }

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
        $delBtn.removeClass("btnActive");
        $detailBtn.removeClass("btnActive");

    } else if (checkedlength == 1) {

        $delBtn.addClass("btnActive");
        $detailBtn.addClass("btnActive");

    } else if (checkedlength > 1) {

        $detailBtn.removeClass("btnActive");
        $delBtn.addClass("btnActive");

    }
}
