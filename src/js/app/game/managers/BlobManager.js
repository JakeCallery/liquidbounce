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
'app/parts/blob/BlobPart',
'jac/linkedList/ILinkedListable',
'jac/linkedList/LinkedList',
'app/game/managers/IManager'],
function(EventDispatcher,ObjUtils, InfluenceList, L, IInfluenceable,
         InterfaceUtils, InfluenceObject, BlobPart, ILinkedListable, LinkedList,
		 IManager){
    return (function(){
        /**
         * Creates a BlobManager object
         * @extends {EventDispatcher}
         * @implements IManager
         * @constructor
         */
        function BlobManager(){
            //super
            EventDispatcher.call(this);

	        /**
	         *
	         * @type {LinkedList}
	         * @private
	         */
	        this._blobList = new LinkedList();

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BlobManager,EventDispatcher);

	    /**
	     *
	     * @param {BlobPart} $blobPart
	     */
	    BlobManager.prototype.addObject = function($blobPart){
			this._blobList.addNode($blobPart);
		    $blobPart.addManager(this);
	    };

	    /**
	     *
	     * @param {BlobPart} $blobPart
	     */
	    BlobManager.prototype.removeObject = function($blobPart){
			this._blobList.removeNodeByObject($blobPart);
		    $blobPart.removeManager(this);
	    };

	    /**
	     * @param {Number} [$tickDelta=1]
	     */
	    BlobManager.prototype.updateBlobParts = function($tickDelta){
		    var self = this;

		    if($tickDelta === undefined){$tickDelta = 1;}

		    /**@type {BlobPart}*/ var bp = null;
		    /**@type {InfluenceObject}*/ var ifo = null;
			self._blobList.resetCurrent();
		    //for(var i = 0, l = self._blobList.length; i < l; i++){
		    var node = self._blobList.getNext();
		    while(node !== null){
			    bp = node.obj;
			    if(bp.influenceList.getLength() > 0){
				    //Apply influences
				    var influences = bp.influenceList.getList();
				    bp.influenceList.cachedResult = influences[0].getCachedVector();
				    for(var k = 1, c = influences.length; k < c; k++){
					    ifo = influences[k];
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

			    node = self._blobList.getNext();
		    }
	    };


	    //Return constructor
        return BlobManager;
    })();
});
