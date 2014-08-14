Class('lib.Util');

Util = (function(){
	var key = 0 ; 
	return {
		newSelector : function(){
			return key ++;
		}
	};

})();