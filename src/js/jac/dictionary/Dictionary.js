/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Dictionary object
         * @param {Boolean} [$allowOverwrite=false]
         * @constructor
         */
        function Dictionary($allowOverwrite){
	        if($allowOverwrite === undefined){$allowOverwrite = false;}
	        var allowOverwrite = $allowOverwrite;
	        var keys = [];
	        var values = [];

	        this.put = function($key, $value){
				if(!allowOverwrite )
	        };
        }


        
        //Return constructor
        return Dictionary;
    })();
});
