var classList = ['jsa.os.Intent','jsa.os.Application','jsa.mq.Handler'];
Class('jsa.app.Activity').Import(classList).Prop(function(){
	
	
	return {
		name : null,
		state : null,// running,paused,stoped,killed
		window: null,
		cfg : null,//参数
		called : false, //用来防止继承类没有调用父类而设置的标志
						//使用完该标志都置false
		savedInstanceState: null,
		intent : null,
		//返回给调用Activity的参敿
		result : null,
		app : null,
		init : function(name,cfg,app){
			this.called = true;
			this.name = name;
			this.app = app;
			this.cfg = cfg;
			this.state = 'killed';
			//委托WindowManager创建window
			this.window = app.getWindowManager().createWindow(this.name);
			this.savedInstanceState = {};
		},
		setContentView : function(view){
			this.window.setContentView(view);
		},
		findViewById : function(id){
			return this.window.findViewById(id);
		},
		findViewByName : function(name){
		
			return this.window.findViewByName(name);
		},
		setResult : function(resultCode,intent){
			if(!intent.Instanceof('jsa.os.Intent'))
				throw 'intent type error';
			this.result = {
				resultCode : resultCode,
				intent : intent
			}
		},
		//reset andd check
		rcCalled : function(){
			if(!this.called)
				throw 'No Call Father Function';
			this.called = false;
		},
		//生命控制过程,由ActivityManager控制
		doRun : function(){
			this.called = false;
			if(this.state == 'running' )
				throw 'The Activity is Running ';
				
			if(this.state == 'killed'){
				//-----------------
				// onCreate --> onStart ---> onResume
				//-----------------
				this.onCreate(this.savedInstanceState);
				this.rcCalled();
				this.onStart();
				this.rcCalled();
				this.onResume();
				this.rcCalled();
			}else if(this.state == 'paused'){
				this.Resume();
				this.rcCalled();
			}else if(this.state == 'stoped'){
				this.onStart();
				this.rcCalled();
				this.onResume();
				this.rcCalled();
			}else{
				throw "Unknow Activity's State";
			}
			//设置状态
			this.state = 'running';
		},
		doPause : function(){
			this.called = false;
			if(this.state == 'running'){
				this.onPause();
				this.rcCalled();
			}else{
				throw "Activity State don't in running";
			}
			//设置状态
			this.state = 'paused';
		},
		doStop : function(){
			this.called = false;
			if(this.state == 'running'){
				this.onPause();
				this.rcCalled();
				this.onStop();
				this.rcCalled();
			if(this.state == 'paused'){
				this.onStop();
				this.rcCalled();
			}
			}else{
				throw "Activity State don't in running";
			}
			//设置状态
			this.state = 'stoped';
		
		},
		doKill : function(){
			this.called = false;
			if(this.state == 'killed')
				throw 'The Activity is Killed';
			if(this.state == 'running'){
				this.onPause();
				this.rcCalled();
				this.onStop();
				this.rcCalled();
				this.onDestroy();
				this.rcCalled();
			}else if(this.state == 'paused'){
				this.onStop();
				this.rcCalled();
				this.onDestroy();
				this.rcCalled();
			}else if(this.state == 'stoped'){
				this.onDestroy();
				this.rcCalled();
			}else{
				throw "Unknow Activity's State";
			}
			//设置状态
			this.state = 'killed';
		},
		finish : function(){
			app.getActivityManager().doCallbackActivity(this);
		},
		//子Activity返回后调用该函数
		onActivityResult : function(requestCode, resultCode, data){
			//no- do
		},
		startActivityForResult : function(requestCode,intent){
			if(typeof request != 'number' || intent.Instanceof('jsa.os.Intent'))
				throw 'ERROR Arguments';
			app.getActivityManager().doStartAcitivityForResult(this,requestCode,intent);
		},
		startActivity : function(intent){
			this.startActivityForResult(-1,intent);
		},
		onCreate : function(savedInstanceState){
			//do Create
			this.called = true;
		},
		onStart : function(){
			this.called = true;
		},
		onResume : function(){
			this.called = true;
		},
		onPause : function(){
			this.called = true;
		},
		onStop : function(){
			this.called = true;
		},
		onDestroy: function(){
			this.called = true;
		},
		destroy : function(){
			this.name = null;
			this.state = null;
			this.window = null;
			this.cfg = null;
			this.called = null; 
			this.savedInstanceState = null;
			this.intent = null;
			this.result = null;
			this.app = null;
		
		}
	};

});