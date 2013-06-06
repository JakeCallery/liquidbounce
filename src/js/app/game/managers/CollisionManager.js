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
			var self = this;
		    this._colObjList.push($collisonObj);
		    $collisonObj.addManager(self);
	    };

	    CollisionManager.prototype.removeObject = function($collisionObj){
			var idx = this._colObjList.indexOf($collisionObj);
		    if(idx !== -1){
			    //remove
			    var self = this;
			    this._colObjList.splice(idx, 1);
			    $collisionObj.removeManager(self);
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
			    //TODO: Start here (collision stuff)
			    //Loop through blob parts and build position rects
			    //Then check those rects against collision objects
			    //if intersecting, do a proper collision detection
			    node = $blobList.getNext();
		    }
	    };

        //Return constructor
        return CollisionManager;
    })();
});
