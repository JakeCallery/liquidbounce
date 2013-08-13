/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a PlayManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PlayManager($inputManager){
            //super
            EventDispatcher.call(this);

	        this.inputManager = $inputManager;


        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PlayManager,EventDispatcher);
        
        //Return constructor
        return PlayManager;
    })();
});
