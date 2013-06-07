/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/managers/IManager',
'jac/logger/Logger',
'jac/geometry/Rectangle'],
function(EventDispatcher,ObjUtils,IManager,L,Rectangle){
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

	        /** @private */
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

		    var bp = null;

		    $blobList.resetCurrent();
		    var node = $blobList.getNext();
			/**@type {Rectangle}*/var rect = new Rectangle(0,0,1,1);

		    while(node !== null){
			    /**@type {BlobPart}*/bp = node.obj;
			    L.log('calc collisions', '@collision');
			    //Loop through blob parts and build position rects
				var minX,maxX;
			    var minY,maxY;
			    var x1 = bp.prevX;
			    var y1 = bp.prevY;
			    var x2 = bp.x;
			    var y2 = bp.x;

			    //Sort dimensions
			    if(x1 > x2){maxX=x1;minX=x2}else{maxX=x2;minX=x1;}
			    if(y1 > y2){maxY=y1;minY=y2}else{maxY=y2;minY=y1;}

			    //Create Rect
			    rect.x = minX;
			    rect.y = minY;
			    rect.width = maxX - minX;
			    rect.height = maxY - minY;

			    //Cap to a min of 1x1
			    if(rect.width == 0){rect.width = 1;}
			    if(rect.height == 0){rect.height = 1;}

			    //Then check those rects against collision objects
			    //TODO: Start here (collision stuff)
			    if(rect.intersectsRect())

			    //if intersecting, do a proper collision detection
			    node = $blobList.getNext();
		    }
	    };

        //Return constructor
        return CollisionManager;
    })();
});
