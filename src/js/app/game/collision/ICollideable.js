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
	    var ICollideable = {};

	    /**@type {Array.<LineSeg2DObj>}*/ICollideable.shellSegList = [];
	    /**@type {Array.<Vec2DObj>}*/ICollideable.shellVecList = [];

        //Return constructor
        return ICollideable;
    })();
});
