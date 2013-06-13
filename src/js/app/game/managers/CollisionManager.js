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
'app/debug/DebugDrawTool',
'app/game/collision/CollisionSides'],
function(EventDispatcher,ObjUtils,IManager,L,Rectangle,Vec2D,Vec2DObj,DebugDrawTool,CollisionSides){
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

		    //var ddt = new DebugDrawTool();

		    $blobList.resetCurrent();
		    var node = $blobList.getNext();
			/**@type {Rectangle}*/var rect = new Rectangle(0,0,1,1);

		    while(node !== null){
			    /**@type {BlobPart}*/bp = node.obj;
			    if(bp.ignoreNextCollision !== true){
				    //L.log('calc collisions', '@collision');
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

					    //ddt.drawRectangle(rect.x, rect.y, rect.width, rect.height,'#AAAAAA');
					   // ddt.drawRectangle(obj.colRect.x, obj.colRect.y, obj.colRect.width, obj.colRect.height, '#AA00AA');

					    //if intersecting, do a proper collision detection
					    if(rect.intersectsRect(obj.colRect)){
						    //L.log('---- possible collision, dig deeper ----', '@collision');
							var blobMoveVec = new Vec2DObj(0,0,0,0);
						    Vec2D.vecFromLineSeg(blobMoveVec, bp.prevX, bp.prevY, bp.x, bp.y);
							var shellVec = null;
							var baseVec = new Vec2DObj(0,0,0,0);
							var prevBaseVec = new Vec2DObj(0,0,0,0);
							var shellVecLeftNormal = null;

						    //check against all shell vects
						    for(var v = 0, c = obj.shellVecList.length; v < c; v++){
							    shellVec = obj.shellVecList[v];
							    shellVecLeftNormal = Vec2D.duplicate(shellVec);
							    Vec2D.calcLeftNormal(shellVecLeftNormal, shellVec);
							    Vec2D.vecFromLineSeg(prevBaseVec, bp.prevX, bp.prevY, shellVec.xOffset, shellVec.yOffset);
							    Vec2D.vecFromLineSeg(baseVec, bp.x, bp.y, shellVec.xOffset, shellVec.yOffset);
							    var dp1 = Vec2D.scaledDot(baseVec, shellVec);
							    var dp2 = Vec2D.scaledDot(baseVec, shellVecLeftNormal);
							    var dp3 = Vec2D.scaledDot(prevBaseVec, shellVecLeftNormal);

							    //L.log('DP1: ' + dp1, '@collision');
							    //L.log('DP2: ' + dp2, '@collision');
							    //L.log('DP3: ' + dp3, '@collision');
							    //L.log('ShellVec Length: ' + Vec2D.lengthOf(shellVec), '@collision');

							    //DEBUG
							    //ddt.drawLine(blobMoveVec.xOffset, blobMoveVec.yOffset, (blobMoveVec.x + blobMoveVec.xOffset), (blobMoveVec.y + blobMoveVec.yOffset), '#00FFFF');
							    //ddt.drawLine(baseVec.xOffset, baseVec.yOffset, (baseVec.x + baseVec.xOffset), (baseVec.y + baseVec.yOffset), '#FFFFFF');
							    //ddt.drawLine(shellVec.xOffset, shellVec.yOffset, (shellVec.x + shellVec.xOffset), (shellVec.y + shellVec.yOffset), '#FF00FF');
							    //ddt.drawLine(shellVecLeftNormal.xOffset, shellVecLeftNormal.yOffset, (shellVecLeftNormal.x + shellVecLeftNormal.xOffset), (shellVecLeftNormal.y + shellVecLeftNormal.yOffset), '#FFFF00');
							    ////////////////////

							    //Check to see if the point is within the scope of the shell vector line segment
							    if(dp1 > -(Vec2D.lengthOf(shellVec)) && dp1 < 0){
								   // L.log('-- IN SCOPE --', '@collision');

									var prevSide = CollisionSides.NONE;
								    var currentSide = CollisionSides.NONE;

								    if(dp2 > 0){
									    currentSide = CollisionSides.RIGHT;
								    } else {
									    currentSide = CollisionSides.LEFT;
								    }

								    if(dp3 > 0){
									    prevSide = CollisionSides.RIGHT;
								    } else {
									    prevSide = CollisionSides.LEFT
								    }


								    //has the point crossed from from left to right
								    //L.log('PrevSide: ' + prevSide, '@collision');
								    //L.log('CurrentSide: ' + currentSide, '@collision');
								    if(dp2 === 0 || (currentSide !== prevSide)){
									    //L.log('---- !!COLLIDED!! ----', '@collision');

									    //Move blob to actual collision point
									    var moveLen = Vec2D.lengthOf(blobMoveVec);
									    var colForceX = (blobMoveVec.x / moveLen) * Math.abs(dp2);
									    var colForceY = (blobMoveVec.y / moveLen) * Math.abs(dp2);
									    //var colVec = new Vec2DObj(colForceX, colForceY);
										bp.x -= colForceX;
									    bp.y -= colForceY;

									    //Calc bounce vector
										var movecolDP = Vec2D.scaledDot(blobMoveVec, shellVec);

									    //Find projections
									    var shellVecLength = Vec2D.lengthOf(shellVec);
									    var p1_x = movecolDP * shellVec.x / shellVecLength;
									    var p1_y = movecolDP * shellVec.y / shellVecLength;

									    var movColLeftNormalDP = Vec2D.scaledDot(blobMoveVec, shellVecLeftNormal);
										var colLeftNormalLen = Vec2D.lengthOf(shellVecLeftNormal);
									    var p2_x = movColLeftNormalDP * shellVecLeftNormal.x / colLeftNormalLen;
									    var p2_y = movColLeftNormalDP * shellVecLeftNormal.y / colLeftNormalLen;

									    //Reverse projections
									    p2_x *= -1;
									    p2_y *= -1;

									    //Calc bounce
									    var bounce_x = p1_x + p2_x;
									    var bounce_y = p1_y + p2_y;
									    //ddt.drawLine(bp.x, bp.y, (bp.x + bounce_x) * 2, (bp.y + bounce_y) * 2,'#FFFF00');

									    //Reset prevX/Y to 'bounce' the particle
										bp.prevX = bp.x + (bounce_x * -1);
										bp.prevY = bp.y + (bounce_y * -1);

									    bp.ignoreNextCollision = true;

								    }

							    }

						    }


					    } else {
						    //skip
						    //L.log('No chance of collision, skipping', '@collision');
					    }
				    }

				} else {
					bp.ignoreNextCollision = false;
				}

				//get next node
			    node = $blobList.getNext();
		    }
	    };

        //Return constructor
        return CollisionManager;
    })();
});
