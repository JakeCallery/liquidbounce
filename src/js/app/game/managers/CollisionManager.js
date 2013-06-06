/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/managers/IManager',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils,IManager,L){
    return (function(){
        /**
         * Creates a CollisionManager object
         * @extends {EventDispatcher}
         * @implements {IManager}
         * @constructor
         */
        function CollisionManager(){
            //super
            EventDispatcher.call(this);

	        this._colObjList = [];
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(CollisionManager,EventDispatcher);

	    CollisionManager.prototype.addObject = function($collisonObj){
			this._colObjList.push($collisonObj);
	    };

	    CollisionManager.prototype.removeObject = function($collisionObj){
			var idx = this._colObjList.indexOf($collisionObj);
		    if(idx !== -1){
			    //remove
			    this._colObjList.splice(idx, 1);
		    } else {
			    L.warn('Collision object not found in list, could not remove');
		    }
	    };

	    /**
	     *
	     * @param {LinkedList} $blobList
	     * @param {int} $tickDelta
	     */
	    CollisionManager.prototype.calcCollisions = function($blobList, $tickDelta){
			$blobList.resetCurrent();

		    var bp = null;
		    var node = $blobList.getNext();

		    while(node !== null){
			    bp = node.obj;
			    //Loop through blob parts and build position rects
			    //Then check those rects against collision objects
			    //if intersecting, do a proper collision detection
		    }
	    };

        //Return constructor
        return CollisionManager;
    })();
});
