//静态类
var classList = ['jsa.mq.Message','jsa.mq.CallbackQueue'];
Class('jsa.mq.Looper').Import(classList).Prop(function(){

	return {
		
		
		_callbackQueue : null,
		
		init : function(){
			this._callbackQueue = new  (Class('jsa.mq.CallbackQueue'))();
		},
		execMessage: function(message){
			if(message.Instanceof('jsa.mq.Message')){
				if(typeof message.getFun()  == 'function'){
					//this = messsage
					message.getFun().apply(message);
				}else{
					//如果message.what == null, 执行全部
					//或者按pattern匹配
					var list = this._callbackQueue.get(message.getWhat());
					var ret = true;
					for(var i = 0 ; ret && i < list.length ; ++ i ){
						ret = list[i].apply(message)
					}
				}
			}else{
				throw 'ERROR MESSAGE TYPE';
			}
		},
		addListener: function(name,fun){
			return this._callbackQueue.add(name,fun);
		},
		removeListener : function(pattern){
			this._callbackQueue.remove(pattern);
		},
		destroy : function(){
			this._callbackQueue = null;
		}
	};

});