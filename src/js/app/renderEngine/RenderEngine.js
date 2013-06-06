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

        }

        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.clearFrame = function(){
		    //Clear
		    this.renderCtx.fillStyle = '#000000';
		    //this.renderCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		    this.renderCtx.fillRect(0,0,this.canvasWidth, this.canvasHeight);
	    };

	    /**
	     * Renders blobParts
	     * @param {Array.<BlobPart>} $blobPartList
	     */
	    RenderEngine.prototype.renderBlobParts = function($blobPartList){
			var self = this;

		    var item = null;

		    for(var i = 0, l = $blobPartList.length; i < l; i++){
				item = $blobPartList[i];

			    this.renderCtx.drawImage(item.renderImg, item.renderX, item.renderY);
		    }


	    };

	    /**
	     * Renders dispensers
	     * @param {Array.<BaseDispenser>} $dispensers
	     */
	    RenderEngine.prototype.renderDispensers = function($dispensers){
		    var item = null;
		    for(var i = 0, l = $dispensers.length; i < l; i++){
			    item = $dispensers[i];
			    this.renderCtx.drawImage(item.renderImg, item.renderX, item.renderY);
		    }
	    };

	    /**
	     * render deflectors
	     * @param {Array.<BaseDeflector>}$deflectors
	     */
	    RenderEngine.prototype.renderDeflectors = function($deflectors){
		    var item = null;
		    for(var i = 0, l = $deflectors.length; i < l; i++){
			    item = $deflectors[i];
			    this.renderCtx.drawImage(item.renderImg, item.renderX, item.renderY);
		    }
	    };

        //Return constructor
        return RenderEngine;
    })();
});
