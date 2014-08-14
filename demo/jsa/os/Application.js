var classList = ['jsa.app.ActivityManager','jsa.view.WindowManager','jsa.app.DialogManager'];
Class('jsa.os.Application').Import(classList).Prop(function(){
	return {
		activityManager : null,
		windowManager : null,
		dialogManager : null,
		init : function(mainifest){
			this.activityManager = new (Class('jsa.app.ActivityManager'))(mainifest.getActivity(),this);
			this.windowManager = new (Class('jsa.view.WindowManager'))(this);
			this.dialogManager = new (Class('jsa.app.DialogManager'))(this);
		},
		destroy : function(){
			this.activityManager = null;
			this.windowManager = null;
			this.dialogManager = null;
		}
		
	};

});