/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/parts/field/Polarity',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils,Polarity,L){
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
				//TODO: add field effect onto cached influenceList vector
				bp = node.obj;

			    //Loop through each field
			    for(var f = 0, l = this._fields.length; f < l; f++){
					field = this._fields[f];
					boundsRect = field.boundsRect;

				    if(!(bp.x > boundsRect.getRight() || bp.x < boundsRect.getLeft() ||
					     bp.y > boundsRect.getBottom() || bp.y < boundsRect.getTop())){
					    //within bounding rect, keep checking
						if(this.polarity === Polarity.REPEL){
							tmpVec.x = bp.x - field.x;
							tmpVec.y = bp.y - field.y;
						} else if(this.polarity === Polarity.ATTRACT){
							tmpVec.x = field.x - bp.x;
							tmpVec.y = field.y = bp.y;
						} else {
							L.error('Bad Polarity Type: ' + this.polarity, true);
						}

					    //Make sure we are within the circle of influence
					    var tmpDist = Vec2D.lengthOf(tmpVec);
					    if(tmpDist <= this.maxDist){
						    //this field will affect the blob
						    //TODO: START HERE!
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
