/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a PhysicsEngine object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PhysicsEngine(){
            //super
            EventDispatcher.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PhysicsEngine,EventDispatcher);
        
        //Return constructor
        return PhysicsEngine;
    })();
});
