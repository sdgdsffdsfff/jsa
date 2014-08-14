Class('org.app.MainActivity').Import(['jsa.view.LayoutInflater','org.view.Button']).Extends('jsa.app.Activity').Prop(function(){
	return {
		onCreate : function(s){
			this.top(s);
			var inflater = new (Class('jsa.view.LayoutInflater'))();
			
			this.setContentView(inflater.inflate(Class('R').prototype.user.layout.main));
			var button  = this.findViewById('2');
			button.setOnClickListener(function(){
				alert('hello world!');
			})
		}
	
	};

});