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
         * @param {Number} [$xOffset=0]
         * @param {Number} [$yOffset=0]
         * @constructor
         */
        function Vec2DObj($x, $y, $xOffset, $yOffset){
	        if($offsetX === undefined){$offsetX = 0;}
	        if($offsetY === undefined){$offsetY = 0;}
	        this.x = $x;
	        this.y = $y;
	        this.xOffset = $xOffset;
	        this.yOffset = $yOffset;
        }

        //Return constructor
        return Vec2DObj;
    })();
});
