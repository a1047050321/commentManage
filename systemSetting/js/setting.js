window.apiConfig     = top.apiConfig;
window.COMMON_FN     = top.COMMON_FN;
window.COMMON_GLOBAL = top.COMMON_GLOBAL;
window.TABLETOOL     = top.TABLETOOL;
window.BASE_UTIL     = top.BASE_UTIL;

var parameter = ["34001","34002","34004"];
var btns = ["34005","34006",'34007','34008'];
var parameterList = [];
var eidtsettingAlbe = $.inArray('34503',top.access) > -1;         //编辑黑名单权限
$(function(){
	var data = 	{
			accesstoken:top.TOKEN,
			systemid:top.system_id,
		};
		
	$.ajax({			//获取系统设置的参数
		url:apiConfig.getSetting,
		type:"POST",
		data:JSON.stringify(data),
		success:function(data){
			if(data.ret == 0){
				parameterList = data.parameter_list || parameterList;
				var splicenum = 0;
				for(var i = 0,len = parameterList.length; i < len;i++){
					if($.inArray(parameterList[i].id,parameter) != -1){
						$("#" + parameterList[i].id).val($.trim(parameterList[i].value));
					}else if($.inArray(parameterList[i].id,parameter) == -1 && $.inArray(parameterList[i].id,btns) == -1){
						splicenum = i;
					}
					if($.inArray(parameterList[i].id,btns) != -1){
						if(parameterList[i].value == 0){
							$("#" + parameterList[i].id).removeClass("btnActive");
						}else{
							$("#" + parameterList[i].id).addClass("btnActive");
						}
					}					
				}
				parameterList.splice(splicenum,1);
				console.log(parameterList);
				console.log(splicenum);
				parameterList.sort(function(a, b) { return a.id > b.id ?1 : -1;} );

				if($('#34007').hasClass("btnActive")){
					$('#autoCheck').show();
				}else{
					$('#autoCheck').hide();
				}
			}else{
				COMMON_FN.showMessage(data.ret_msg);
			}
		},
		error: function(res){
		 	COMMON_FN.showMessage("服务器异常！");
		 }
	});
	
	for(var i = 0,len = parameter.length; i < len; i++){
		$("#" + parameter[i]).attr("index",i);
		$("#" + parameter[i]).on({
			blur: function(e){
				var self = $(this);
				var num = $.trim(self.val());
				var id_ = $.trim(self.attr("id"));
				var index_ = self.attr("index");
				if(num == ""){
					return;
				}
				
				if(num == parameterList[index_].value){
					return;
				}

				if(!eidtsettingAlbe){
				    COMMON_FN.alertMsg("您没有设置系统参数的权限请联系管理员!","330px",function(){
				    });
				    return;
				}
				
				data = {
					accesstoken:top.TOKEN,
					systemid:top.system_id,					
					parameter_list:[{
					   id: id_,
					   value:num					   
					}]
				},
				$.confirm({
	                context: top.document,
	                zIndex: 300,
	                content: {
	                	height:'150px;',
	                    html: "确定要更改设置？",
	                    icon: "img/icon_tips.png"
	                },
	                footer: {
	                    buttons: [{
	                        callback: function(layerID) {
	                        	 
	                            $.ajax({
	                            	url:apiConfig.setSetting,
	                            	type:"POST",
	                            	data:JSON.stringify(data),
	                            	success:function(data){
	                            		if(data.ret == 0){
	                            			COMMON_FN.showMessage("设置成功!");
	                            			parameterList[index_].value = num;
	                            		}else{
	                            			COMMON_FN.showMessage("设置失败!");
	                            			self.val(parameterList[index_].value);
	                            		}
	                            	},
	                            	error:function(){
	                            		COMMON_FN.showMessage("服务器异常！");
	                            		self.val(parameterList[index_].value);
	                            	}
	                            });
	                        }
	                    }, {
	                        callback: function(layerID) {	                
	                        	self.val(parameterList[index_].value);
	                        }
	                    }]
	                }
	            });
			}	
		});
	}

	for(var i = 0,len = btns.length; i < len; i++){
		$("#" + btns[i]).on({
			click:function(){

				if(!eidtsettingAlbe){
				    COMMON_FN.alertMsg("您没有设置系统参数的权限请联系管理员!","330px",function(){
				    });
				    return;
				}
				var self = $(this);
				var id_ = $.trim(self.attr("id"));
				var num = null;

				if(self.hasClass("btnActive")){
					self.removeClass("btnActive");
					num = "0";
				}else{
					self.addClass("btnActive");
					num = "1";
				}
				data = {
						accesstoken:top.TOKEN,
						systemid:top.system_id,
						parameter_list:[{
						   id: id_,
						   value:num						    
						}]
				};
				$.ajax({
					url:apiConfig.setSetting,
					type:"POST",
					data:JSON.stringify(data),
					success:function(data){
						if(data.ret == 0){
							COMMON_FN.showMessage("设置成功!");
							if(id_ == "34005"){
								top.peoplereview = num;
								if(top.peoplereview == 1){		//在开启开关前把敏感词不通过的评论加入驳回表
								    top.sensitiveForbid();
								}
							}else if(id_ == 34007){
								if($('#34007').hasClass("btnActive")){
									$('#autoCheck').show();
								}else{
									$('#autoCheck').hide();
								}
							}
						}else{
							COMMON_FN.showMessage("设置失败!");
						}
					},
					error:function(){
						COMMON_FN.showMessage("服务器异常！");
					}
				});
			}
		});
	}
});

			