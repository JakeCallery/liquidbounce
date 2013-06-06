/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var CollisionSides = {};

	    CollisionSides.LEFT = 'leftside';
	    CollisionSides.RIGHT = 'rightside';
	    CollisionSides.BOTH = 'bothsides';

        //Return constructor
        return CollisionSides;
    })();
});
