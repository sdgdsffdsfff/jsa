Class('jsa.mq.Message').Prop(function(){
	return{
		what : null,
		args : null,
		fun  : null,
		init : function(what,args,fun){
			this.what = what;
			this.args = args;
			if(typeof fun == 'function')
				this.fun  = fun;
			else
				this.fun = null;
		},
		destroy : function(){
			this.what = null;
			this.args = null;
			this.fun  = null;
		}
	};
});