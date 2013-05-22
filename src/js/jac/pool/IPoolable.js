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
        var IPoolable = {};

        IPoolable.init = function($args){};
	    IPoolable.recycle = function($args){};

        //Return constructor
        return IPoolable;
    })();
});
