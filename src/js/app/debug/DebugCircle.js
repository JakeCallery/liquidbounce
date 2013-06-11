/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['app/debug/DebugDrawInstruction','jac/utils/ObjUtils'],
function(DebugDrawInstruction,ObjUtils){
    return (function(){
        /**
         * Creates a DebugCircle object
         * @extends {DebugDrawInstruction}
         * @constructor
         */
        function DebugCircle($centerX, $centerY, $radius, $color){
            //super
            DebugDrawInstruction.call(this);

	        this.x = $centerX;
	        this.y = $centerY;
	        this.radius = $radius;
	        this.color = $color;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(DebugCircle,DebugDrawInstruction);

	    DebugCircle.prototype.draw = function($ctx){
		    $ctx.beginPath();
		    $ctx.strokeStyle = this.color;
		    $ctx.arc(this.x, this.y, this.radius,0,2*Math.PI,false);
		    //$ctx.fillStyle = this.color;
		    $ctx.stroke();
		    $ctx.closePath();
	    };

        //Return constructor
        return DebugCircle;
    })();
});
