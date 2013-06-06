/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: Abstract this out to DispenserRenderSource

define([
'libs/domReady!',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'app/renderEngine/BitmapRenderSource'],
function(doc, EventDispatcher,ObjUtils,L,BitmapRenderSource){
    return (function(){
        /**
         * Creates a TestDispenserRenderSource object
         * @extends {EventDispatcher}
         * @constructor
         */
        function TestDispenserRenderSource($width, $height, $color){
            //super
            BitmapRenderSource.call(this, $width, $height, $color);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(TestDispenserRenderSource,BitmapRenderSource);
        
        //Return constructor
        return TestDispenserRenderSource;
    })();
});
