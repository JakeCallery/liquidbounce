/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/physicsEngine/InfluenceList',
'jac/logger/Logger',
'app/physicsEngine/IInfluenceable',
'jac/utils/InterfaceUtils',
'app/physicsEngine/InfluenceObject',
'app/parts/blob/BlobPart'],
function(EventDispatcher,ObjUtils, InfluenceList, L, IInfluenceable,
         InterfaceUtils, InfluenceObject, BlobPart){
    return (function(){
        /**
         * Creates a BlobManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function BlobManager(){
            //super
            EventDispatcher.call(this);

	        /**
	         *
	         * @type {Array.<BlobPart>}
	         * @private
	         */
	        this._blobList = [];

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BlobManager,EventDispatcher);

	    /**
	     *
	     * @param {BlobPart} $blobPart
	     */
	    BlobManager.prototype.addBlobPart = function($blobPart){
			this._blobList.push($blobPart);
	    };

	    /**
	     *
	     * @param {BlobPart} $blobPart
	     */
	    BlobManager.prototype.removeBlobPart = function($blobPart){
			var idx = this._blobList.indexOf($blobPart);
		    if(idx != -1){
	            this._blobList.splice(idx,1);
		    } else {
			    L.warn('Blob not found in list, could not remove');
		    }
	    };

	    /**
	     * @param {Number} [$tickDelta=1]
	     */
	    BlobManager.prototype.updateBlobParts = function($tickDelta){
		    var self = this;

		    if($tickDelta === undefined){$tickDelta = 1;}

		    /**@type {BlobPart}*/ var bp = null;
		    /**@type {InfluenceObject}*/ var ifo = null;

		    for(var i = 0, l = self._blobList.length; i < l; i++){
			    bp = self._blobList[i];
			    if(bp.influenceList.getLength() > 0){
				    //Apply influences
				    var influences = bp.influenceList.getList();
				    bp.influenceList.cachedResult = influences[0].getCachedVector();
				    for(var k = 1, c = influences.length; k < c; k++){
					    ifo = influences[k];
					    //TODO: Apply influences to blob part (START HERE)
					    //Put InfluenceList.getResult here, (take it out of the list object)
					    var cached = ifo.getCachedVector();
					    bp.influenceList.cachedResult.x += cached.x;
					    bp.influenceList.cachedResult.y += cached.y;
				    }

				    //Handle actual movement
				    var tmpX = bp.x;
				    var tmpY = bp.y;

				    bp.vx = tmpX - bp.prevX / $tickDelta;
				    bp.vy = tmpY - bp.prevY / $tickDelta;

				    bp.prevX = bp.x;
				    bp.prevY = bp.y;

				    bp.vx += bp.influenceList.cachedResult.x;
				    bp.vy += bp.influenceList.cachedResult.y;
			    }

			    //Move the object
			    bp.x += bp.vx;
			    bp.y += bp.vy;
		    }
	    };


	    //Return constructor
        return BlobManager;
    })();
});
