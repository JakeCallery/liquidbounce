/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/utils/ArrayUtils'],
function(ArrayUtils){
    return (function(){
        /**
         * Creates a InfluenceList object
         * @constructor
         */
        function InfluenceList(){
            this.list = [];
        }

	    InfluenceList.prototype.clear = function(){
		    this.list.length = 0;
	    };

	    InfluenceList.prototype.removeAllBut = function($influenceObj){
		    this.list.length = 0;
		    this.list.push($influenceObj);
	    };

	    InfluenceList.prototype.addInfluence = function($influenceObj){
	        //TODO: Add duplicate checking
		    this.list.push($influenceObj);
	    };

	    InfluenceList.prototype.getInfluenceById = function($id){
			return ArrayUtils.findFirstObjWithProp(this.list, 'id', $id);
	    };

	    InfluenceList.prototype.getAllInfluencesById = function($id){
			return ArrayUtils.findAllObjsWithProp(this.list, 'id', $id);
	    };

        //Return constructor
        return InfluenceList;
    })();
});
