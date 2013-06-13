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
         * Creates a FieldManager object
         * @extends {EventDispatcher}
         * @implements {IManager}
         * @constructor
         */
        function FieldManager(){
            //super
            EventDispatcher.call(this);

	        /**@private*/
	        this._fields = [];
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(FieldManager,EventDispatcher);

	    FieldManager.prototype.addObject = function($field){
            var self = this;
		    this._fields.push($field);
		    $field.addManager(self);
	    };

	    FieldManager.prototype.removeObject = function($field){
		    var idx = this._fields.indexOf($field);
		    if(idx !== -1){
			    //remove
			    var self = this;
			    this._fields.splice(idx,1);
			    $field.removeManager(self);
		    }
	    };

	    FieldManager.prototype.calcFieldInfluences = function($blobList, $tickDelta){
		    var bp = null;

		    $blobList.resetCurrent();
		    var node = $blobList.getNext();

		    while(node !== null){
				//TODO: add field effect onto cached influenceList vector
			    node = $blobList.getNext();
		    }

	    };

        //Return constructor
        return FieldManager;
    })();
});
