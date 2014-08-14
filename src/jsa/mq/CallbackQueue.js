/**
	Callback_queue: 回调函数链
	add(name,fun);
	remove(pattern);//根据Pattern删除指定函数.如果为空,则全部删除
	get(pattern);//根据Pattern获得指定函数.如果为空,则全部获得

*/

Class('jsa.mq.CallbackQueue').Import('jsa.mq.Message').Prop(
function(){
	return {
		
		
		/*{
			name : functionz, 
			name : function,
			name : function,
		}*/
		_queue : null,
		
		init : function(){
			this._queue = {};
		},
		//添加回调函数
		add:function(name,fun){
			if(typeof name == 'string' && name != '' && typeof fun == 'function')
				if(name in this._queue)
					throw 'The Name IS USED';
				else
					this._queue[name] = fun;
			else
				throw 'ERROR Name Or Fun Type';
		},
		remove:function(pattern){
			if(pattern == undefined || pattern ==null || pattern === ''){
				//全部删除^-^
				this.mMessage = {};
			}else if(typeof pattern == 'string'){
				var re  = RegExp(pattern);
				for(var name in this._queue){
					if(re.test(name)){
						//匹配删除
						delete this._queue[name];
					}
				}
			}else{
				throw 'ERROR pattern Type';
			}
		},
		//获得指定模式的回调函数
		get:function(pattern){
			var array = [];
			if(pattern == undefined || pattern ==null || pattern === ''){
				
				//如果为空, 则获得全部
				for(var name in this._queue){
					array.push(this._queue[name]);
				}
				return array;
			}else if(typeof pattern == 'string'){
				
				var re  = RegExp(pattern);
				for(var name in this._queue){
					if(re.test(name)){
						array.push(this._queue[name]);
					}
				}
				return array;
			}else{
				throw 'ERROR pattern Type';
			}
		},
		destroy : function(){
			this._queue = null;
		
		}
	};


});