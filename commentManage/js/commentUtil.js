//评论的相关工具类
var accesstoken = top.TOKEN,
    userid = top.USERID;
var commentUtil = {
    /**
     * [deleteComment 删除选中的评论]
     * @param  {list} list [评论id列表，只有一个评论也算是列表]
     * @return {[type]}    [description]
     */
    deleteComment: function(list, callback) {
        var callee = arguments.callee,
            dataJson = {
                accesstoken: accesstoken,
                commentid: list[0],
                m: "index",
                a: "deleteComment"
            };

        $.ajax({
            url: apiConfig.operaComment,
            dataType: "json",
            type: 'post',
            data: dataJson,
            success: function(data) {
                // 删除成功或者查询失败都做删除成功操作
                if (data.ret == 0 || data.ret == 3) {
                    list.shift();

                    //继续进行删除
                    if (list && list.length > 0) {
                        callee(list, callback);

                        //全部删除完成
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    COMMON_FN.alertMsg(data.ret_msg);
                }
            },
            error: function() {
                COMMON_FN.alertMsg("服务器异常！");
            }
        });
    },
    /**
     * [passComment 通过评论]
     * @param  {list} list [评论id列表，只有一个评论也算是列表]
     * @return {[type]}      [description]
     */
    passComment: function(list, callback) {
        var callee = arguments.callee,
            dataJson = {
                accesstoken: accesstoken,
                commentid: list[0],
                operid: userid,
                m: "index",
                a: "passComment"
            };

        $.ajax({
            url: apiConfig.operaComment,
            dataType: "json",
            type: 'POST',
            data: dataJson,
            success: function(data) {
                //通过成功
                if (data.ret == 0) {
                    list.shift();

                    //继续进行通过
                    if (list && list.length > 0) {
                        callee(list, callback);

                        //全部通过完成
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    COMMON_FN.alertMsg(data.ret_msg);
                }
            },
            error: function() {
                COMMON_FN.alertMsg("服务器异常！");
            }
        });
    },
    /**
     * [forbidComment 驳回评论]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    forbidComment: function(data, callback) {
        if (!data.commentid) {
            return;
        }

        data.accesstoken = accesstoken;
        data.m = "index";
        data.a = "forbidComment";
        data.operid = userid;
        $.ajax({
            url: apiConfig.operaComment,
            type: 'post',
            dataType: "json",
            data: data,
            success: function(res) {

                if (res.ret == 0) {
                    if (callback) {
                        callback(res);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function() {
                COMMON_FN.alertMsg("服务器异常！");
            }
        });
    },
    /**
     * [getcommentInfo 获取评论信息]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getcommentInfo: function(id, callback) {
        if (!id) {
            return;
        }
        var dataJson = {
            accesstoken: accesstoken,
            commentid: id,
            m: "index",
            a: "getinfo",
        };
        $.ajax({
            url: apiConfig.operaComment,
            type: 'post',
            dataType: "json",
            data: dataJson,
            success: function(res) {

                if (res.ret == 0) {
                    if (callback) {
                        callback(res, id);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function(xmlttp, error) {

                if (error == 'timeout') {
                    COMMON_FN.alertMsg("服务器异常！");
                } else if (error == 'error') {
                    console.log("请求被取消");
                }

            }
        });
    },
    /**
     * [postTwoId 给库里面传两个id]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    postTwoId: function(data, callback) {
        var dataJson = {
            accesstoken: accesstoken,
            commentid: data.commentid,
            programid: data.programid
        };
        $.ajax({
            url: apiConfig.postTwoId,
            type: 'post',
            dataType: "json",
            data: JSON.stringify(dataJson),
            success: function(res) {
                if (res.ret == 0) {
                    if (callback) {
                        callback(res);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function(xmlttp, error) {

                if (error == 'timeout') {
                    COMMON_FN.alertMsg("服务器异常！");
                } else if (error == 'error') {
                    console.log("请求被取消");
                }

            }
        });
    },
    /**
     * [getBlackCommentInfo 获取用户历史评论信息]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getBlackCommentInfo: function(id, callback,isasync) {
        if (!id) {
            return;
        }
        var dataJson = {
            accesstoken: accesstoken,
            userid: id,
            blacklistid:top.BLACKLISTID
        };
        $.ajax({
            url: apiConfig.getBlackuserInfo,
            type: 'post',
            dataType: "json",
            data: JSON.stringify(dataJson),
            async:isasync != null ? isasync : true,
            success: function(res) {
                //成功，或者userid不在黑名单库中都执行成功操作
                if (res.ret == 0 || res.ret == 9201) {
                    if (callback) {
                        callback(res, id);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function(xmlttp, error) {

                if (error == 'timeout') {
                    COMMON_FN.alertMsg("服务器异常！");
                } else if (error == 'error') {
                    console.log("请求被取消");
                }

            }
        });
    },
    /**
     * [getUserCommentInfo 获取用户历史评论信息]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getUserCommentInfo: function(id, callback) {
        if (!id) {
            return;
        }
        var dataJson = {
            accesstoken: accesstoken,
            user_id: id,
            m:"index",
            a:"getUserRecord"
        };
        $.ajax({
            url: apiConfig.operaComment,
            type: 'post',
            dataType: "json",
            data: dataJson,
            success: function(res) {

                if (res.ret == 0 || res.ret == 3) {
                    if (callback) {
                        callback(res, id);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function(xmlttp, error) {

                if (error == 'timeout') {
                    COMMON_FN.alertMsg("服务器异常！");
                } else if (error == 'error') {
                    console.log("请求被取消");
                }

            }
        });
    },
    /**
     * [blackuserOpen 开启黑名单]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    blackuserOpen: function(forbidInfo, callback) {
        if (!forbidInfo.userid) {
            return;
        }
        var dataJson = $.extend({}, forbidInfo);
        dataJson.accesstoken = accesstoken;
        dataJson.blacklistid = top.BLACKLISTID;
        $.ajax({
            url: apiConfig.addBlackuser,
            type: 'post',
            dataType: "json",
            data: JSON.stringify(dataJson),
            success: function(res) {

                if (res.ret == 0) {
                    if (callback) {
                        callback(res);
                    }
                } else {
                    COMMON_FN.alertMsg(res.ret_msg);
                }

            },
            error: function(xmlttp, error) {

                if (error == 'timeout') {
                    COMMON_FN.alertMsg("服务器异常！");
                } else if (error == 'error') {
                    console.log("请求被取消");
                }

            }
        });
    },
    /**
     * [blackuserClose 关闭黑名单]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    blackuserClose: function(list, callback) {
        var callee = arguments.callee,
            dataJson = {
                accesstoken: accesstoken,
                userid: list,
                blacklistid: top.BLACKLISTID
            };

        $.ajax({
            url: apiConfig.deleteBlackuser,
            dataType: "json",
            type: 'post',
            data: JSON.stringify(dataJson),
            success: function(data) {
                // 开启成功
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

};
