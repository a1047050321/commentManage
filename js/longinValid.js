// 请先配置以下各项，很重要

var CONFIG = {

    // Homed 后台登录地址

    loginurl: "http://boss.homed.me/login.html",

    // 系统 id

    systemid: 34,

    // 系统名称

    systemname: "评论管理系统",

    // 是否为开发模式，默认为 true ; true 为不用登录即可进入系统，否则必须登录

    dev: true,

    // 开发模式下的默认账户 ID

    userid: "1000072", //1000137调试 1000072开发

    // 开发模式下的默认令牌 

    username: "黄荣",



    token: "TOKEN1000072",

    // 开发模式下的默认用户角色: 1.超级管理员，2.系统管理员，3.普通用户

    role: 2,

    // 页面初始定位

    nav: null,

    // 默认版权适用设备，取值参见下面的版权适用设备列表

    defaultdevice: "1",

};



// 保存 CONFIG 信息到 kernel 中

iHomed("config", CONFIG);



/**

 * 立即执行，判断是否登录

 */

(function() {



    if (!CONFIG.dev && $.cookie("userid") == null) {



        iHomed("logout");



    } else {



        // 保存用户ID userid

        iHomed.data("userid", $.cookie("userid") || CONFIG.userid);



        // 保存用户令牌 accesstoken

        iHomed.data("token", $.cookie("accesstoken") || CONFIG.token);



        // 尝试获取用户角色 role

        var role = $.cookie("role");



        if (role) {



            // 转整型

            role = +role;



            //兼容后台数据异常

            if (role > 3 || role < 1) { role = CONFIG.role; }



        }



        // 保存用户角色 role

        iHomed.data("role", role || CONFIG.role);



        // 回收变量

        role = null;



    }



}());

