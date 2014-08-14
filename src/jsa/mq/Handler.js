var classList = ['jsa.mq.Looper','jsa.mq.Message'];
Class('jsa.mq.Handler').Import(classList).Prop(function(){
	return {
		
		//静态类Looper.
		//一条线程, 一个Looper
		_looper : new (Class('jsa.mq.Looper'))(),
		//handler的名字, 作为默认Message的名字
		name : null,

		//设置默认函数名和一个指定的回调函数
		init : function(name,fun){
			if(typeof name == 'string' && typeof fun == 'function'){
				this._looper.addListener(name,fun);
				this.name = name;
			}
		},
		/*
			如果args 是Message类型, 则直接作为消息发送给Looper处理该消息
			否则生存一个新的Message(this.name,args);
		*/
		postMessage : function(args){
			if(typeof args == 'object' && typeof args.Instanceof == 'function'){
				if(args.Instanceof('jsa.mq.Message')){
					this._looper.execMessage(args);
					return ;
				}
			}
			var m = new (Class('jsa.os.Message'))(this.name,args);
			this._looper.execMessage(m);
		},
		destroy:function(){
			this._looper = null;
			this.name = null;
		
		}
	};

});