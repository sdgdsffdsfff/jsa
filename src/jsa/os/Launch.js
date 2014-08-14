var list = ['jsa.os.Application','Mainifest','jsa.app.ActivityManager'];
Class('jsa.os.Launch').Import(list).Prop(function(){
	
	var mf = new (Class('Mainifest'))();
	//Run Application
	var app = new (Class('jsa.os.Application'))(mf);
	var activityList  = mf.getActivity();
	var firstActivityName = null;
	for(var i = 0 ; i < activityList.length; ++ i){
		if(activityList[i].main){
			firstActivityName = activityList[i].name;
		}
	}
	if(!firstActivityName)
		throw "don't hava any useable Main Activity";
	app.getActivityManager().doStartFirstActivity(firstActivityName);

});