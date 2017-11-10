var topFrame = top || window,
    topDoc = topFrame.document,
    // 获取页面中 mainFrame 窗口
    _mainFrame = topFrame.frames["mainFrame"],
    globalDnsConfigVar = topFrame.globalDnsConfigVar;

//用户id
var USERID = iHomed.data("userid"),
    //身份令牌
    TOKEN = iHomed.data("token"),

    BLACKLISTID = [10001];

//获取生成的导航
var $iNav = null;
var navName = null;
var access = [];


getParameter(getUserinfo);

// 获取用户信息，并初始化系统菜单
function getUserinfo() {
    iHomed("userinfo", {
        data: {
            accesstoken: TOKEN,
            userid: USERID,
            systemid: CONFIG.systemid
        },
        success: function(data) {

            // 获取用户角色
            var role = iHomed.data("role");

            /**
             * 初始化系统导航菜单列表
             */
            // 普通用户系统导航菜单列表
            var userMenus = [
                { name: "评论管理", url: "commentManager.html" },
                { name: "黑名单", url: "userManager.html" },
                // {name:"操作记录",url:"operateLog/index.html?systemid=34&token="+TOKEN}
            ];
            // 系统管理员导航菜单列表
            var adminMenus = [
                { name: "系统设置", url: "systemSetting/setting.html" },
                { name: "权限管理", url: "access.html" }
            ];

            userMenus[0].current = true;

            //获取权限
            iHomed("access", {
                data: {
                    accesstoken: TOKEN,
                    systemid: CONFIG.systemid
                },
                success:function(data){
                    var arrAcess = iHomed('access') || {};
                    for(var attr in arrAcess){
                        access.push(attr);
                    }
                    access.pop();
                    top.access = access;
                    //console.log(access);
                }
            });

            // 生成顶部导航栏和底部信息栏
            $("#header").iNav({
                // 系统ID
                systemID: CONFIG.systemid,
                // 接口返回的用户信息
                userInfo: data,
                // 系统模块
                module: {
                    /// 用户可操作的模块列表
                    userlist: userMenus,
                    // 仅管理员可操作的模块列表
                    adminlist: adminMenus,
                    // 显示模块的iframe
                    frame: _mainFrame,
                    // 切换后的回调函数,可不设置
                    callback: function(menu) {
                        // 刷新权限列表
                        $iNav = $(".inav-module").find("span.current");
                        navName = $iNav.html();                      
                    },
                },
                // 首页底部标签ID
                footerID: "footer",
            });
        }
    });
}

/**
 * [getParameter 获取系统敏感词审核未通过是否需要人工审核参数]
 * @return {[type]} [description]
 */
function getParameter(fn) {
    var dataJson = {
        accesstoken: TOKEN,
        systemid: top.system_id
    }
    $.ajax({
        url: apiConfig.getSetting,
        type: 'post',
        cache: false,
        async: true,
        timeout: 5000,
        dataType: 'json',
        data: JSON.stringify(dataJson),
        success: function(res) {

            if (res.ret == 0 || res.ret_msg == "success") {

                var paraList = res.parameter_list || [];
                //在顶层窗口保存是否需要人工审核敏感词未通过的评论
                for (var i = 0, len = paraList.length; i < len; i++) {
                    if (paraList[i].id == "34005") {
                        top.peoplereview = paraList[i].value;
                    }
                }


            }
            if (fn) fn();
        },
        error: function() {
            top.openPopupTips("获取系统参数失败", false);
            top.peoplereview = 0;
            if (fn) fn();
        }
    });
}

function sensitiveForbid(callback) {
    var   dataJson = {
            accesstoken: TOKEN,
            m: "index",
            a: "sensitiveForbid"
        };

    $.ajax({
        url: apiConfig.sensitiveForbid,
        dataType: "json",
        type: 'POST',
        data: dataJson,
        success: function(data) {
            //通过成功
            if (data.ret == 0) {
               
                if (callback) {
                    callback();
                 }
                
            } else {
                COMMON_FN.alertMsg(data.ret_msg);
            }
        },
        error: function() {
            COMMON_FN.alertMsg("服务器异常！");
        }
    });
}
// 当该 js 到这里时立即执行以下操作
(function(window) {

    // 设置系统 index.html 的 title 标签的内容
    $("title").html(CONFIG.systemname);

    function changeHeight() {
        var height = $(window).height();
        var width = $(window).width();
        $("#cover").css("height", height + "px");
        $(".ifrcontainer").css("height", height - 81 + "px");
        $(".nav ul.syslist").css("maxHeight", height - 81 + "px");
    }

    //边框改变事件
    window.onresize = function() {
        changeHeight();
    }
    changeHeight();
    //$(".currentYear").text(new Date().getFullYear());
}(window));
