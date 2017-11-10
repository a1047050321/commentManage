var $passBtn = null,

    $forbidBtn = null,

    $detailBtn = null,



    tableIndex = 0, //在定义表格表头的数组中的位置

    contentTimer = null; //评论内容的定时器



var searchPara = { //查询条件

    //filter用来过滤 0：全部【默认】，1：通过，2：未通过

    displayList: "comment",

    peoplereview: top.peoplereview,

    m: "index",

    a: "getList"

};



$(function() {

    verifyAble = $.inArray('34003',top.access) > -1;        //审核评论权限

    checkAlbe = $.inArray('34001',top.access) > -1;         //查看评论权限

    

    if(!checkAlbe){

        COMMON_FN.alertMsg("您没有查看评论的权限请联系管理员!","330px",function(){

        });

        return;

    }



    methods.init(tableIndex);

    $passBtn = $tools.find(".passBtn");

    $forbidBtn = $tools.find(".forbidBtn");

    $detailBtn = $tools.find(".detailBtn");



    //如果没有权限，则删除操作按钮   

    if(!verifyAble){

        $forbidBtn.remove(0);

        $passBtn.remove(0);

    }

   



    $(".hoverReactT").hover(function() {

        clearTimeout(contentTimer);

         // $(".hoverReactT").show();

    }, function() {

        contentTimer = setTimeout(function() {

            $(".hoverReactT").hide();

        }, 500)

    });



    $(".tableList").delegate("li.comment_content","mouseover",function(){

        clearTimeout(contentTimer);

        var self = $(this);

        var rectLeft = self.offset().left;

        var rectTop = self.offset().top + 20;

        // var maxTop = $(".tableList").height()-20;

        // console.log(rectTop);

        // console.log(maxTop);

        // if(rectTop >= maxTop){

        //     rectTop = maxTop;

        // }

        $(".hoverReactT").show();

        $(".hoverReactT").css({ left: rectLeft, top: rectTop });

        $(".commentHover").html(self.html());

    });



    $(".tableList").delegate("li.comment_content","mouseout",function(){

        contentTimer = setTimeout(function() {

            $(".hoverReactT").hide();

        }, 500)

    });

});



tableUtil.showList = function(res) {
    console.log(res);

    var str = "",
        column = TABLETOOL.columns[tableIndex],
        item = null;
        $tableList.html("<div class='nodatatips'>暂无数据</div>");
        //兼容 接口对于空数组返回null的情况
        res.comment_list = res.comment_list || [];
        tempStorage = res.comment_list;
        if(tempStorage,length == 0){
            $tableList.html("<div class='nodatatips'>暂无数据</div>");
        }else{
            for (var i = 0, length = tempStorage.length; i < length; i++) {
                
                item = tempStorage[i];
                //组装格式化后的数据
        
                var dataFormat = {
        
                    commentid: item.comment_id,
        
                    time: item.comment_time ? BASE_UTIL.BASIC.getDateStrFrmt(item.comment_time, "yyyy/MM/dd hh:mm") : "",
        
                    status: item.f_status == 0 ? "&ensp;&ensp;已通过" : "&ensp;&ensp;未通过"
        
                };
        
                //组装data-base的参数
        
                var dataBase = {
        
                    commentid: item.comment_id ? item.comment_id : "0",
        
                    commentcontent: item.content ? encodeURI(item.content) : null,
        
                    userid: item.user_id ? item.user_id : "0"
        
                }
                //组装评论内容
        
                var sensiWord = item.f_sensitive_content ? item.f_sensitive_content.split(" ") : [];
        
                var commentContent = item.content || "";
        
                var rsingleTag = /<\/?(\w+)\s*\/?>/g;
        
                    commentContent = commentContent.replace(rsingleTag,function($1,$2){
        
                        return '&lt;' + $2 + '&gt;';
        
                    });
        
                for (var k = 0, lenSen = sensiWord.length; k < lenSen; k++) {
        
                    if(sensiWord[k])
        
                    {
        
                        var strCom = "<font color='red'>" + sensiWord[k] + "</font>";
        
                        var re = new RegExp(sensiWord[k], "g");
        
                        commentContent = commentContent.replace(re, strCom);
        
                    }
                }
        
                var comHtml = commentContent;
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
                    "<li style='width:" + column[column.length - 2].width + "' class='comment_content nameEllipsis'>" +
                    comHtml +
                    "</li>" +
                    "<li style='width:" + column[column.length - 1].width + "' class='nameEllipsis nopop'>" +
                    "<a " +
                    " commentid='" + item.comment_id +
                    "' index='" + i +
                    "' class='passBtn btnActive" + "' href='javascript:void(0);' " +
                    " title='通过'><span></span>" +
                    "</a>" +
                    "<a " +
                    "data-base=" + JSON.stringify(dataBase) +
                    " commentid='" + item.comment_id +
                    "' index='" + i +
                    "' class='forbidBtn btnActive' href='javascript:void(0);" +
                    "' title='驳回'><span></span>" +
                    "</a>" +
        
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
        }
    //如果没有权限，则删除操作按钮

    if(!verifyAble){

        $tableList.find('.forbidBtn.btnActive').remove(0);

        $tableList.find('.passBtn.btnActive').remove(0);

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

        $passBtn.removeClass("btnActive");

        $detailBtn.removeClass("btnActive");

        $forbidBtn.removeClass("btnActive");



    } else if (checkedlength == 1) {

        $forbidBtn.addClass("btnActive");

        $passBtn.addClass("btnActive");

        $detailBtn.addClass("btnActive");



    } else if (checkedlength > 1) {

        $forbidBtn.removeClass("btnActive");

        $detailBtn.removeClass("btnActive");

        $passBtn.addClass("btnActive");



    }

}

