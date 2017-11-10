;(function ($, window, undefined) {

    //把以下变量保存成局部变量
    var _top = top || window,
        document = window.document,
        navigator = window.navigator,
        location = window.location;

    $.extend( {
        cookie: _top.$.cookie
    } );

    //弹出框的方法
    var methods = {
        /**
         * 初始化tPager
         * @param  {Object} option  tPager参数设置
         * @return 无返回值
         */
        init: function (option) {
            
            var $wraper = $( this );
            
            // 获取 id
            var pageId = $wraper.attr( "id" ) || ("tPager_" + $.now());

            $wraper.attr( "id", pageId );
            option.pager = "#" + pageId;

            // 默认提供列表数量下拉选择框功能, option.select 为 false 时不提供
            if ( option.select !== false ) {
                option.select = $.extend( {
                    option: [ 20, 30, 50, 100 ],
                    unit: "个"
                }, option.select );

                // 由小到大排序
                option.select.option.sort( function ( a, b ) {
                    return a - b;
                } );

                var pageInfo = option.request.data,
                    // 获取分页请求接口
                    url = option.request.url,
                    // 获取 cookie 中的分页数据集合
                    pagenumCookie = JSON.parse( $.cookie( "pagenumCookie" ) || "{}" );

                    //一页数据量
                var pagenum = +(pagenumCookie[url] || pageInfo.pagenum || pageInfo.pagesize),
                    o = option.select.option;

                if ( o.length > 0 && $.inArray( pagenum, o ) == -1 && pagenum < o[o.length-1] ) {
                    pagenum = +(o[0]);

                    // 记录当前 url 对应的分页量到 cookie 中
                    pagenumCookie[ url ] = pagenum;
                    $.cookie( "pagenumCookie", JSON.stringify( pagenumCookie ) );
                }

                pageInfo.pagesize = pagenum;
                pageInfo.pagenum = pagenum;

            }
            
            $wraper.data("option", option);

            //生成分页导航HTML代码，并默认获取 pageidx 页的数据
            methods.getPage.call( this, option.request.data.pageidx, option );
            //tPager.loadPageNav( option );

            $wraper.undelegate();
            $wraper.delegate("a", {
                "click.pagenav": function (e) {
                    e = e || window.event;
                    var op = e.data.option;

                    var $wraper = $(op.pager);

                    //要获取的页码
                    var page = $(this).attr("data-pageidx");

                    methods.getPage.call($wraper, page, op);
                }
            }, {
                option: option
            }).delegate("input", {
                "keyup.pagenav": function (e) {
                    var e = e || window.event;
                    var code = e.which || e.keyCode;

                    if (code == 13) {

                        var op = e.data.option;

                        var $wraper = $(op.pager);

                        //要获取的页码
                        var page = $(this).val();

                        methods.getPage.call($wraper, $.trim(page), op);
                    }

                }
            }, {
                option: option
            }).delegate("select", {
                "change.pagenav": function (e) {
                    var e = e || window.event;

                    var op = e.data.option;

                    var $wraper = $(op.pager),
                        pagenum = +this.value;

                    var pageInfo = op.request.data,
                        // 获取分页请求接口
                        url = op.request.url,
                        // 获取 cookie 中的分页数据集合
                        pagenumCookie = JSON.parse( $.cookie( "pagenumCookie" ) || "{}" );;

                    // 要修改的每页数量
                    pageInfo.pagesize = pagenum;
                    pageInfo.pagenum = pagenum;

                    // 记录当前 url 对应的分页量到 cookie 中
                    pagenumCookie[url] = pagenum;
                    $.cookie( "pagenumCookie", JSON.stringify( pagenumCookie ) );

                    methods.getPage.call($wraper, 1, op);

                }
            }, {
                option: option
            });

            $wraper = null;

            return this;
        },
        pageNum: function () {

            var option = $( this ).data("option");

            return option ? option.request.data.pageidx : false;

        },
        /**
         * 获取某一页的数据
         * @param  {String|Int} page        页码
         * @param  {Object}     option      分页参数
         * @return 无返回值
         */
        getPage: function (page, option) {

            var $this = $( this );

            option = option || ($this.data("option"));
            
            var request = option.request.data,
                pageidx = request.pageidx,
                pagenum = request.pagenum;

            switch (page) {
                case "-1":
                case "+1":
                    pageidx = pageidx + (+page);
                    break;
                default :
                    pageidx = page;
                    break;
            }

            if (pageidx > 0 && ( !option.maxPage || pageidx <= option.maxPage)) {
                request.pageidx = +pageidx;
                util.runFunction( option.onPaging, $this );
                __public__.getData(option.request, function ( data ) {
                    var totalColumn = option.totalColumn || "total";
                    option.total = data[ totalColumn ] || 0;

                    if( pageidx > 1 && pagenum * (pageidx - 1) >= option.total ){// 判断当页数是否超过最大页数
                        pageidx = Math.ceil( option.total / pagenum );
                        methods.getPage( pageidx || 1, option );
                        return false;
                    }

                    if ( util.runFunction( option.loadData, $this, [ data, option.total ] ) === false ) {
                        return false;
                    }

                    pagerUtil.loadPageNav(option);
                    util.runFunction( option.onSuccess, $this, [ data ] );
                });
            }

            return this;
        }
        
    };

    //弹出框工具函数
    var pagerUtil = {
        /**
         * 生成分页导航HTML代码
         * @param  {Object} option 分页参数
         * @return {Object}        分页导航HTML代码
         */
        initPageNavHTML: function (option) {

            var pageInfo = option.request.data;

                //一页数据量
            var pagenum = pageInfo.pagenum || pageInfo.pagesize,
                //当前页码
                pageidx = pageInfo.pageidx,
                //总数据量
                total = option.total,
                // 分页下拉框
                select = option.select;

            //最大页码数
            var maxPage = Math.ceil(total/pagenum);

            var html = [];

            //首页和上一页, "1"->首页   "-1"->上一页
            if (pageidx == 1) {
                html.push('<span data-pageidx="1">首页</span>');
                html.push('<span data-pageidx="-1">上一页</span>');
            } else {
                html.push('<a href="javascript:void(0);" data-pageidx="1">首页</a>');
                html.push('<a href="javascript:void(0);" data-pageidx="-1">上一页</a>');
            }
  
            //起始分页位置
            var startPage = (pageidx - Math.ceil(option.scope/2));
                startPage = startPage > -1 ? startPage : 0;

            //结束分页位置
            var stopPage = (startPage + Math.min(maxPage, option.scope));

            //可分页页码，中间区域，根据scope来决定
            for (; startPage < stopPage && startPage < maxPage; startPage++) {
                var page = startPage+1;
                var nav = "";
                if (page === (+pageidx)) {
                    nav = '<span data-pageidx="'+page+'" class="current">'+page+'</span>';
                } else {
                    nav = '<a href="javascript:void(0);" data-pageidx="'+page+'">'+page+'</a>';
                }
                html.push(nav);
            }

            //下一页和末页, "+1"->下一页    mapPage->末页
            if (pageidx == maxPage || maxPage == 0) {
                html.push('<span data-pageidx="1">下一页</span>');
                html.push('<span data-pageidx="'+maxPage+'">末页</span>');
            } else {
                html.push('<a href="javascript:void(0);" data-pageidx="+1">下一页</a>');
                html.push('<a href="javascript:void(0);" data-pageidx="'+maxPage+'">末页</a>');
            }

            if (maxPage != 0) {
                html.push('<input type="text" />&nbsp;&nbsp;/&nbsp;<em class="maxPage">'+maxPage+'</em>&nbsp;页');
            }

            // 需要初始化分页下拉框
            if ( $.isPlainObject( select ) && select.option && select.option.length > 0 ) {

                // 下拉列表选项
                var o = select.option || [],
                    i = 0,
                    l = o.length,
                    v = null; // 选项的值

                if ( l > 0 ) {

                    html.push( '<select>' );

                    for ( ; i < l; i++ ) {
                        v = o[i];

                        html.push( '<option'+(v==pagenum?' selected="selected"':'')+' value="'+o[i]+'">'+o[i]+'&nbsp;'+(select.unit||'个')+'&nbsp;/&nbsp;页</option>' );
                    }

                    html.push( '</select>' );

                }

            }
            
            option.maxPage = maxPage;

            return '<div class="tpage-nav">'+html.join("")+'</div>';
        },
        /**
         * 生成页码导航
         * @param  {Object} option 分页参数
         * @return 无返回值
         */
        loadPageNav: function (option) {
            var $wraper = $(option.pager);

            //生成分页导航HTML代码
            $pageNav = $(this.initPageNavHTML(option));

            $wraper.data("tPager", option);

            $wraper.html($pageNav);

            return this;
        }
    };

    /**
     * iHomed公用函数
     */
    var __public__ = {
        /**
         * 获取数据
         * @param  {Object}     options 数据参数
         * @param  {Function}   fn      获取数据成功后的回调
         * @return 无返回
         */
        getData: function (options, fn) {
            var _this = this;

            //发送请求前执行
            util.runFunction(options.beforeSend);
            
            if (!options.url) { $.error("请求地址不存在！"); }

            // 自动判断 url 的请求类型
            var type = options.url.split( "_" )[0].toUpperCase();

            // 标准的请求方式
            if ( util.inArray( type, [ "GET", "POST" ] ) == -1 ) {
                type = null;
            }

            //转换大写
            options.type = options.type ? options.type.toUpperCase() : ( type ? type : "GET" );

            //转换大写
            options.type = options.type ? options.type.toUpperCase() : "GET";

            // 设置默认请求 data 参数
            options.data = options.data || {};

            // 是否去掉 key 中的下划线，默认去掉
            options.rmunderline = options.rmunderline !== undefined ? options.rmunderline : true;

            // if ( options.rmunderline ) {

            //     //去除data中key带有的下划线
            //     options.data = util.rmUnderline(options.data);

            // }
            
            if (!options.data.accesstoken) {
                //设置请求数据中的accesstoken
                options.data.accesstoken = methods.data( "token" );
            }

            // 是否使用 JSON.stringify 转换 options.data 为字符串，默认转换
            options.stringify = options.stringify !== undefined ? options.stringify : true;

            var ajaxSettings = $.extend({}, options, {
                success: function (data) {
                    console.log(data);
                    if(typeof data == "string"){
                        data = JSON.parse(data);
                    }

                    //data = util.rmUnderline(data);
                    //执行默认回调
                    util.runFunction(fn, options, [data]);
                    
                    if (options.jQ && options.jQ.length > 0) {
                        //执行用户自定义回调
                        util.runFunction(options.success, options.jQ[0], [data]);
                    } else {
                        //执行用户自定义回调
                        util.runFunction(options.success, [data]);
                    }
                },
                //默认超时时间
                timeout: options.timeout || 20000,
                data: options.type == "POST" && options.stringify ? JSON.stringify(options.data) : options.data,
                url: options.url,
                error: util.isFunction(options.error) ? options.error : function () {},
                complete: util.isFunction( options.complete ) ? options.complete : function () {}
            });

            $.ajax(ajaxSettings);
        },
        /**
         * 保存数据
         * @param  {Object}     options 数据参数
         * @param  {Function}   fn      保存数据成功后的回调
         * @return 无返回
         */
        setData: function (options, fn) {
            var _this = this;

            //发送请求前执行
            util.runFunction(options.beforeSend);
            
            if (!options.url) { $.error("请求地址不存在！"); }

            // 设置默认请求 data 参数
            options.data = options.data || {};

            // 是否去掉 key 中的下划线，默认去掉
            options.rmunderline = options.rmunderline !== undefined ? options.rmunderline : true;

            // if ( options.rmunderline ) {

            //     //去除data中key带有的下划线
            //     options.data = util.rmUnderline(options.data);

            // }
            
            // 自动判断 url 的请求类型
            var type = options.url.split( "_" )[0].toUpperCase();

            // 标准的请求方式
            if ( util.inArray( type, [ "GET", "POST" ] ) == -1 ) {
                type = null;
            }

            //转换大写
            options.type = options.type ? options.type.toUpperCase() : ( type ? type : "GET" );
            
            // 是否使用 JSON.stringify 转换 options.data 为字符串，默认转换
            options.stringify = options.stringify !== undefined ? options.stringify : true;

            if (!options.data.accesstoken) {
                //设置请求数据中的accesstoken
                options.data.accesstoken = methods.data( "token" );
            }
            
            var ajaxSettings = $.extend({}, options, {
                success: function (data) {

                    //去除data中key带有的下划线
                    //data = util.rmUnderline(data);

                    //执行默认回调
                    util.runFunction(fn, options, [data]);
                    //执行用户自定义回调
                    util.runFunction(options.success, [data]);
                },
                //默认超时时间
                timeout: options.timeout || 20000,
                data: options.type == "POST" && options.stringify ? JSON.stringify(options.data) : options.data,
                url: options.url,
                error: util.isFunction(options.error) ? options.error : function () {}
            });

            //请求的data数据
            var data = options.data;
            
            //将数据中的&nbsp;改回空格
            for (var i in data) {
                if (data.hasOwnProperty(i) && typeof data[i] === "string") {
                    data[i] = util.nbsp2space(data[i]);
                }
            }

            $.ajax(ajaxSettings);
        }
    };

    //公用工具函数
    var util = {
        /**
         * 获取变量的类型
         * @param  {各类型} variable 变量
         * @return {String}          返回变量的类型, 如：number, array, function, object等
         */
        typeOf: function (variable) {
            var type = Object.prototype.toString.call(variable);
            return ((/\[object\s+(.*)\]/ig).exec(type)[1]).toLowerCase();
        },
        /**
         * 判断元素是否存在数组中
         * @param  {各种类型} item 要判断的元素
         * @param  {array}    arr  被判断的数组
         * @return {boolean}       返回布尔值
         */
        inArray: function (item, arr) {
            if ($.inArray) {
                return $.inArray(item, arr);
            } else {
                for (var i = arr.length-1; i > -1; i--) {
                    if (arr[i] == item) {
                        return i;
                    }
                }
                return -1;
            }
        },
        /**
         * 判断fn是否存在并且是一个函数
         * @param  {Function}  fn 函数名
         * @return {Boolean}       返回布尔值
         */
        isFunction: function (fn) {
            return $.isFunction( fn );
        },
        /**
         * 如果fn为函数则运行该函数
         * @param  {Function}  fn       函数名
         * @param  {Object}    thisObj  函数的当前对象
         * @param  {Array}     args     函数参数
         * @return 无返回
         */
        runFunction: function (fn, thisObj, args) {
            if (this.isFunction(fn)) {
                var argus = arguments,
                    argsl = argus.length;

                //如果函数的参数列表存在1个参数
                if (argsl == 1) {
                    return fn.apply(window);
                }

                //如果函数的参数列表存在2个参数
                if (argsl == 2) {
                    if (this.typeOf(thisObj) == "array") {
                        return fn.apply(window, thisObj);
                    } else {
                        return fn.apply(thisObj);
                    }
                }

                //如果函数的参数列表存在3个参数
                if (argsl == 3) {
                    return fn.apply(thisObj || window, args);
                }
            }
        },
        /**
         * 转换json对象成字符串，并去掉所有key中的下划线_
         * @param  {Object} json json对象
         * @return {String}      返回json字符串
         */
        json2StringWAU: function ( json ) {

            if ( !json ) {
                return json;
            }

            return JSON.stringify(json).replace(/"(\w*?)":/ig, function (m,p1) {
                return '"'+p1.replace(/_/g, "")+'":';
            });
        },
        /**
         * 转换json对象成字符串，并去掉一级key中的下划线_
         * @param  {Object} json json对象
         * @return {String}      返回json字符串
         */
        json2StringWU: function (json) {

            if ( !json ) {
                return json;
            }

            return JSON.stringify(json).replace(/"([A-Za-z0-9]*)_([A-Za-z0-9]*)":/ig, '"$1$2":');
        },
        /**
         * 删除所有的 key 中的下划线，并返回 json 对象
         * @param  {Object} json json 对象
         * @return {Object}      新的 json 对象
         */
        rmUnderline: function (json) {

            if ( !json ) {
                return json;
            }

            return $.parseJSON(util.json2StringWAU(json));
        }
    };
    
    $.fn.tPager = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ( typeof method === "object" || !method ) {
            return methods.init.call( this, method );
        } else {
            $.error("不存在"+method+"方法！");
        }
    };

} (jQuery, window, undefined));