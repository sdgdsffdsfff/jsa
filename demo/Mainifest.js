Class('Mainifest').Prop(function(){
	return {
		//静态对象
		Activity:[{
			
			cls: 'org.app.MainActivity',
			name: 'name',
			main:true,
			cfg :{ //初始化该Activity的时候,给予的参数, 一般不用
			
			}
		}],
		
		Service: [{
			cls: 'org.app.Service',
			name: 'name',
			cfg :{
			
			}
		}]
	}

});