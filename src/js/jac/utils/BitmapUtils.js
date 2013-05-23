/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){

	    var BitmapUtils = {};

	    /**
	     * Creates an Image element from a canvas element.
	     * @param {canvas} $canvasEl
	     * @returns {Image} a dom <img> element
	     */
	    BitmapUtils.imgFromCanvas = function($canvasEl){
			var img = new Image();
		    img.src = $canvasEl.toDataURL('image/png');
		    return img;
	    };

        
        //Return constructor
        return BitmapUtils;
    })();
});
