/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/physicsEngine/InfluenceList',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils, InfluenceList, L){
    return (function(){
        /**
         * Creates a PhysicsEngine object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PhysicsEngine(){
            //super
            EventDispatcher.call(this);

	        /**@type {Array.<InfluenceList>}*/
	        this.influenceLists = [];

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PhysicsEngine,EventDispatcher);

	    PhysicsEngine.prototype.addInfluenceList = function($influenceList){
			this.influenceLists.push($influenceList);
	    };

	    PhysicsEngine.prototype.removeInfluenceList = function($influenceList){
		    var idx = this.influenceLists.indexOf($influenceList);

		    if(idx !== -1){
			    //remove
			    this.influenceLists.splice(idx, 1);
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
		    for(var i = 0, l = this.influenceLists.length; i < l; i++){
			    ifl = this.influenceLists[i];
			    for(var k = 0, c = ifl.length; k < c; k++){
					ifo = ifl[k];

				    if(ifo.magnitude === 0 && isNaN(ifo.maxLifetime)){
					    //force expire
					    ifo.expire();
				    }

				    //handle decay
				    if(!ifo.isExpired){
					    //If NaN, keep alive this tick, and expire next
					    if(isNaN(ifo.decayRate)){
						    ifo.expire();
					    } else if(ifo.magnitude === 0 && !isNaN(ifo.maxLifetime) && ifo.maxLifetime != InfluenceObject.INFINITE_LIFETIME){
						    ifo.expire();
					    } else {
						    //decay
						    ifo.magnitude = ((ifo.magnitude - ifo.decayRate) >= 0)?(ifo.magnitude-ifo.decayRate):0;
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

			    //Apply influences
			    for(var k = 0, c = bp.influenceList.length; k < c; k++){
				    ifo = bp.influenceList[k];
				    //TODO: Apply influences to blob part
				    //Put InfluenceList.getResult here, (take it out of the list object)
			    }

		    }
	    };

        //Return constructor
        return PhysicsEngine;
    })();
});
