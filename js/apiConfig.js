/*配置接口的信息*/
/*浏览器兼容：ff，chrome*/
top.accessAddr = top.globalDnsConfigVar.accessAddr;
top.dtvAddr = top.globalDnsConfigVar.dtvAddr;
top.slaveAddr = top.globalDnsConfigVar.slaveAddr;
top.homedsAddr = top.globalDnsConfigVar.homedsAddr;
top.domainDNS = top.globalDnsConfigVar.uCookieDomain;
top.homePageUrl = top.globalDnsConfigVar.homePageAddr;

// 目前在用的access dtv  slave
var access = top.accessAddr + "/";
var homeds = top.homedsAddr + "/";
var dtv = top.dtvAddr + "/";
var slave = top.slaveAddr + "/";


var apiConfig = {
    loginUrl: top.homePageUrl + "/login.html", //登录页面
    getUserRight: access + "usermanager/user/get_right_list", //获取用户权限
    getUserInfo: access + "usermanager/user/get_info", //获取用户信息
    userLogout: access + "usermanager/logout",

    getCommentList: "../commentApi/index.php", //获取评论列表
    operaComment: "../commentApi/index.php", //评论系统的系列操作,API由php提供
    sensitiveForbid: "commentApi/index.php", //评论系统的系列操作,API由php提供,给index使用，改一下相对路径
    addBlackuser: access + "usermanager/terminaluser/blacklist/add_user", //用户被禁，成为黑名单用户
    deleteBlackuser: access + "usermanager/terminaluser/blacklist/delete_user", //用户解禁，成为黑名单用户
    getBlackuserList: access + "usermanager/terminaluser/blacklist/get_user_list", //获取当前黑名单
    getHistoryBlackuserList: access + "usermanager/terminaluser/blacklist/get_history_user_list", //获取历史黑名单
    getSetting: dtv + "homed/system/get_parameter", //获取系统设置
    setSetting: dtv + "homed/system/set_parameter", //设置系统设置参数
    getBlackuserInfo: access + "usermanager/terminaluser/blacklist/get_user_info", //获取指定用户详细历史统计数据
    // getSetting: "http://192.168.36.109:12890/homed/system/get_parameter", //获取系统设置
    // setSetting: "http://192.168.36.109:12890/homed/system/set_parameter", //设置系统设置参数
    SERVER_VERSIN: "19.168.36.101"
}
