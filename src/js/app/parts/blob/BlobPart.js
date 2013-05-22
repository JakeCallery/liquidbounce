/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/game/GameObject',
'jac/utils/ObjUtils',
'jac/pool/IPoolable',
'jac/logger/Logger',
'app/renderEngine/IBitmapRenderable',
'app/renderEngine/RenderTypes'],
function(GameObject,ObjUtils,IPoolable,L, IBitmapRenderable, RenderTypes){
    return (function(){
        /**
         * Creates a BlobPart object
         * @extends {GameObject}
         * @implements {IPoolable}
         * @implements {IBitmapRenderable}
         * @constructor
         */
        function BlobPart(){
            //super
            GameObject.call(this);

	        this.x = 0;
	        this.y = 0;

	        this.renderSrc = null;
	        this.renderWidth = 30;
	        this.renderHeight = 30;
	        this.renderX = 0;
	        this.renderY = 0;
	        this.renderZ = 0;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BlobPart,GameObject);

	    BlobPart.prototype.destroy = function(){
		    BlobPart.superClass.destroy.call(this);
		    L.log('Destroy Blobpart', '@bpart');
	    };

	    //// IPoolable ////
	    BlobPart.prototype.init = function($configObj){
			this.x = $configObj.x;
		    this.y = $configObj.y;
		    L.log('Inint Blobpart', '@bpart');
	    };

	    BlobPart.prototype.recycle = function(){
			this.x = -1;
		    this.y = -1;
		    L.log('Recycle BlobPart', '@bpart');
	    };

        //Return constructor
        return BlobPart;
    })();
});
