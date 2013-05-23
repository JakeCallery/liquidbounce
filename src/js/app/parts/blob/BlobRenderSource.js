/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'libs/domReady!',
'jac/utils/BitmapUtils',
'jac/logger/Logger',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/events/JacEvent'
],
function(doc, BitmapUtils, L, EventDispatcher, ObjUtils, EventUtils, JacEvent){
    return (function(){
        /**
         * Creates a BlobRenderSource object
         * Be aware it won't be ready until the 'ready' event is dispatched
         * @extends {EventDispatcher}
         * @constructor
         */
        function BlobRenderSource($width, $height, $color){

	        //super
	        EventDispatcher.call(this);

	        var self = this;

	        this.isReady = false;

	        this.width = $width;
	        this.height = $height;
	        this.color = $color;

	        this.canvas = doc.createElement('canvas');
			this.srcContext = this.canvas.getContext('2d');
	        this.srcImage = null;

	        this.handleImageLoaded = function(){
		        L.log('Blob Image Ready');
		        this.isReady = true;
		        this.dispatchEvent(new JacEvent('ready'));
	        };

	        //Fill context with blob bitmap
	        this.srcContext.beginPath();
	        this.srcContext.arc(this.width/2, this.height/2, this.width/2, 0, 2*Math.PI,false);
	        this.srcContext.fillStyle = this.color;
	        this.srcContext.fill();

			this.srcImage = BitmapUtils.imgFromCanvas(this.canvas);
	        EventUtils.addDomListener(this.srcImage, 'load', EventUtils.bind(self, self.handleImageLoaded));

        }

	    //Inherit / Extend
	    ObjUtils.inheritPrototype(BlobRenderSource,EventDispatcher);
        
        //Return constructor
        return BlobRenderSource;
    })();
});
