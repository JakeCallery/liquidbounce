/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/debug/DebugLine'],
function(DebugLine){
    return (function(){
        /**
         * Creates a DebugDrawTool Singleton object
         * to use ALWAYS new it up mySingleton = new DebugDrawTool()
         * @constructor
         */
        function DebugDrawTool(){
	        if(DebugDrawTool.prototype._singletonInstance){
		        return DebugDrawTool.prototype._singletonInstance;
	        }

	        //Set first instance
	        DebugDrawTool.prototype._singletonInstance = this;

	        this.instructionStack = [];

	        this.draw = function($ctx){
		        for(var i = 0; i < this.instructionStack.length; i++){
			        this.instructionStack[i].draw($ctx);
		        }

		        this.instructionStack = [];
	        };

	        this.drawLine = function($x1, $y1, $x2, $y2, $color){
		        this.addInstruction(new DebugLine($x1, $y1, $x2, $y2, $color));
	        };

	        this.addInstruction = function($debugInstruction){
		        this.instructionStack.push($debugInstruction);
	        };
        }

        //Return constructor
        return DebugDrawTool;
    })();
});
