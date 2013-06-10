/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/debug/DebugDrawInstruction',
'jac/utils/ObjUtils'],
function(DebugDrawInstruction,ObjUtils){
    return (function(){
        /**
         * Creates a DebugLine object
         * @constructor
         * @extends {DebugDrawInstruction}
         */
        function DebugLine($x1, $y1, $x2, $y2, $color){
	        DebugDrawInstruction.call(this);

	        this.x1 = $x1;
	        this.y1 = $y1;
	        this.x2 = $x2;
	        this.y2 = $y2;
	        this.color = $color;
        }

	    ObjUtils.inheritPrototype(DebugLine, DebugDrawInstruction);

	    DebugLine.prototype.draw = function($ctx){
			$ctx.beginPath();
		    $ctx.strokeStyle = this.color;
		    $ctx.moveTo(this.x1, this.y1);
		    $ctx.lineTo(this.x2, this.y2);
		    $ctx.lineWidth = 1;
		    $ctx.stroke();
		    $ctx.closePath();
	    };

        //Return constructor
        return DebugLine;
    })();
});
