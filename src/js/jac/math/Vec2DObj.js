/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Vec2DObj object (for use with Vec2D.js)
         * @param {Number} $x
         * @param {Number} $y
         * @constructor
         */
        function Vec2DObj($x, $y){
	        this.x = $x;
	        this.y = $y;
        }

        //Return constructor
        return Vec2DObj;
    })();
});
