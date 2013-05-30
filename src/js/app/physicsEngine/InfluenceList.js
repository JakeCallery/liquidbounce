/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/utils/ArrayUtils',
'jac/math/Vec2D'],
function(ArrayUtils, Vec2D){
    return (function(){
        /**
         * Creates a InfluenceList object
         * @constructor
         */
        function InfluenceList(){
	        /**
	         * @private
	         * @type {Array}
	         */
	        this._list = [];

	        /**
	         * @public
	         * @type {Vec2DObj}
	         */
	        this.cachedResult = new Vec2DObj(0,0);
        }

	    InfluenceList.prototype.getLength = function(){
		    return this._list.length;
	    };

	    InfluenceList.prototype.getList = function(){
		    return this._list;
	    };

	    InfluenceList.prototype.clear = function(){
		    this._list.length = 0;
	    };

	    InfluenceList.prototype.removeAllBut = function($influenceObj){
		    this._list.length = 0;
		    this._list.push($influenceObj);
	    };

	    InfluenceList.prototype.addInfluence = function($influenceObj){
	        //TODO: Add duplicate checking
		    this._list.push($influenceObj);
	    };

	    InfluenceList.prototype.getInfluenceById = function($id){
			return ArrayUtils.findFirstObjWithProp(this._list, 'id', $id);
	    };

	    InfluenceList.prototype.getAllInfluencesById = function($id){
			return ArrayUtils.findAllObjsWithProp(this._list, 'id', $id);
	    };

        //Return constructor
        return InfluenceList;
    })();
});
