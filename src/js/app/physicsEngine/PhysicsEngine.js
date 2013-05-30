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
'jac/utils/InterfaceUtils'],
function(EventDispatcher,ObjUtils, InfluenceList, L, IInfluenceable, InterfaceUtils){
    return (function(){
        /**
         * Creates a PhysicsEngine object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PhysicsEngine(){
            //super
            EventDispatcher.call(this);

	        /**
	         * @type {Array.<IInfluenceable>}
	         */
	        this.influenceableObjs = [];

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PhysicsEngine,EventDispatcher);

	    PhysicsEngine.prototype.addInfluenceable = function($influenceableObj){
			var result = InterfaceUtils.objectImplements($influenceableObj, IInfluenceable);
		    if(result === true){
			    this.influenceableObjs.push($influenceableObj);
		    } else {
				throw new Error(result);
			}

	    };

	    PhysicsEngine.prototype.removeInfluenceable = function($influenceableObj){
		    var idx = this.influenceableObjs.indexOf($influenceableObj);

		    if(idx !== -1){
			    //remove
			    this.influenceableObjs.splice(idx, 1);
		    } else {
			    L.warn('influence list not found in physics engine, could not remove...');
		    }
	    };

	    PhysicsEngine.prototype.tickInfluenceLists = function($tickDelta){
			if($tickDelta === undefined){$tickDelta = 1;}

			//Manually update the influence objects
		    //put InfluenceObject "tick" method here
		    /**@type {InfluenceObject}*/ var ifo = null;
		    /**@type {InfluenceList}*/ var ifl = null;
		    for(var i = 0, l = this.influenceableObjs.length; i < l; i++){
			    ifl = this.influenceableObjs[i].influenceList;
			    for(var k = 0, c = ifl.length; k < c; k++){
					ifo = ifl[k];
				    /**@type {Number}*/var mag = ifo.getMagnitude();
				    if(mag === 0 && isNaN(ifo.maxLifetime)){
					    //force expire
					    ifo.expire();
				    }

				    //handle decay
				    if(!ifo.isExpired){
					    //If NaN, keep alive this tick, and expire next
					    if(isNaN(ifo.decayRate)){
						    ifo.expire();
					    } else if(mag === 0 && !isNaN(ifo.maxLifetime) && ifo.maxLifetime != InfluenceObject.INFINITE_LIFETIME){
						    ifo.expire();
					    } else {
						    //decay
						    var newMag = ((mag - ifo.decayRate) >= 0)?(mag-ifo.decayRate):0;
						    ifo.updateMagnitude(newMag, true);
					    }

					    //handle lifetime
					    if(ifo.maxLifetime != InfluenceObject.INFINITE_LIFETIME && !isNaN(ifo.maxLifetime)){
						    //deal with age
						    if(ifo.ageInTicks <= ifo.maxLifetime){
							    ifo.ageInTicks += $tickDelta;
						    } else {
							    //expire (too old)
							    ifo.expire();
						    }
					    }

					    //deal with expire on next tick if needed
					    if(ifo.expireNextTick === true){
						    //expire now
						    ifo.expire();
					    }
				    }
			    }
		    }

	    };

	    PhysicsEngine.prototype.updateBlobParts = function($blobPartList){
		    var self = this;
		    /**@type {BlobPart}*/ var bp = null;
			/**@type {InfluenceObject}*/ var ifo = null;

		    for(var i = 0, l = $blobPartList.length; i < l; i++){
			    bp = $blobPartList[i];
			    if(bp.influenceList.getLength() === 0){continue;}

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
			    bp.prevX = bp.x;
			    bp.prevY = bp.y;
			    bp.x += bp.influenceList.cachedResult.x;
			    bp.y += bp.influenceList.cachedResult.y;
		    }
	    };

        //Return constructor
        return PhysicsEngine;
    })();
});
