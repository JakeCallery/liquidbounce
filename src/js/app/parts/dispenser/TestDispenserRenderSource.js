/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'libs/domReady!',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'jac/events/JacEvent',
'jac/utils/BitmapUtils',
'jac/utils/EventUtils'],
function(doc, EventDispatcher,ObjUtils,L,JacEvent,BitmapUtils,EventUtils){
    return (function(){
        /**
         * Creates a TestDispenserRenderSource object
         * @extends {EventDispatcher}
         * @constructor
         */
        function TestDispenserRenderSource($width, $height, $color){
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

	        L.log('New Test Dispenser', '@dispenser');

	        this.handleImageLoaded = function(){
		        L.log('dispenser image ready', '@dispenser');
		        this.isReady = true;
		        this.dispatchEvent(new JacEvent('ready'));
	        };

	        //Make image
	        this.srcContext.fillStyle = this.color;
	        this.srcContext.fillRect(0,0,this.width, this.height);

	        this.srcImage = BitmapUtils.imgFromCanvas(this.canvas);
	        EventUtils.addDomListener(this.srcImage, 'load', EventUtils.bind(self, self.handleImageLoaded));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(TestDispenserRenderSource,EventDispatcher);
        
        //Return constructor
        return TestDispenserRenderSource;
    })();
});
