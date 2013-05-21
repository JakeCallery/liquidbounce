/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/game/GameObject',
'jac/utils/ObjUtils',
'jac/pool/IPoolable',
'jac/logger/Logger'],
function(GameObject,ObjUtils,IPoolable,L){
    return (function(){
        /**
         * Creates a BlobPart object
         * @extends {GameObject}
         * @implements {IPoolable}
         * @constructor
         */
        function BlobPart(){
            //super
            GameObject.call(this);

	        this.x = 0;
	        this.y = 0;
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
