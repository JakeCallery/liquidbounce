/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){

	    /**
	     * @interface
	     */
       var IManageable = {};

	    IManageable.addManager = function($iManager){};
	    IManageable.removeManager = function($iManager){};

        //Return constructor
        return IManageable;
    })();
});
