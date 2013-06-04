/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger'],
function(EventDispatcher, ObjUtils, L){
    return (function(){
        /**
         * Creates a DispenserManager object
         * @implements {IManager}
         * @constructor
         */
        function DispenserManager(){
	        //super
	        EventDispatcher.call(this);

	        /**
	         * @type {Array.<BaseDispenser>}
	         * @private
	         */
	        this._dispenserList = [];
        }

	    ObjUtils.inheritPrototype(DispenserManager, EventDispatcher);

	    DispenserManager.prototype.addObject = function($dispenser){
		    this._dispenserList.push($dispenser);
		    $dispenser.addManager(this);
	    };

	    DispenserManager.prototype.removeObject = function($dispenser){
		    var idx = this._dispenserList.indexOf($dispenser);
		    if(idx !== -1){
			    this._dispenserList.splice(idx,1);
			    $dispenser.removeManager(this);
		    } else {
			    L.warn('Could not find dispenser in list to remove');
		    }
	    };

	    DispenserManager.prototype.updateDispensers = function($tickDelta){
		    var self = this;

		    if($tickDelta === undefined){$tickDelta = 1;}

		    var disp = null;

		    for(var i = 0, l = this._dispenserList.length; i < l; i++){
				disp = this._dispenserList[i];

			    //Update dispenser tick count
			    disp.pastTicks += $tickDelta;

			    //Dispense if needed
				if(disp.pastTicks >= disp.waitTicks){
					//Dispense
					disp.dispense();
					disp.pastTicks = 0;
				}

		    }

	    };

        //Return constructor
        return DispenserManager;
    })();
});
