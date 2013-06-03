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
        var IManager = {};

	    /**
	     * Add object to manager
	     * @param {IManageable} $obj
	     */
	    IManager.addObject = function($obj){};

	    /**
	     * Remove object from manager
	     * @param {IManageable} $obj
	     */
	    IManager.removeObject = function($obj){};

        //Return constructor
        return IManager;
    })();
});
