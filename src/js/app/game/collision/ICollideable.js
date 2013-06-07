/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/geometry/Rectangle'],
function(Rectangle){
    return (function(){

	    /**
	     * @interface
	     */
	    var ICollideable = {};

	    /**@type {Array.<LineSeg2DObj>}*/ICollideable.shellSegList = [];
	    /**@type {Array.<Vec2DObj>}*/ICollideable.shellVecList = [];
	    /**@type {Rectangle}*/ICollideable.colRect = new Rectangle(0,0,1,1);

        //Return constructor
        return ICollideable;
    })();
});
