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
        var IRenderable = {};
	    IRenderable.renderType = '';
	    IRenderable.renderSrc = {};
	    IRenderable.renderX = 0.0;
	    IRenderable.renderY = 0.0;
	    IRenderable.renderZ = 0.0;
        
        
        //Return constructor
        return IRenderable;
    })();
});
