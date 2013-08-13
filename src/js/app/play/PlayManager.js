/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils'],
function(EventDispatcher,ObjUtils,EventUtils){
    return (function(){
        /**
         * Creates a PlayManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PlayManager($inputManager, $game){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.inputManager = $inputManager;
			this.game = $game;

	        this.inputManager.addListener('fingerAdded', EventUtils.bind(self, self.handleFingerAdded));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PlayManager,EventDispatcher);

	    PlayManager.prototype.handleFingerAdded = function($e){
		      
	    };

        //Return constructor
        return PlayManager;
    })();
});
