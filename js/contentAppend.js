var method = {

    /**
     * [contentAppend 初始化页面导航和iframe]
     * @return {[type]} [description]
     */
    contentAppend: function(data) {
        var $treeList = $("#treeList"),
            $position = $(".currInfo"),
            $coniframe = null;

        var menuStr = "",
            secondNavData = $.extend([], data);
        //动态生成二级导航菜单
        for (var i = 0, len = secondNavData.length; i < len; i++) {

            menuStr = menuStr +
                "<li>" +
                " <a href='" + secondNavData[i].url + "' target='coniframe' class='" + secondNavData[i].cssName + "'>" +
                secondNavData[i].name +
                "</a>" +
                " </li>";

        }
        $treeList.html("<ul>" + menuStr + "</ul>");

        $coniframe = $("#coniframe", window.document),

            //事件监听
            $treeList.on({
                click: function() {
                    $treeList.find(".secondMenuFocus:first").removeClass("secondMenuFocus");
                    $(this).addClass("secondMenuFocus");

                    $coniframe.show(0);

                    var text = $(this).find("a").text().replace(" ", "");
                    $position.text("当前位置：" + top.navName + "/" + text);
                }
            }, "li");

        $treeList.find("li:eq(0)").addClass("secondMenuFocus");
        $treeList.find("li a:eq(0)").get(0).click();
    }
}
