/*
	View 定义了一个空白的Div占据的空间关系
	以及基础的聚焦, 隐藏等属性
*/
Class('jsa.view.View').Prop(function(){



	return {
		
		name : null, //findViewByName
		id : null, //findViewById
		selector :null, //selector , 记录着该View中的DOM
		mP : null, //该View要挂载的点(Mount Point)
		cfg : null, //from Layout.js

		
		top : 0, //top offset
		left : 0, //left offset
		zIndex : 0 ,//the View z-indexv
		
		width : 0 , //total Width
		height : 0 ,//total Height
		
		dirty : true, //是否更新图层
		
		hide : false, //是否被隐藏

		//系统生命周期
		init :function(){
			//noop
		},
		//系统生命周期
		destroy : function(){
			this.name = null; //findViewByName
			this.id = null; //findViewById
			this.select =null; //selector
			this.mP = null; //point to mP
			this.cfg = null; //from Layout.js

			
			this.top = null; //x offset
			this.left = null; //y offset
			this.zIndex = null ;//the View z-indexv
			this.width = null ; //total Width
			this.height = null ;//total Height
			this.dirty=null; 
			this.hide = null; //是否被隐藏
		},
		//覆盖setMP
		setMP : function(mP){
			if(!mP){
				this.mP = null;
			//选择子(唯一性), 或者jQuery
			}else if(typeof mP == 'string' || 
				typeof mP == 'object'){
				this.mP = mP;
			}else{
				throw 'ERROR mount Point  TYPE';
			}
		},
		onCreate : function(cfg){
		
		},
		//remove View的时候, 提供给用户的接口
		onDestroy : function(){
			
		},
		onDraw :function(){
		
		
		},
		onLayout : function(top,left,zIndex){
		
		
		},
		onMesure:function(w,h){
		
		
		},
		//设置监听器
		//调用时机在onDraw(), 且只有一次
		onListener : function(){
		
		},
		doCreate : function(cfg){
			this.onCreate(cfg);
		},
		doDestroy :  function(){
			this.onDestroy();
			//移除DOM
			$(this.selector).remove();
		},
		findViewById : function(id){
			if(this.id == id)
				return this;
			return null;
		},
		findViewByName : function(name){
			if(this.name == name)
				return this;
			return null;
		},
		
		//更新该view的大小
		doMesure : function(w,h){

			this.width  = w || this.width || $(this.selector).width();
			this.hegiht = h || this.height || $(this.selector).height();
			$(this.selector).width(this.width);
			$(this.selector).height(this.hegiht);
			//提供给用户的是实际的容器大小
			this.onMesure(this.width,this.height);

		},
		//修改view的空间坐标系
		doLayout: function(top,left,zIndex){
	
			this.dirtyLayout = false;
			this.top  = top || this.top || $(this.selector).offset().top;
			this.left = left || this.left ||  $(this.selector).offset().left;
			this.zIndex = zIndex || this.zIndex || 0;
			$(this.selector).offset({
				top: this.top,
				left: this.left
			});
			$(this.selector).css('z-index',""+this.zIndex);
			this.onLayout(this.top,this.left,this.zIndex);
		},
		//描绘该view的具体样子
		//并且注册监听器
		doDraw : function(){
			if(this.dirty === true){
				this.dirty = false;
				//删除原先DOM
				$(this.selector).remove();
				//重新生成DOM
				this.selector = $('<div></div>');
				//添加到父View给定的挂载点
				$(this.mP).append(this.selector);
				//根据是否隐藏做标记
				this.doShow(!this.hide);
				this.onDraw();
				this.onListener();
			}
		},
		
		//flag  = false , 隐藏
		doShow : function(flag){
			if(typeof flag == 'boolean' && !flag )
				$(this.selector).hide();
			else
				$(this.selector).show();
		}
	};


});