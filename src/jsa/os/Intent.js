Class('jsa.os.Intent').Prop(function(){
	return {

		extra: null,//额外参数
		activityName : null, //指定运行的Activity名字
		init : function(name,extra){
			this.activityName = name;
			this.extra = extra || {};
		},
		setActivityName : function(name){
			if(typeof name != string || name == '')
				throw 'Activity Name  ERROR';
			this.activityName = name;
		},
		addValue : function(key,value){
			if(typeof key !='string' ||  key == '')
				throw 'ERROR KEY';
			this.extra[key] = value;
		},
		destroy : function(){
			this.extra = null;
			this.activityName = null;
		}
	};

});