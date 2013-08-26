/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/InterfaceUtils',
'app/renderEngine/IBitmapRenderable',
'app/debug/DebugDrawTool',
'app/parts/field/Polarity',
'jac/bitmap/ThresholdFilter',
'jac/logger/Logger',
'jac/asyncGC/ArrayBufferGC'],
function(EventDispatcher,ObjUtils, InterfaceUtils,
        IBitmapRenderable, DebugDrawTool,Polarity,
        ThresholdFilter,L,ArrayBufferGC){
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

	        this.arrayBufferGC = new ArrayBufferGC();
			this.srcData = null;
	        this.dstData = null;

	        this.canvasWidth = $canvasWidth;
	        this.canvasHeight = $canvasHeight;

	        /**@type {canvas}*/this.renderCanvas = $renderCanvas;
	        this.renderCtx = this.renderCanvas.getContext('2d');

	        this.blobCanvas = document.createElement('canvas');
	        this.blobCanvas.width = this.canvasWidth;
	        this.blobCanvas.height = this.canvasHeight;

	        this.blobCtx = this.blobCanvas.getContext('2d');

	        this.ddt = new DebugDrawTool();

        }

        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.clearFrame = function(){
		    //Clear
		    this.renderCtx.fillStyle = 'rgba(0,0,0,255)';
		    //this.renderCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		    this.renderCtx.fillRect(0,0,this.canvasWidth, this.canvasHeight);
	    };

	    /**
	     * Renders blobParts
	     * @param {LinkedList} $blobPartList
	     * @param {boolean} $makeBlobby
	     */
	    RenderEngine.prototype.renderBlobParts = function($blobPartList, $makeBlobby){
			var self = this;

		    var item = null;

		    this.blobCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
			$blobPartList.resetCurrent();
			var node = $blobPartList.getNext();
		    while(node !== null){
			    item = node.obj;
			    if($makeBlobby === true){
				    this.blobCtx.drawImage(item.renderImg, item.renderX, item.renderY);
			    } else {
				    this.renderCtx.drawImage(item.renderImg, item.renderX, item.renderY);
			    }


			    node = $blobPartList.getNext();
		    }

		    if($makeBlobby === true){
			    //console.time('getData');
			    this.srcData = this.blobCtx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
			    this.dstData = this.renderCtx.getImageData(0,0,this.canvasWidth, this.canvasHeight);
			    //console.timeEnd('getData');
			    // console.time('filter');
			    ThresholdFilter.filter(this.srcData.data,this.dstData.data, '>=', 0x000000CC, 0xFF00FFFF, 0x000000FF,false);
			    //console.timeEnd('filter');
			    //console.time('putdata');
			    this.renderCtx.putImageData(this.dstData,0,0);
			    //console.timeEnd('putdata');

			    this.arrayBufferGC.dispose(this.srcData);
			    this.arrayBufferGC.dispose(this.dstData);

			    this.srcData = null;
			    this.dstData = null;
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

			    this.renderCtx.save();
			    this.renderCtx.translate(item.x, item.y);
			    this.renderCtx.rotate(item.getRotationInRadians());
			    this.renderCtx.drawImage(item.renderImg, item.renderOffsetX, item.renderOffsetY);
			    this.renderCtx.restore();

			    //Debug
			    //var vec = item.shellVecList[0];
			    //this.ddt.drawLine(vec.xOffset, vec.yOffset, vec.x+vec.xOffset, vec.y+vec.yOffset, '#00FFFF');
			    ///////////////////////////////////////////////////////////
		    }
	    };

	    RenderEngine.prototype.renderFields = function($fields){
		    var item = null;

		    for(var i = 0, l = $fields.length; i < l; i++){
			    item = $fields[i];
			    this.renderCtx.drawImage(item.renderImg, item.renderX, item.renderY);

			    //DEBUG
			    var debugColor;
			    if(item.polarity === Polarity.ATTRACT){
				    debugColor = '#FF00FF';
			    } else {
				    debugColor = '#00FF00'
			    }

			    this.ddt.drawCircle(item.x, item.y, item.maxDist,debugColor);
			    this.ddt.drawCircle(item.x, item.y, item.minDist,debugColor);
			    //////////////////////////
		    }
	    };

        //Return constructor
        return RenderEngine;
    })();
});
