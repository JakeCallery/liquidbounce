/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'libs/domReady!',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'app/renderEngine/BitmapRenderSource'],
function(doc, EventDispatcher,ObjUtils,L,BitmapRenderSource){
    return (function(){
        /**
         * Creates a TestDeflectorRenderSource object
         * @constructor
         */
        function TestDeflectorRenderSource($width, $height, $color){
	        //super
	        BitmapRenderSource.call(this, $width, $height, $color);

        }

	    //Inherit / Extend
	    ObjUtils.inheritPrototype(TestDeflectorRenderSource,BitmapRenderSource);

        //Return constructor
        return TestDeflectorRenderSource;
    })();
});
