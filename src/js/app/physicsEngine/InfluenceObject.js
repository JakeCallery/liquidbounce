/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/math/Vec2D',
'jac/math/Vec2DObj',
'jac/logger/Logger'],
function(Vec2D,Vec2DObj,L){
    return (function(){

	    //TODO: work out a smarter vector caching system
	    InfluenceObject.NO_DECAY = 0;
	    InfluenceObject.INSTANT_DECAY = NaN;
	    InfluenceObject.INFINITE_LIFETIME = 0;
	    InfluenceObject.ONESHOT_LIFETIME = NaN;
	    InfluenceObject.NO_ID = 'noId';

	    /**
         * Creates a InfluenceObject object
         * @param {Vec2DObj} $vector
         * @param {Number} [$decayRatePerTick=InfluenceObject.INSTANT_DECAY]
         * @param {int} [$lifetimeInTicks=InfluenceObject.INFINITE_LIFETIME]
         * @param {String} [$id=InfluenceObject.NO_ID]
         * @constructor
         */
        function InfluenceObject($vector, $decayRatePerTick, $lifetimeInTicks, $id){
			if($decayRatePerTick === undefined){$decayRatePerTick = InfluenceObject.INSTANT_DECAY;}
		    if($lifetimeInTicks === undefined){$lifetimeInTicks = InfluenceObject.INFINITE_LIFETIME;}
		    if($id === undefined){$id = InfluenceObject.NO_ID;}

		    var self = this;

		    this.decayRate = $decayRatePerTick;
		    this.id = $id;
		    this.isExpired = false;
			this.expireNextTick = false;
			this.ageInTicks = 0;

		    //TODO: maybe just mark these as private and move the privileged functions to the prototype saving memory
		    /**@type {Vec2DObj}*/var _cachedVector = $vector;
		    /**@type {Vec2DObj}*/var _direction = Vec2D.normalize(Vec2D.duplicate(_cachedVector));
		    /**@type {Number}*/var _magnitude = Vec2D.lengthOf(_cachedVector);

		    /**
		     * Update cached vector
		     * @returns {Vec2DObj} the cached vector
		     */
		    this.updateCachedVector = function(){
			    _cachedVector.x = _direction.x * _magnitude;
			    _cachedVector.y = _direction.y * _magnitude;
			    return _cachedVector;
		    };

		    this.getCachedVector = function(){
			    return _cachedVector;
		    };

		    /**
		     *
		     * @returns {Vec2DObj} direction vector
		     */
		    this.getDirection = function(){
			    return _direction;
		    };

		    /**
		     *
		     * @returns {Number}
		     */
		    this.getMagnitude = function(){
			    return _magnitude;
		    };

		    /**
		     * setter for direction
		     * @param {Number} $x
		     * @param {Number} $y
		     * @param {Boolean} [$forceReCache=false]
		     */
		    this.updateDirectionNormalized = function($x, $y, $forceReCache){
				_direction.x = $x;
			    _direction.y = $y;

			    if($forceReCache !== undefined && $forceReCache === true){
					self.updateCachedVector();
			    }
		    };

		    /**
		     *
		     * @param {Number} $value
		     * @param {Boolean} [$forceReCache=false]
		     */
		    this.updateMagnitude = function($value, $forceReCache){
				_magnitude = $value;

			    if($forceReCache !== undefined && $forceReCache === true){
				    self.updateCachedVector();
			    }

		    };

		    if(!isNaN($lifetimeInTicks)){
			    this.maxLifetime = $lifetimeInTicks;
		    } else if(isNaN($lifetimeInTicks)){
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
