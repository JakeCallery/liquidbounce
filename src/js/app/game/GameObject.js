/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/events/GameObjEvent',
'jac/events/JacEvent'],
function(EventDispatcher,ObjUtils,GameObjEvent, JacEvent){
    return (function(){
        /**
         * Creates a GameObject object
         * @extends {EventDispatcher}
         * @constructor
         */
        function GameObject(){
            //super
            EventDispatcher.call(this);

	        this.destroyedEvent = new JacEvent(GameObjEvent.DESTROYED);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(GameObject,EventDispatcher);

	    GameObject.prototype.destroy = function(){
		    this.dispatchEvent(this.destroyedEvent)
	    };

        //Return constructor
        return GameObject;
    })();
});
