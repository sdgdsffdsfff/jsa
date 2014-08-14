Class('jsa.app.ActivityManager').Import(['jsa.app.Activity','jsa.os.Intent']).Prop(function(){
	return {
		//配置文件 = Mainifest.Activity;
		_activityCfg : null,
		//系统中被初始化的类型,没有被destory
		_activityList : null,
		//状态链
		_activityStateStack : null,
		//Application, 包含了几个Manager等相关信恿
		_app : null,
		//当前活动的Activity名字
		_activity : null,
		
		//_activityCfg 来自JSA.Launch对Mainifest.Activity
		init: function(activityCfg,app){
			this._app = app;
			this._activityCfg = activityCfg;
			this._activityList = [];
			this._activityStateStack = [];
			this._activity = null;
		},
		createActivity: function(name){
			if(typeof name == 'string' && name != ''){
				var activity = this.findActivity(name);
				if(!!activity)
					return activity;
				for(var i = 0 ; i < this._activityCfg.length ; ++ i){
					if(this._activityCfg[i].name === name){
						//initlize it
						activity = new (Class(this._activityCfg[i].cls))(name,this._activityCfg[i].cfg,this._app);
						//检测是否根Activity.init()被子Activity调用
						activity.rcCalled();
						this._activityList.push(activity);
						return activity;
					}
				}
				throw 'No Activity In System';
			}	
				
		},
		removeActivity: function(name){
			//no-do
		},
		//查询系统中已经被初始化过的Activity
		//查询不到返回null, 否则返回该Activity
		findActivity : function(name){
			for(var i = 0; i< this._activityList.length ; ++ i){
				if(this._activityList[i].getName() === name){
					return this._activityList[i];
				}
			}
			return null;
		},
		//由一个Activity调用Acitvity使用的函敿
		//activity = 调用该函数的Activity对象
		//intent = 参数传递和指向Activity对象
		//requestCode = 识别Code, 如果 < 0 则不需要回调
		doStartAcitivityForResult : function(activity,requestCode,intent){
			if(arguments.length != 3 || !activity.Instanceof('jsa.app.Activity') || !intent.Instanceof('jsa.os.Intent')){
				throw 'ERROR ARGUMENTS LENGTH OR TYPE';
			}
			//保存调用者Activity的状态
			this._activityStateStack.push({
				activity : activity,
				requestCode : requestCode
			});
			//检测类型是否正确
			if(typeof intent.getActivityName() != 'string')
				throw 'ERROR Intent.mActivityName Type';
			//停止运行父Activity
			activity.doStop();
			//查询是否该Activity已经被初始化, 没有被OnDestory.
			var subActivity = this.findActivity(intent.getActivityName());
			if(!aimActivity){
				//创建一个新的Activity到系统中
				subActivity = this.createActivity(intent.getActivityName());
			}
			subActivity.setIntent(intent);
			//记录活动Activity
			this._activity = name;
			//启动该Activity
			subActivity.doRun();
			
		},
		//子Activity调用finish(), 返回父Activity
		doCallbackActivity : function(activity){
			var result =  !!activity.getResult() ||  {};
			//清空子Activity的Result
			activity.setResult();
			activity.doStop();
			var state = this._activityStateStack.pop();
			if(!!state){
				var ac = state.activity;
				var code = !!state.requestCode || -1;
				//记录活动Activity
				this._activity = name;
				//启动该Activity
				ac.doRun();
				//如果调用者有这是requestCode , 则调用调用者的onActivityResult()函数
				if(code >= 0)
					ac.onActivityResult(code,result.resultCode,result.intent);
			}
			//如果没有, 则直接退出系统了
			return;
		},
		//启动第一个Activity By Launch
		doStartFirstActivity : function(name){
			var aimActivity = this.createActivity(name);
			//设置活动Activity
			this._activity = name;
			//启动该Activity
			aimActivity.doRun();
		},
		destroy : function(){
			this._activityCfg = null;
			this._activityList = null;
			this._activityStateStack = null;
			this._app = null;
			this._activity = null;
		}
		
	};

});