/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/parts/field/Polarity',
'jac/logger/Logger',
'jac/math/Vec2DObj',
'jac/math/Vec2D',
'app/debug/DebugDrawTool'],
function(EventDispatcher,ObjUtils,Polarity,L,Vec2DObj,Vec2D,DebugDrawTool){
    return (function(){
        /**
         * Creates a FieldManager object
         * @extends {EventDispatcher}
         * @implements {IManager}
         * @constructor
         */
        function FieldManager(){
            //super
            EventDispatcher.call(this);

	        /**@private*/
	        this._fields = [];

	        this.ddt = new DebugDrawTool();
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(FieldManager,EventDispatcher);

	    FieldManager.prototype.addObject = function($field){
            var self = this;
		    this._fields.push($field);
		    $field.addManager(self);
	    };

	    FieldManager.prototype.removeObject = function($field){
		    var idx = this._fields.indexOf($field);
		    if(idx !== -1){
			    //remove
			    var self = this;
			    this._fields.splice(idx,1);
			    $field.removeManager(self);
		    }
	    };

	    FieldManager.prototype.calcFieldInfluences = function($blobList, $tickDelta){
		    var bp = null;
			var field = null;
			var boundsRect = null;
		    var tmpVec = new Vec2DObj(0,0,0,0);
		    $blobList.resetCurrent();
		    var node = $blobList.getNext();

		    while(node !== null){
				bp = node.obj;

			    //clear past field influences
				bp.fieldInfluenceVec.x = 0;
			    bp.fieldInfluenceVec.y = 0;
			    bp.fieldInfluenceVec.xOffset = 0;
			    bp.fieldInfluenceVec.yOffset = 0;

			    //Loop through each field
			    for(var f = 0, l = this._fields.length; f < l; f++){
					field = this._fields[f];
					boundsRect = field.boundsRect;
					this.ddt.drawRectangle(boundsRect.x, boundsRect.y, boundsRect.width, boundsRect.height, '#00FF00');
				    if(!(bp.x > boundsRect.getRight() || bp.x < boundsRect.getLeft() ||
					     bp.y > boundsRect.getBottom() || bp.y < boundsRect.getTop())){
					    //within bounding rect, keep checking
						if(field.polarity === Polarity.REPEL){
							tmpVec.x = bp.x - field.x;
							tmpVec.y = bp.y - field.y;
						} else if(field.polarity === Polarity.ATTRACT){
							tmpVec.x = field.x - bp.x;
							tmpVec.y = field.y - bp.y;
						} else {
							L.error('Bad Polarity Type: ' + field.polarity, true);
						}

					    //Make sure we are within the circle of influence
					    var tmpDist = Vec2D.lengthOf(tmpVec);
					    if(tmpDist <= field.maxDist){
						    //this field will affect the blob
						    //Cap at min if needed
						    if(tmpDist < field.minDist){tmpDist = 0;}

						    var strengthPercent = (1 - (tmpDist / field.maxDist));
						    Vec2D.normalize(tmpVec);
						    Vec2D.multScalar(tmpVec,(field.strength * strengthPercent));

						    //Apply
							bp.fieldInfluenceVec.x += tmpVec.x;
							bp.fieldInfluenceVec.y += tmpVec.y;

					    }

				    }

			    }

			    node = $blobList.getNext();
		    }

	    };

        //Return constructor
        return FieldManager;
    })();
});
