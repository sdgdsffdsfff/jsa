Class('jsa.view.LayoutInflater').Prop(function() {
	//加载一个JSON对象， 返回Object类型
	var loadJSON = function(url){
		
		var http = null;
		try{
			http = new ActiveXObject("Microsoft.XMLHTTP");  
		}catch(e){
			try{
				http = new XMLHttpRequest();
			}catch(e){
				throw 'AJAX CREATE FAIL';
			}
		}
		http.open("GET",url,false);//采用POST方式，同步方式发送
        http.send(null);//构造一个XML对象并发送
		return eval("("+ http.responseText+")");
	};
	//要从Layout中配置的属性
	var prop = ['name','id','top','left','zInex','width','height','hide','cfg'];
	
	var configView = function(view,cfg){
		for(var i=0; i<prop.length ; ++i){
			if(prop[i] in cfg){
				//如果其中有该属性, 则进行配置
				//注意属性的类型
				view[prop[i]] = cfg[prop[i]];
			}
		}
	};
	var rInflate = function(rView,cvl){
		if(cvl == undefined || cvl == null)
			return;
		//检测cvl类型
		if(Object.prototype.toString.call(cvl) != '[object Array]')
			throw 'CVL Must is Array';
		//检测类型, 只有ViewGroup类型才能使用cvl属性
		if(rView.Instanceof('jsa.view.ViewGroup')){
			for(var i = 0 ; i < cvl.length ; ++i){
			
				var cv = new (Class(cvl[i].cls))();
				//配置
				configView(cv,cvl[i]);
				//调用doCreate
				cv.doCreate(cvl[i].cfg || {});
				//添加到父View中
				rView.addView(cv);
				if(cv.Instanceof('jsa.view.ViewGroup'))
					rInflate(cv,cvl[i].cvl);
			}
		
		}
	
	};
	var inflate = function(layoutURL){
		var layout = loadJSON(layoutURL);
		if(!layout || !layout.cls)
			throw 'ERROR FORMAT LAYOUT : '+  layoutURL;
		//创建RootView
		var rView = new (Class(layout.cls))();
		if(!rView.Instanceof('jsa.view.ViewGroup'))
			throw 'Layout RootView Must is ViewGroup';
		//配置view属性
		configView(rView,layout);
		//调用doCreate
		rView.doCreate(layout.cfg || {})
		//配置子View
		rInflate(rView,layout.cvl);
		return rView;
	};
	return {
		//layoutURL
		inflate : function(layoutURL){
			if(typeof layoutURL == 'string')
				return inflate(layoutURL);
			throw 'error';
		}
	
	};
});
