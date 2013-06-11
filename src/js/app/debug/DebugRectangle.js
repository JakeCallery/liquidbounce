/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['app/debug/DebugDrawInstruction','jac/utils/ObjUtils'],
function(DebugDrawInstruction,ObjUtils){
    return (function(){
        /**
         * Creates a DebugRectangle object
         * @extends {DebugDrawInstruction}
         * @constructor
         */
        function DebugRectangle($x, $y, $width, $height, $color){
            //super
            DebugDrawInstruction.call(this);

	        this.x = $x;
	        this.y = $y;
	        this.width = $width;
	        this.height = $height;
	        this.color = $color;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(DebugRectangle,DebugDrawInstruction);

	    DebugRectangle.prototype.draw = function($ctx){
		    $ctx.beginPath();
		    $ctx.strokeStyle = this.color;
		    $ctx.strokeRect(this.x, this.y, this.width, this.height);
		    $ctx.stroke();
		    $ctx.closePath();
	    };

        //Return constructor
        return DebugRectangle;
    })();
});
