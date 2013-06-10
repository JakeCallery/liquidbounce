/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/managers/IManager',
'jac/logger/Logger',
'jac/geometry/Rectangle',
'jac/math/Vec2D',
'jac/math/Vec2DObj',
'app/debug/DebugDrawTool'],
function(EventDispatcher,ObjUtils,IManager,L,Rectangle,Vec2D,Vec2DObj,DebugDrawTool){
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

		    ddt = new DebugDrawTool();

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
			    var y2 = bp.y;

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
			    for(var i = 0, l = this._colObjList.length; i < l; i++){
				    var obj = this._colObjList[i];
				    var colRect = obj.colRect;
				    colRect.x = obj.renderX;
				    colRect.y = obj.renderY;

				    if(rect.intersectsRect(obj.colRect)){
					    L.log('---- possible collision, dig deeper ----', '@collision');
						var blobMoveVec = new Vec2DObj(0,0,0,0);
						var shellVec = null;
						var baseVec = new Vec2DObj(0,0,0,0);
						var shellVecLn = null;
					    //check against all shell vects
					    for(var v = 0, c = obj.shellVecList.length; v < c; v++){
						    shellVec = obj.shellVecList[v];
						    shellVecLn = Vec2D.duplicate(shellVec);
						    Vec2D.calcLeftNormal(shellVecLn, shellVec);
							Vec2D.vecFromLineSeg(baseVec, obj.x, obj.y, shellVec.xOffset, shellVec.yOffset);
						    var dp1 = Vec2D.scaledDot(baseVec, shellVec);
						    var dp2 = Vec2D.scaledDot(baseVec, shellVecLn);

						    //DEBUG
						    ddt.drawLine(baseVec.xOffset, baseVec.yOffset, (baseVec.x + baseVec.xOffset), (baseVec.y + baseVec.yOffset), '#FFFFFF');
						    ddt.drawLine(shellVec.xOffset, shellVec.yOffset, (shellVec.x + shellVec.xOffset), (shellVec.y + shellVec.yOffset), '#FF00FF');
						    ddt.drawLine(shellVecLn.xOffset, shellVecLn.yOffset, (shellVecLn.x + shellVecLn.xOffset), (shellVecLn.y + shellVecLn.yOffset), '#FFFF00');
						    ////////////////////

						    //TODO: Continue Here (pg. 123) START HERE
						    //Check to see if the point is within the scope of the shell vector line segment
						    if(dp1 > -(Vec2D.lengthOf(shellVec)) && dp1 < 0){
							    //has the point crossed from from left to right
							    if(dp2 <= 0){
								    L.log('---- !!COLLIDED!! ----');
							    }

						    }

					    }


				    } else {
					    //skip
					    L.log('No chance of collision, skipping', '@collision');
				    }
			    }


			    //if intersecting, do a proper collision detection
			    node = $blobList.getNext();
		    }
	    };

        //Return constructor
        return CollisionManager;
    })();
});
