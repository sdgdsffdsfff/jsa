Class('org.view.LineLayout').Extends('jsa.view.ViewGroup').Prop(function(){

	return {		
		onDraw : function(){
			
			for(var i = 0 ; i< this.cvl.length ; ++i){
				var mp = $('<div></div>');
				this.cvl[i].setMP(mp);
				$(this.selector).append(mp);
			}
		}
	};

});