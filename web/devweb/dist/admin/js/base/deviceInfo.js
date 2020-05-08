$(function() {
    	var model = {
		path : adminContextPath +
		resetDataForm : function() {"/base/deviceInfo",
			$("#data-form").bootstrapValidator('resetForm', true);
			//表单默认值可以在这里设置
			way.set("model.form.data",null);
		},
		getFormData : function() {
			var data =  way.get("model.form.data");
			return data?data:{};
		},
		setFormTitle : function(title) {
			way.set("model.form.title", title);
		},
		tableRefresh : function() {
			$('#table').bootstrapTable("refresh");
		},
		setFormDataById:function(id){
			$.get(this.path + "/get.do",{id:id},function(respone){
				way.set("model.form.data",respone.data);
			})
		},
		setViewDataById:function(id){
			$.get(this.path + "/get.do",{id:id},function(respone){
				way.set("model.view",respone.data);
				    way.set("model.view.id",$.getDictName('zj',respone.data.id));
				    way.set("model.view.code",$.getDictName('bhao',respone.data.code));
				    way.set("model.view.name",$.getDictName('mcheng',respone.data.name));
				    way.set("model.view.descInfo",$.getDictName('bzhu',respone.data.descInfo));
				    way.set("model.view.inserttime",$.getDictName('crsj',respone.data.inserttime));
			})
		},
		init:function(){//需要初始化的功能
		}
	};
	model.init();
	// 校验
	$("#data-form").bootstrapValidator().on("success.form.bv", function(e) {// 提交
		e.preventDefault();
		
		var id = model.getFormData().id;
		var optUrl = model.path + "/save.do";
		if (id) {
			optUrl = model.path + "/update.do";
		}
		$.post(optUrl, $("#data-form").serialize(), function(respone) {
			if (respone.responeCode == '0') {
				layer.msg("保存成功");
				model.tableRefresh();
				$("#form-panel").modal('toggle');
			}
		});
	});
	/**
	 * 查看
	 */
	$("body").on("click", ".view", function() {
		var id = $(this).data("id");
		model.setViewDataById(id);
		$('#modal-view').modal('toggle');
	});
	// 查询
	$("#search").click(function() {
		model.tableRefresh();
	});
	// 添加
	$("#add").click(function() {
		model.resetDataForm();
		model.setFormTitle("<i class='fa fa-plus'>添加</i>");
		$("#form-panel").modal('toggle');
	});
	// 编辑
	$("#edit").click(function() {
		var rows = $('#table').bootstrapTable("getSelections");
		if (rows.length == 0) {
			layer.msg("请选择一行");
		} else {
			model.resetDataForm();
			model.setFormDataById(rows[0].id);
			model.setFormTitle("<i class='fa fa-edit'>编辑</i>");
			$("#form-panel").modal('toggle');
		}
	});
	// 删除
	$("#delete").click(function() {
		var rows = $('#table').bootstrapTable("getSelections");
		if (rows.length == 0) {
			layer.msg("请选择一行");
		} else {
			layer.confirm('确定删除？', {
				shadeClose : true,
				icon : 3,
				anim : 6,
				btn : [ '确定', '取消' ]
			// 按钮
			}, function() {
				$.post(model.path  + "/delete.do", {
					id : rows[0].id
				}, function(respone) {
					if (respone.responeCode == "0") {
						layer.msg("删除成功");
						model.tableRefresh();
					} 
				});
			});
		}
	});
	// 列表
	$('#table').bootstrapTable({
		url : model.path + '/qryPage.do',
		columns : [ {
			checkbox : true
		}, 
			{
			field : 'id',
			title : '主键',
            formatter : function(value, row, index) {
			    return "<a href='#' class='view text-success' data-id='" + row.id + "'>" + $.getDictName('zj',value) + "</a>"
			 }
			},
			{
			field : 'code',
			title : '编号',
			formatter : function(value, row, index) {
			    return $.getDictName('bhao',value);
			 }
			},
			{
			field : 'name',
			title : '名称',
			formatter : function(value, row, index) {
			    return $.getDictName('mcheng',value);
			 }
			},
			{
			field : 'descInfo',
			title : '备注',
			formatter : function(value, row, index) {
			    return $.getDictName('bzhu',value);
			 }
			},
			{
			field : 'inserttime',
			title : '插入时间',
			formatter : function(value, row, index) {
			    return $.getDictName('crsj',value);
			 }
			},
		 ]
	});
	
});
