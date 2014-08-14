/**
	维护整个系统的Window
	具有构造和创建Window的功能
*/
Class('jsa.view.WindowManager').Import(['jsa.os.Application','jsa.view.Window']).Prop(function(global){

	return {
		_app : null,
		_windowMap : null, //name , window
		init : function(app){
			this._app = app;
			//重建BODY
			$('body').empty();
			
			this._windowMap = {};
		},
		//构建一个window , div,
		createWindow : function(name){
			if(this._windowMap[name])
				throw 'Same Name window In System';
			this._windowMap[name] = new (Class('jsa.view.Window'))(this._app);
			return this._windowMap[name];
		},
		//remove
		removeWindow : function(name){
			var window = this._windowMap[name];
			if(!window)
				throw 'No the Window : '+ name;
			window.doDestroy();
			delete this._windowMap[name];
		},
		getWindow :function(name){
			return this._windowMap[name].window;
		}
	};

});