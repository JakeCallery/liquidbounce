/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/InterfaceUtils',
'app/renderEngine/IBitmapRenderable'],
function(EventDispatcher,ObjUtils, InterfaceUtils, IBitmapRenderable){
    return (function(){
        /**
         * Creates a RenderEngine object
         * @param {canvas} $renderCanvas
         * @param {int} $canvasWidth
         * @param {int} $canvasHeight
         * @extends {EventDispatcher}
         * @constructor
         */
        function RenderEngine($renderCanvas, $canvasWidth, $canvasHeight){
            //super
            EventDispatcher.call(this);

	        this.canvasWidth = $canvasWidth;
	        this.canvasHeight = $canvasHeight;

	        /**@type {canvas}*/this.renderCanvas = $renderCanvas;
	        this.renderCtx = this.renderCanvas.getContext('2d');

	        this.renderItems = [];

        }

        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.addBitmapRenderable = function($item){
			var result = InterfaceUtils.objectImplements($item, IBitmapRenderable)
		    if(result !== true){
			    throw new Error(result);
		    }


	    };

	    /**
	     * Renders all renderable things
	     */
	    RenderEngine.prototype.render = function(){
			var self = this;
			//Clear
		    this.renderCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		    var item = null;

		    for(var i = 0, l = this.renderItems.length; i < l; i++){
				item = this.renderItems[i];
		    }


	    };

        //Return constructor
        return RenderEngine;
    })();
});
