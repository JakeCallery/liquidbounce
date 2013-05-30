/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/physicsEngine/InfluenceObject'],
function(InfluenceObject){
    return (function(){
        var IInfluencable = {};

	    /** @type {Array.<InfluenceObject>} */
	    IInfluencable.influenceList = [];
        
        //Return constructor
        return IInfluencable;
    })();
});
