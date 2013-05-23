/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'libs/domReady!',
'jac/utils/BitmapUtils'
],
function(doc, BitmapUtils){
    return (function(){
        /**
         * Creates a BlobRenderSource object
         * @constructor
         */
        function BlobRenderSource($width, $height, $color){
			this.width = $width;
	        this.height = $height;
	        this.color = $color;

	        this.canvas = doc.createElement('canvas');
			this.srcContext = this.canvas.getContext('2d');
	        this.srcImage = null;

	        //Fill context with blob bitmap
	        this.srcContext.beginPath();
	        this.srcContext.arc(this.width/2, this.height/2, this.width/2, 0, 2*Math.PI,false);
	        this.srcContext.fillStyle = this.color;
	        this.srcContext.fill();

			this.srcImage = BitmapUtils.imgFromCanvas(this.canvas);

        }
        
        
        //Return constructor
        return BlobRenderSource;
    })();
});
