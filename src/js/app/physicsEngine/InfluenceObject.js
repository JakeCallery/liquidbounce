/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/math/Vec2D',
'jac/logger/Logger'],
function(Vec2D,L){
    return (function(){

	    InfluenceObject.NO_DECAY = 0;
	    InfluenceObject.INSTANT_DECAY = NaN;
	    InfluenceObject.INFINITE_LIFETIME = 0;
	    InfluenceObject.ONESHOT_LIFETIME = NaN;
	    InfluenceObject.NO_ID = 'noId';

	    /**
         * Creates a InfluenceObject object
         * @param {Vec2D} $vector
         * @param {Number} [$decayRatePerTick=InfluenceObject.INSTANT_DECAY]
         * @param {int} [$lifetimeInTicks=InfluenceObject.INFINITE_LIFETIME]
         * @param {String} [$id=InfluenceObject.NO_ID]
         * @constructor
         */
        function InfluenceObject($vector, $decayRatePerTick, $lifetimeInTicks, $id){
			if($decayRatePerTick === undefined){$decayRatePerTick = InfluenceObject.INSTANT_DECAY;}
		    if($lifetimeInTicks === undefined){$lifetimeInTicks = InfluenceObject.INFINITE_LIFETIME;}
		    if($id === undefined){$id = InfluenceObject.NO_ID;}

		    this.vector = $vector;

		    this.direction = Vec2D.normalize(Vec2D.duplicate($vector));
		    this.magnitude = Vec2D.lengthOf($directionVec2D);
			this.decayRate = $decayRatePerTick;
		    this.id = $id;
		    this.isExpired = false;
			this.expireNextTick = false;
			this.ageInTicks = 0;

		    if(!isNaN($lifetimeInTicks)){
			    this.maxLifetime = $lifetimeInTicks;
		    } else if(isNan($lifetimeInTicks)){
		        this.expireNextTick = true;
			    this.maxLifetime = InfluenceObject.ONESHOT_LIFETIME;
		    }

	    }

	    InfluenceObject.prototype.expire = function(){
		    this.isExpired = true;
	    };
        
        //Return constructor
        return InfluenceObject;
    })();
});
