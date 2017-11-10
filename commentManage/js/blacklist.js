window.COMMON_GLOBAL = top.COMMON_GLOBAL;

var $onOffBtn = null,
    $detailBtn = null,

    tableIndex = 3; //在定义表格表头的数组中的位置
var searchPara = { //查询条件
    //1：黑名单，2：历史黑名单
    blacklistid: top.BLACKLISTID
};

$(function() {
    checkblacklistAlbe = $.inArray('34501',top.access) > -1;   //查看黑名单权限
    eidtblacklistAlbe = $.inArray('34502',top.access) > -1;  //放在这里面保证权限列表已经取到
    
    if(!checkblacklistAlbe){
        COMMON_FN.alertMsg("您没有查看黑名单的权限请联系管理员!","330px",function(){
        });
        return;
    }

    methods.init(tableIndex);

    $onOffBtn = $tools.find(".onOffBtn");
    $detailBtn = $tools.find(".detailBtn");

    //如果没有权限，则删除操作按钮   
    if(!eidtblacklistAlbe){
        $onOffBtn.remove(0);
    }
});

tableUtil.showList = function(res) {
    var str = "",
        column = TABLETOOL.columns[tableIndex],
        forbidItem = null,
        tempStorage = [],
        dataFormat = {},
        temp = null,
        item = null;
    //兼容 接口对于空数组返回null的情况
    res.user_list = res.user_list || [];
    if(res.user_list.length == 0){
        $tableList.html("<div class='nodatatips'>暂无数据</div>");
    }else{
        for (var i = 0, length = res.user_list.length; i < length; i++) {
            item = res.user_list[i];
            forbidItem = item.forbid_list ? item.forbid_list[0]:{};
            dataFormat = {
                userid: item.userid,
                username: item.username,
                reason: forbidItem.forbidlevel  ? COMMON_GLOBAL.FORBID_REASON[forbidItem.forbidlevel + ""][forbidItem.forbidreasonid + ""] : "",
                degree: forbidItem ? (forbidItem.forbidlevel + "级") : "",
                operatorname: forbidItem ? forbidItem.operatorname : "",
                operatortime: forbidItem.operatortime,
                expirationtime:forbidItem.expirationtime,
                forbidnum:forbidItem.forbidnum
            }
              tempStorage.push(dataFormat);          
         }
         tempStorage.sort(function(a, b) { return a.expirationtime > b.expirationtime ?1 : -1;} );
        
        for (var i = 0, length = tempStorage.length; i < length; i++) {
            
            //组装格式化后的数据
            dataFormat = tempStorage[i];
            dataFormat.operatortime = dataFormat.operatortime ? BASE_UTIL.BASIC.getDateStrFrmt(dataFormat.operatortime, "yyyy/MM/dd hh:mm") : "0",
            dataFormat.expirationtime = dataFormat.expirationtime ? BASE_UTIL.BASIC.getDateStrFrmt(dataFormat.expirationtime, "yyyy/MM/dd hh:mm") : "0"
            var dataBase = {
                    userid: dataFormat.userid,
                    username: encodeURI(dataFormat.username),
                    forbidnum: dataFormat.forbidnum,
                    operatorname: encodeURI(dataFormat.operatorname),
                    operatortime: encodeURI(dataFormat.operatortime),
                    validtime: encodeURI(dataFormat.expirationtime)
                }
            delete dataFormat.forbidnum;
                //组装html代码
            var liLsit = TABLETOOL.generateHtml(dataFormat, column.slice(1));
    
            str = str + '<ul class="clearfix"  id="' + dataFormat.userid + '">' +
                '<li style="width:' + column[0].width + '" onselectstart="return false;" class="nameEllipsis nopop">' +
                '<input type="checkbox" index="' + i + '" id="id' + dataFormat.userid + '"/>' +
                '<label  for="id' + dataFormat.userid + '"></label>' +
                '</li>' +
                '<li style="width:' + column[1].width + '" class="nameEllipsis" title=' + (i + 1) + '>' + (i + 1) +
                '</li>' +
                liLsit.join('') +
                '<li style="width:' + column[column.length - 1].width + '" class="nameEllipsis nopop">' +
                '<a ' +
                'data-base=' + JSON.stringify(dataBase) +
                ' userid="' + dataFormat.userid +
                '" index="' + i +
                '" class="detailBtn btnActive" href="javascript:void(0);' +
                '" title="详情"><span></span>' +
                '</a>' +
                '<a ' +
                ' userid="' + dataFormat.userid +
                '" index="' + i +
                '" class="onOffBtn btnActive" href="javascript:void(0);' +
                '" title="开关"><span></span>' +
                '</a>' +
                '</li>' +
                '</ul>';
        }
        $tableList.html(str);
    }
     
    //如果没有权限，则删除操作按钮
    if(!eidtblacklistAlbe){
        $tableList.find('.onOffBtn.btnActive').remove(0);
    }

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
        $onOffBtn.removeClass("btnActive");

    } else if (checkedlength == 1) {
        $onOffBtn.addClass("btnActive");
        $detailBtn.addClass("btnActive");

    } else if (checkedlength > 1) {
        $onOffBtn.addClass("btnActive");
        $detailBtn.removeClass("btnActive");
    }
}

