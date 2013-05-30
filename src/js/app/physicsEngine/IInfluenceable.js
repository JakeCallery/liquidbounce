/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/physicsEngine/InfluenceList'],
function(InfluenceList){
    return (function(){
	    /**
	     * @interface
	     */
        var IInfluenceable = {};

	    /** @type {InfluenceList} */
	    IInfluenceable.influenceList = {};
        
        //Return constructor
        return IInfluenceable;
    })();
});
