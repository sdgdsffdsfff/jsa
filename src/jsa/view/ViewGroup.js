Class('jsa.view.ViewGroup').Import(['jsa.view.View']).Extends('jsa.view.View').Prop(function(){

	return {
		//childViewList
		cvl : null,
		init :function(){
			this.top();
			this.cvl = [];
		},
		destroy : function(){
			this.cvl = null;
			//注意调用父析构函数
			this.top();
		},
		findViewById : function(id){
			if(this.id == id)
				return this;
			for(var i = 0 ; i < this.cvl.length ; ++i){
				var view = this.cvl[i].findViewById(id);
				if(view)
					return view;
			
			}
			return null;
		},
		findViewByName : function(name){
			if(this.name == name)
				return this;
			for(var i = 0 ; i < this.cvl.length ; ++i){
				var view = this.cvl[i].findViewByName(name);
				if(view)
					return view;
			}
			return null;
		},
		
		//添加一个View类型的对象
		//refresh = true , 马上刷新该viewgroup
		addView : function(view,refresh){
			if(view.Instanceof('jsa.view.View') && !/\s/.test(view.getName())){
			
				for(var i = 0 ; i <this.cvl.length ;++i){
					if(this.cvl[i] === view)
						throw 'same name : '+ vname + ' in ' + this.name ;
				}
				this.cvl.push(view);
				//设置(默认挂载点)
				view.setMP(this);
				//重绘该View
				view.setDirty(true);
			}else{
				throw 'error View Type';
			}
			if(refresh === true)
				this.doRefresh();
		},
		//删除该ViewGroup下的一个view
		//refresh为是否马上刷新该ViewGroup
		removeView : function(view,refresh){
			var flag = false;
			for(var i = 0 ; i < this.cvl.length ; ++i){
				if(this.cvl[i] === view){
					//销毁
					view.doDestroy();
					//设置父View指针
					view.setMP(null);
					//移除list中该view
					this.cvl.splice(i,1);
					flag = true;
					break;
				}
			}
			
			if(flag){
				//删除失败
				throw 'The View is"t belong to : ' + this.name;
			}
			if(refresh === true)
				this.doRefresh();
		},
		//更新该view的大小
		doMesure : function(w,h){
			this.top(w,h);
			this.onDispatchMesure(w,h);
		},
		
		//重载
		doLayout: function(top,left,zIndex){
			this.top();
			this.onDispatchLayout(top,left,zIndex);
		},
		
		//描绘该view的具体样子
		//并且注册监听器
		doDraw : function(){
			var flag = this.dirty;
			this.top();
			this.onDispatchDraw(flag);
		},
		
		//刷新该ViewGroup
		doRefresh : function(w,h,top,left,zIndex){
			this.doDraw();
			this.doLayout(top,left,zIndex);
			this.doMesure(w,h);
		},
		//重载
		doDestroy :  function(){
			for(var i = 0 ; i < this.cvl.length ; ++i){		
				this.cvl[i].doDestroy();
				//清空
				this.cvl[i].setMP(null);
			}
			//调用自己的析构后置函数
			this.onDestroy();
			//删除自己的View
			$(this.selector).remove();
			this.cvl = [];
		},
		onDispatchDraw : function(flag){
			if(flag){
				//强制刷新View树中所有对象
				//因为DOM树重建了
				for(var i = 0 ; i < this.cvl.length ;++i){
					this.cvl[i].setDirty(true);
				
				}
			}
			var mark = false;
			//处理
			for(var i=0 ;i < this.cvl.length ; ++i){
				this.cvl[i].doDraw();
			}
		},
		onDispatchLayout : function(top,left,zIndex){
			for(var i = 0 ; i <  this.cvl.length ;++ i){
				this.cvl[i].doLayout(top,left,zIndex);
			}
		},
		//提供用户接口, 进行处理子view大小控制
		onDispatchMesure : function(w,h){

			for(var i = 0 ; i <  this.cvl.length ;++ i){
				this.cvl[i].doMesure(w,h);
			}
		}
	};
});