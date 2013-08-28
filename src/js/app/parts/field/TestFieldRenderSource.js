/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/renderEngine/BitmapRenderSource',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/utils/BitmapUtils',
'jac/logger/Logger'],
function(BitmapRenderSource,ObjUtils,EventUtils,BitmapUtils,L){
    return (function(){
        /**
         * Creates a TestFieldRenderSource object
         * @extends {BitmapRenderSource}
         * @constructor
         */
        function TestFieldRenderSource($radius, $color){
            //super
            BitmapRenderSource.call(this, $radius*2, $radius*2, $color);

	        this.radius = $radius;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(TestFieldRenderSource,BitmapRenderSource);

	    TestFieldRenderSource.prototype.init = function(){
		    var self = this;

		    //L.log('Init TestFieldRenderSource', '@render');

		    //Make image
		    this.srcContext.fillStyle = this.color;
		    this.srcContext.arc(this.radius, this.radius, this.radius,0,2*Math.PI,false);
			this.srcContext.fill();
		    //this.srcContext.fillRect(0,0,this.width, this.height);
		    this.srcImage = BitmapUtils.imgFromCanvas(this.canvas);
		    EventUtils.addDomListener(self.srcImage, 'load', EventUtils.bind(self, self.handleImageLoaded));

	    };

        //Return constructor
        return TestFieldRenderSource;
    })();
});
