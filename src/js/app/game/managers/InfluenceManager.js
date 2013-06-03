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
'app/game/managers/IManager'],
function(EventDispatcher,ObjUtils,InfluenceList, L, IInfluenceable, InterfaceUtils, InfluenceObject, IManager){
    return (function(){
        /**
         * Creates a InfluenceManager object
         * @extends {EventDispatcher}
         * @implements {IManager}
         * @constructor
         */
        function InfluenceManager(){
            //super
            EventDispatcher.call(this);

	        /**
	         * @type {Array.<IInfluenceable>}
	         */
	        this.influenceableObjs = [];

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InfluenceManager,EventDispatcher);

	    InfluenceManager.prototype.addObject = function($influenceableObj){
		    var result = InterfaceUtils.objectImplements($influenceableObj, IInfluenceable);
		    if(result === true){
			    this.influenceableObjs.push($influenceableObj);
			    $influenceableObj.addManager(this);
		    } else {
			    throw new Error(result);
		    }

	    };

	    InfluenceManager.prototype.removeObject = function($influenceableObj){
		    var idx = this.influenceableObjs.indexOf($influenceableObj);

		    if(idx !== -1){
			    //remove
			    this.influenceableObjs.splice(idx, 1);
			    $influenceableObj.removeManager(this);
		    } else {
			    L.warn('influence list not found in physics engine, could not remove...');
		    }
	    };

	    InfluenceManager.prototype.tickInfluenceLists = function($tickDelta){
		    if($tickDelta === undefined){$tickDelta = 1;}

		    //Manually update the influence objects
		    //put InfluenceObject "tick" method here
		    /**@type {InfluenceObject}*/ var ifo = null;
		    /**@type {InfluenceList}*/ var ifl = null;
		    for(var i = 0, l = this.influenceableObjs.length; i < l; i++){
			    ifl = this.influenceableObjs[i].influenceList;
			    var iflList = ifl.getList();
			    for(var k = 0, c = ifl.getLength(); k < c; k++){
				    ifo = iflList[k];
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
					    } else if(isNaN(ifo.maxLifetime)){
						    //ONE_SHOT, expire now
						    ifo.expire();
					    }

					    //deal with expire on next tick if needed
					    if(ifo.expireNextTick === true){
						    //expire now
						    ifo.expire();
					    }
				    }

				    if(ifo.isExpired){
					    ifl.removeInfluence(ifo);
				    }
			    }
		    }

	    };

        //Return constructor
        return InfluenceManager;
    })();
});
