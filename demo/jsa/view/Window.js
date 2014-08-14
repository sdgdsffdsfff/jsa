//不能被继承的类
Class('jsa.view.Window').Import(['jsa.os.Application','jsa.view.ViewGroup']).Prop(function(){
	
	return {
	
		rootView : null,
		app :null,
		//构造函数
		init : function(app){
			this.app = app;
			this.rootView = null;
			//设置Window级别的监听器
			this._onWindowListener();
		},
		
		setContentView : function(view){
			if(view.Instanceof('jsa.view.ViewGroup')){
				this.rootView = view;
				//设置rootView的父View选择器, 为Body
				this.rootView.setMP('body');
				//强制标记该rootView为重绘对象
				this.rootView.setDirty(true);
				//刷新该rootView
				this.rootView.doRefresh();
			}
			else
				throw 'View Type is Error!';
			
		},
		_onWindowListener : function(){
			var that = this;
			//现在仅仅实现了浏览器大小变化
			window.onresize = function(){
				var w = document.body.clientWidth;
				var h = document.body.clientHeight;
				that.doResize(w,h);
			};
		},
		//是否是焦点图层
		// 1 为焦点 0 为普通 -1 失去焦点
		doForce : function(flag){
			if(flag){
				this.rootView.doRefresh(null,null,null,null,1);
			}else
				this.rootView.doRefresh(null,null,null,null,-1);
		},
		doHide : function(){
			this.rootView.doShow(false);
		},
		doShow : function(){
			this.rootView.doShow(true);
		},
		doResize : function(w,h){
			this.rootView.doRefresh(w,h);
		},
		//执行摧毁动作
		doDestroy : function(){
			if(this.rootView){
				this.rootView.doDestroy();
				this.rootView = null;
			}
			$(this.win).remove();
		},
		findViewById : function(id){
			if(this.rootView){
				return this.rootView.findViewById(id);
			}
			return null;
		},
		findViewByName : function(name){
			if(this.rootView){
				return this.rootView.findViewByName(name);
			}
			return null;
		},
		//析构函数
		destroy: function(){
			this.win = null;
			this.rootView = null;
			this.app = null;
		}
	};

});