/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
	return (function(){
		/**
		 * @interface
		 */
		var IBitmapRenderable = {};

		IBitmapRenderable.renderSrc = {};
		IBitmapRenderable.renderImgData = {};
		IBitmapRenderable.renderWidth = 0;
		IBitmapRenderable.renderHeight = 0;
		IBitmapRenderable.renderX = 0;
		IBitmapRenderable.renderY = 0;
		IBitmapRenderable.renderZ = 0;


		//Return constructor
		return IBitmapRenderable;
	})();
});
