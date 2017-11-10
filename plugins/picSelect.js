 function initSelect($container) {
     $container = $container || $(".picList");
     initFocusEvent($container);
 }

 function initFocusEvent($container) {
     var preClickId = 0;
     $container.off("click");
     $container.on({
         mouseenter: function(e) {
             e = e || window.event;
             var ishas = $(this).find(".imgfocus").hasClass("select");
             if (!ishas) {
                 $(this).find(".imgfocus").show();
                 $(this).find(".inputchecked").show();
             }
             $(this).find(".tool").show();
             e.stopPropagation();
         },
         mouseleave: function() {
             var ishas = $(this).find(".imgfocus").hasClass("select");
             if (!ishas) {
                 $(this).find(".imgfocus").hide();
                 $(this).find(".inputchecked").hide();
             }
             $(this).find(".tool").hide();
         },
         click: function(e) {
             e = e || window.event;
             var self = this;
             var $grounp = $container.find("li");
             var curImgIndex = $container.find("li").index(self);
             var isShow = $(self).find(".imgfocus").hasClass("select");
             if (isShow && e.ctrlKey) { //按住ctrl 多选
                 $(self).find(".imgfocus").removeClass("select");
                 $(self).find(".inputchecked span").removeClass("select");
                 $(self).find(".inputchecked input").prop("checked", false);
                 $(self).find(".imgfocus").show();
                 $(self).find(".inputchecked").show();
             } else if (!isShow && e.ctrlKey) {
                 $(self).find(".imgfocus").addClass("select");
                 $(self).find(".inputchecked span").addClass("select");
                 $(self).find(".inputchecked input").prop("checked", true);
                 $(self).find(".imgfocus").show();
                 $(self).find(".inputchecked").show();
             } else if (e.shiftKey) {
                 currSelectStartIndex = Math.min(preClickId, curImgIndex);
                 currSelectEndIndex = Math.max(preClickId, curImgIndex);
                 $(self).siblings().find(".imgfocus").removeClass("select");
                 $(self).siblings().find(".inputchecked span").removeClass("select");
                 $(self).siblings().find(".inputchecked input").prop("checked", false);
                 $(self).siblings().find(".imgfocus").hide();
                 $(self).siblings().find(".inputchecked").hide();

                 for (var i = currSelectStartIndex; i <= currSelectEndIndex; i++) {
                     $($grounp[i]).find(".imgfocus").addClass("select");
                     $($grounp[i]).find(".inputchecked span").addClass("select");
                     $($grounp[i]).find(".inputchecked input").prop("checked", true);
                     $($grounp[i]).find(".imgfocus").show();
                     $($grounp[i]).find(".inputchecked").show();
                 }
             } else {
                 if (isShow) {
                     $(self).siblings().find(".imgfocus").removeClass("select");
                     $(self).siblings().find(".inputchecked span").removeClass("select");
                     $(self).siblings().find(".inputchecked input").prop("checked", false);
                     $(self).siblings().find(".imgfocus").hide();
                     $(self).siblings().find(".inputchecked").hide();
                 } else {
                     $(self).siblings().find(".imgfocus").removeClass("select");
                     $(self).siblings().find(".inputchecked span").removeClass("select");
                     $(self).siblings().find(".inputchecked input").prop("checked", false);
                     $(self).siblings().find(".imgfocus").hide();
                     $(self).siblings().find(".inputchecked").hide();

                     $(self).find(".imgfocus").addClass("select");
                     $(self).find(".inputchecked span").addClass("select");
                     $(self).find(".inputchecked input").prop("checked", true);
                     $(self).find(".imgfocus").show();
                     $(self).find(".inputchecked").show();
                     preClickId = curImgIndex;
                 }

             }
             currSelectArr = [];
             $(".inputchecked input").each(function(_index) {
                 var checked = $(this).prop("checked");
                 if (checked) {
                     var _seriesid = $(this).parent().parent().parent().attr("id");
                     currSelectArr.push(_seriesid);
                 }
             });
             e.stopPropagation();
         }
     }, "li");


     $container.find("li div.inputchecked").unbind();
     $container.on({
         click: function(e) {
             e = e || window.event;
             var parentli = $(this).parent();
             parentli.find(".imgfocus").toggleClass("select");
             parentli.find(".inputchecked span").toggleClass("select");
             var checked = parentli.find(".inputchecked input").prop("checked");

             if (checked) {
                 parentli.find(".inputchecked input").prop("checked", false);
             } else {
                 parentli.find(".inputchecked input").prop("checked", true);
             }
             parentli.find(".imgfocus").show();
             parentli.find(".inputchecked").show();
             currSelectArr = [];
             $(".inputchecked input").each(function(_index) {
                 var checked = $(this).prop("checked");
                 if (checked) {
                     var _seriesid = $(this).parent().parent().parent().attr("id");
                     currSelectArr.push(_seriesid);
                 }
             });
             e.stopPropagation();
         }

     }, "li div.inputchecked");
 }
