/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

	    GameObjEvent.DESTROYED = 'gameObjDestroyedEvent';

	    /**
         * Creates a GameObjEvent object
         * @param {String} $type
         * @param {Object} [$data]
         * @extends {JacEvent}
         * @constructor
         */
        function GameObjEvent($type, $data){
            //super
            JacEvent.call(this, $type, $data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(GameObjEvent,JacEvent);
        
        //Return constructor
        return GameObjEvent;
    })();
});
