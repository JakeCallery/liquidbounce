/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['libs/domReady!'],
function(doc){
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

	        //Fill context with blob bitmap
	        this.renderSrc.beginPath();
	        this.renderSrc.arc(this.width/2, this.height/2, this.width/2, 0, 2*Math.PI,false);
	        this.renderSrc.fillStyle = this.color;
	        this.renderSrc.fill();
        }
        
        
        //Return constructor
        return BlobRenderSource;
    })();
});
