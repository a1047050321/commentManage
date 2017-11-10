var $onOffBtn = null,
    $detailBtn = null,

    tableIndex = 4; //在定义表格表头的数组中的位置
var searchPara = { //查询条件
    //1：黑名单，2：历史黑名单
    blacklistid: top.BLACKLISTID
};

$(function() {
   
    checkblacklistAlbe = $.inArray('34501',top.access) > -1;   //查看黑名单权限

    if(!checkblacklistAlbe){
        COMMON_FN.alertMsg("您没有查看黑名单的权限请联系管理员!","330px",function(){
        });
        return;
    }

    methods.init(tableIndex);
    $onOffBtn = $tools.find(".onOffBtn");
    $detailBtn = $tools.find(".detailBtn");

});

tableUtil.showList = function(res) {
    var str = "",
        column = TABLETOOL.columns[tableIndex],
        tempStorage = [],
        forbidItem = null,
        item = null;

    $tableList.html("<div class='nodatatips'>暂无数据</div>");

    //兼容 接口对于空数组返回null的情况
    res.user_list = res.user_list || [];

    tempStorage = res.user_list;

    for (var i = 0, length = tempStorage.length; i < length; i++) {
        item = tempStorage[i];
        forbidItem = item.forbid_list ? item.forbid_list[0]:{};
        //组装格式化后的数据
        var dataFormat = {
            userid: item.userid ? item.userid : 0,
            username: item.username ? item.username : "",
            forbidnum: forbidItem.forbidnum ? forbidItem.forbidnum : 0
        };

        var dataBase = {
                userid: item.userid ? item.userid : 0,
                username: item.username ? encodeURI(item.username) : "",
                forbidnum: forbidItem.forbidnum ? forbidItem.forbidnum : 0
            }
            //组装html代码
        var liLsit = TABLETOOL.generateHtml(dataFormat, column.slice(1));

        str = str + '<ul class="clearfix"  id="' + item.userid + '">' +
            '<li style="width:' + column[0].width + '" onselectstart="return false;" class="nameEllipsis nopop">' +
            '<input type="checkbox" index="' + i + '" id="id' + item.userid + '"/>' +
            '<label  for="id' + item.userid + '"></label>' +
            '</li>' +
            '<li style="width:' + column[1].width + '" class="nameEllipsis" title=' + (i + 1) + '>' + (i + 1) +
            '</li>' +
            liLsit.join('') +
            '<li style="width:' + column[column.length - 1].width + '" class="nameEllipsis nopop">' +
            '<a ' +
            'data-base=' + JSON.stringify(dataBase) +
            ' userid="' + item.userid +
            '" index="' + i +
            '" class="detailBtn btnActive" href="javascript:void(0);' +
            '" title="详情"><span></span>' +
            '</a>' +
            '</li>' +
            '</ul>';

    }

    $tableList.html(str);


};

/**
 * [detialUser 用户详情]
 * @return {[type]} [description]
 */
tableUtil.detialUser = function(opt){
        var para = "";
        for(var attr in opt){
            para += "&"+attr + "=" +opt[attr];
        }
        $.content({
             context: top.document,
             width: "520px",
             height: "380px",
             duration:0,
             header: {
                text: "用户详情"
            },
            content: {
                 src: "commentManage/userDetial.html?_index="+_index + para
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

    } else if (checkedlength == 1) {

        $detailBtn.addClass("btnActive");

    } else if (checkedlength > 1) {

        $detailBtn.removeClass("btnActive");
    }
}
