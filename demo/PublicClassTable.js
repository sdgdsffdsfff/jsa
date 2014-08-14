//工具生成
//加载R.js
//加载res/layout/* <-->R.System.Layout.cls* R.User.Layout.cls*
//加载Mainifest.js
//加载Mainifest-->Activity.cls
//加载lib/*
var list = ['R','Mainifest','lib.jQuery','lib.Util','lib.Debug',
	'lib.Log','org.app.MainActivity','jsa.view.LayoutInflater',
	'jsa.view.Parse','org.view.LineLayout','org.view.Button'];
Class('PublicClassTable').Import(list);