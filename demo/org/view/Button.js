Class('org.view.Button').Extends('jsa.view.View').Prop(function(){

	return {
		clickListener : function(){},
		
		onDraw : function(){
			$(this.selector).append('<button>a</button>');
			$(this.selector).append('<button>b</button>');
			$(this.selector).append('<button>c</button>');
		},
		setOnClickListener : function(f){
			this.clickListener = f;
		},
		onListener : function(){
			var that = this;
			$('button', this.selector).click(function(){
				that.clickListener();
			})
		}
	};

});